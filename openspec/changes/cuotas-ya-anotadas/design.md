# Diseño: cuotas-ya-anotadas

## Qué pasa hoy (reproducido con tres resúmenes reales, que no se suben al repo)

Importando de agosto a octubre en una tarjeta vacía (con la casilla del saldo anterior), la diferencia al conciliar es 0, 115,42 € y
248,06 €. Los 115,42 € son exactamente las cinco líneas «CUOTA FRACCIONAR COMPRA» de septiembre de compras que ya se habían anotado
con el resumen de agosto (19,21 + 21,40 + 33,33 + 20,68 + 20,80).

La razón: la deuda del resumen es «a pagar + lo pendiente». Al anotar una fraccionada por lo pendiente se cuenta la deuda de sus
cuotas futuras. Cuando esa cuota se cobra, el pendiente baja lo mismo que sube lo a pagar: la deuda no cambia. La app, en cambio,
anota la línea de la cuota como un gasto más y la deuda sube dos veces (y el gasto del mes también: la compra en cuotas ya cuenta
la cuota de ese mes).

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Cuándo se salta una cuota:** la línea «CUOTA FRACCIONAR COMPRA <descripción>» se desmarca si hay una compra con la misma `fracc`
  (descripción normalizada, número total de cuotas e importe total, leídos de la tabla de fraccionadas del mismo resumen) y esa
  compra ya cubre el mes de la cuota (`cuotas.desde` ≤ el mes de la línea).
- **Marca:** `marca:"cuota"`, «Cuota ya anotada», con la misma presentación que «Ya está».
- **La tabla completa:** el lector devuelve también las fraccionadas terminadas (`fraccTodas`, con `k = m`) para reconocer la última
  cuota; el bloque «Compras fraccionadas» sigue mostrando sólo las que siguen en curso.
- **Los intereses** de cada mes no se saltan (el pendiente baja sólo por la parte amortizada).
- **Sin datos nuevos.** Sube la versión de `CACHE`.

## Cómo se implementa en index.html

`lectorSantanderTarjeta()` devuelve `fraccTodas`; `borradores()` marca las líneas de cuota cubiertas; `pintarBorr()` ya pinta las
marcas. Tests con tres resúmenes inventados encadenados.
