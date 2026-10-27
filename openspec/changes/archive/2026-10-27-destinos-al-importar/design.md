# Diseño: destinos-al-importar

## Decisiones de la persona (2026-10-26)

- Plata «a cuenta» (garantía): **cuenta propia, sin ser gasto** (descartadas: ingreso con categoría «Garantía», que
  infla los ingresos aunque la plata salió; y gasto excluido de los totales, que sigue siendo un gasto).
- Importador: **crear la cuenta desde la lista y recordar el destino** (descartadas: sólo recordar, y sólo crear).

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **No hace falta un concepto nuevo para la garantía:** con «Nueva cuenta…» la persona crea «Garantía» como
  «Deudas compartidas» (me deben) y manda la transferencia ahí. Transferir a una cuenta «me deben» suma a su valor,
  así que el patrimonio no cambia.
- **Qué se recuerda:** la descripción del comercio (la misma clave que ya usa lo aprendido) y la cuenta de
  destino. Sirve para pagos y cobros: «Transferencia a» y «Transferencia desde» usan la misma cuenta.
- **Qué gana:** lo recordado por la persona va antes que lo que el importador deduce por el texto. Si en una
  descripción la persona elige después un gasto o un ingreso, el destino recordado se descarta y se aprende
  la categoría (y a la inversa).
- **Cuenta borrada o igual a la que se importa:** lo recordado se ignora sin error y se propone como siempre.
- **Volver a la revisión:** abrir «Nueva cuenta» oculta la hoja de revisión sin cerrarla; al guardar o cerrar, se
  reabre con lo que había. Si se cierra sin guardar, el movimiento queda como estaba.

## Cómo se implementa en index.html

- `S.reglas` gana claves `"t|<comercio>"` con el id de la cuenta de destino; lo viejo (`"g|…"`, `"i|…"`) no cambia.
  `reglasNorm()` descarta las `"t|…"` cuyo valor no sea un número de una cuenta existente al usarlas (no se borran:
  una copia restaurada puede traer la cuenta después).
- `opcionesQue()` suma la opción `"n|cuenta"` «Nueva cuenta…»; al elegirla abre `sheetC` y, al guardar, pone
  `x.que = "t|<idNueva>"` en ese borrador. Un estado `imp.volver` vuelve a la hoja de importar.
- `propuesta` del borrador consulta primero `S.reglas["t|"+k]`; el guardado la actualiza y limpia las `g|`/`i|`
  de la misma clave (y a la inversa).
- Sin cambios en `norm()` ni en la clave de `localStorage`. Sube la versión de `CACHE` en `sw.js`.

- **Fecha de partida de la cuenta nueva (decidido al construir):** una cuenta creada desde la revisión parte en la fecha del movimiento más viejo del extracto (o en hoy, si es anterior), para que las transferencias del extracto cuenten en su saldo. Es lo que dice el escenario «mandar plata a una inversión que no existía» (Broker X tiene 200 €).
