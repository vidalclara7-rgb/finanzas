# Diseño: buscar-movimientos

## Decisiones de la persona (2026-10-28)

- **Búsqueda en todos los meses** (descartado: sólo el mes visible).
- **Una línea por movimiento** (descartado: dos líneas). Se conserva el color de la categoría, de la paleta aprobada en
  `paletas-oscura-y-clara`.
- La lupa va **arriba a la derecha**, en el encabezado de Movimientos.

## Cambio pedido al revisar el resultado (2026-10-28, Gate 3)

La descripción y la categoría se cortaban. Entre las opciones, la persona eligió **quitar la cruz de la fila** (descartado:
quitar la categoría, o poner la fecha en una fila por día).

- **Borrar se hace en la hoja del movimiento:** botón `#mBorrar` (peligro) al pie, visible sólo al editar. Dos toques: el primero
  dice «Tocá de nuevo para borrar» (o, si es el último gasto de un documento, «Tocá de nuevo: se borra también su documento»); el segundo borra, cierra la
  hoja y avisa «Movimiento borrado». Como las demás hojas (`cBorrar`), sin temporizador: al cerrar la hoja se reinicia.
- **Los ajustes de conciliación conservan la cruz**, con los dos toques de siempre: no se abren (tocarlos no hace nada), así que
  sin cruz no habría forma de borrarlos. Es la única excepción.
- **Desde una búsqueda o desde la lista de una cuenta:** abrir, borrar y volver a donde se estaba (`volverCta` ya lo hace).
- Cambian los tests que pulsaban la cruz de la fila (`[data-del]`): pasan a borrar desde la hoja.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Qué coincide:** nota, categoría, nombre de la cuenta (y de la de destino en una transferencia) y fecha como texto
  (`AAAA-MM-DD` y `dd/mm`), sin mayúsculas ni tildes (`normTxt()`). Si lo escrito es un número (con coma o punto), también
  coincide el movimiento de ese importe exacto. Varias palabras: todas tienen que aparecer (en cualquier orden).
- **Qué se busca:** todos los tipos de movimiento (gasto, ingreso, transferencia y ajuste), aunque el título diga «buscar
  gastos»; así se encuentra también un cobro o una transferencia.
- **Resultados:** del más reciente al más antiguo, con la fecha completa (`dd/mm/aaaa`) en vez de la corta; arriba,
  «N resultados». Tocar uno abre su hoja y al cerrar se vuelve a la búsqueda (como `volverCta`). Se borra abriéndolo. Mientras se busca se ocultan los totales del mes, el filtro de reembolsos y las acciones de la lista.
- **Cerrar la búsqueda:** la cruz del campo, o la lupa otra vez; al salir de Movimientos también se cierra. Vuelve al
  mes en curso.
- **Fila en una línea:** `[icono 28 px] descripción · categoría … fecha  importe` (y `×` sólo en los ajustes). La descripción es la nota o, si no
  hay, el nombre de la cuenta; la categoría va en gris. Las transferencias muestran «Cuenta → Cuenta» y los ajustes
  «Ajuste de conciliación» (con su cuenta en gris). Las marcas (clip de documento, «Cuota n de m», estado de reembolso, «Fijo») van en una
  segunda fila más fina sólo si el movimiento las tiene. El apilado (`margin-top` negativo) desaparece.
- **Sin datos nuevos:** nada se guarda; el campo de búsqueda no se recuerda.

## Cómo se implementa en index.html

- Botón `#lupaBtn` en el encabezado (visible sólo en Movimientos; `ir()` lo muestra o esconde y cierra la búsqueda),
  campo `#busca` en `#v-movs` y `buscarMovs(q)` sobre `S.movs` (con `movsMes()` no: las compras en cuotas aparecen una
  vez, con su importe total, y fecha de la compra).
- `movHTML()` pasa a una fila: `.mov` con `display:grid`, sin `margin-top` negativo; las marcas, en `.mov .marcas`.
- Los tests que miran `.cat` y `.linea` se actualizan a la fila nueva. Sube la versión de `CACHE`.
