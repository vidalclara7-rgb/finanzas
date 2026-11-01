# Diseño: fraccionadas-del-resumen

## Decisiones de la persona (2026-11-01)

- **Compras en cuotas de la tarjeta** (descartado: sólo una lista con lo pendiente): las fraccionadas en curso se anotan y suman a la
  deuda.
- Lo que no entiende de la tarjeta: **que la deuda que muestra no coincide con el resumen**.

## Qué dice el resumen (formato de tarjeta de Santander, ejemplo inventado en los tests)

Tras las secciones A, B y C, una tabla «Operaciones Fraccionadas» con columnas: fecha, descripción (puede partirse en varias
líneas), importe total, cuota «k de m», importe amortizado, intereses, comisiones, total de la cuota e importe pendiente. Lo que
suma el resumen: «Importe a pagar» (incluye la cuota del mes de cada fraccionada) y, aparte, lo pendiente de cada una.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Qué se anota:** por cada fraccionada con k < m, **una compra por lo pendiente** (no por el total original): así la deuda de la
  tarjeta sube exactamente lo que queda por pagar y lo cobrado ya está en el gasto del mes (la línea «CUOTA FRACCIONAR COMPRA …» del
  resumen sigue entrando como gasto normal).
  - Con m − k ≥ 2 cuotas que faltan: gasto de la tarjeta de importe = pendiente, con `cuotas:{n: m−k, cuota: pendiente/(m−k)}` (la
    cuota se redondea al céntimo y la última lleva la diferencia sólo en la deuda; el gasto del mes cuenta la cuota). Fecha: el día
    1 del mes siguiente al del fin del periodo del resumen.
  - Con una sola cuota que falta: gasto normal de la tarjeta por el pendiente, el día 1 del mes siguiente.
  - Nota: la descripción de la compra, unida («MM BARCELON A FO» → «MM BARCELONA FO»: se juntan los trozos y se compactan las
    letras sueltas); categoría propuesta con las mismas reglas de siempre (`reglas`, `PALABRAS`, si no «Otros»).
- **Marca interna `fracc`** en el movimiento (texto): clave de la compra = descripción normalizada + total de cuotas + importe total
  (`normTxt(desc)|m|total`). Sirve para reconocerla en el resumen siguiente: si ya existe un gasto con esa `fracc`, la compra sale
  «Ya está» y no se crea otra. Es un campo opcional más; `norm()` descarta lo que no sea texto.
- **Terminadas** (k = m): no aparecen en el bloque; su cuota del mes entra como gasto, como hoy.
- **Bloque «Compras fraccionadas» en la revisión:** una fila por compra en curso, marcada, con descripción, «Cuota 3 de 5 · pendiente
  42,96 €» y un resumen «Anota 2 cuotas de 21,48 € desde diciembre». Sin fraccionadas, no hay bloque.
- **Conciliación con el resumen:** el saldo del resumen pasa de «importe a pagar» a «importe a pagar + suma de lo pendiente de las
  fraccionadas en curso» (la deuda del contrato). La hoja de conciliar lo dice («Deuda del resumen: a pagar 767,47 € + pendiente en
  cuotas 302,88 €»).
- **Hoja de la tarjeta, «Cómo se calcula la deuda»:** líneas «Deuda anotada al empezar», «Compras» (gastos de la tarjeta, las
  compras en cuotas por su total), «Pagos» (transferencias y cobros que entran a la tarjeta), «Ajustes de conciliación» y «Deuda
  hoy»; y debajo, «De esa deuda, por pagar en cuotas: X» (lo que queda de las compras en cuotas, `cuotaEnMes`) y «Lo demás: Y».
- **Datos (`amplia`):** `movs[i].fracc` opcional. Los movimientos y copias anteriores valen igual.

## Cómo se implementa en index.html

- `lectorSantanderTarjeta()` devuelve además `fraccionadas:[{fecha, desc, total, k, m, pendiente, cuota}]`, leídas con las posiciones de
  la tabla (fecha a la izquierda, «k de m» como ancla, las demás cifras por columna); `saldo` suma lo pendiente.
- `imp.fracc` con las compras en curso; `pintarBorr()` dibuja el bloque; `iGuardar` crea los gastos con `fracc`.
- `norm()` (`fraccNorm`) descarta `fracc` no válido. Detalle de la tarjeta en `abrirCuenta()` («Cómo se calcula la deuda»).
- Sube la versión de `CACHE`.
