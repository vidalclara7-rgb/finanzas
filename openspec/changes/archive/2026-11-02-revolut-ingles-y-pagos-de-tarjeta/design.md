# Diseño: revolut-ingles-y-pagos-de-tarjeta

## Qué pasa hoy (reproducido el 2026-11-02 con extractos reales, que no se suben al repo)

**Revolut en inglés.** El texto del PDF se extrae bien (183 y 153 líneas), pero `LECTORES` reconoce Revolut por «Extracto en EUR» y
`lectorRevolut` busca «Transacciones de la cuenta», «Dinero saliente/entrante» y «Saldo final». El inglés devuelve `null` y cae al
lector genérico, que no entiende «Oct 5, 2026» ni «€10.00» (punto decimal) y no encuentra filas.

**Pago de la tarjeta duplicado.** Tres resúmenes de tarjeta dejan en la tarjeta cuatro ingresos «Pago» (651,31 + 769,40 + 6,38 +
736,56). El extracto del banco trae las cuatro liquidaciones (769,40, 6,38, 736,56 y 767,47). `otraCuenta()` las manda a la tarjeta
como transferencias, pero `yaEsta()` sólo reconoce la otra mitad si es una transferencia, no un ingreso, así que entran todas.
Resultado: −1070,35 + 1512,34 + 767,47 = +1209,46.

## Decisiones

- **Un solo cambio** para los dos fallos (decidido con la persona el 2026-11-02). Ambos están en la importación y se prueban con
  los mismos extractos de ejemplo.
- **Revolut en inglés: el mismo lector con dos juegos de rótulos**, no un lector aparte. Así el español no cambia y el código de
  filas, columnas y saldo se comparte.
  - Se reconoce por «EUR Statement» y «Revolut Bank». Si el PDF trae además un «USD Statement» (otra cuenta en otra moneda),
    esa parte no se lee: sólo cuentan los movimientos en euros, como en español.
  - Fechas «Oct 5, 2026» (mes abreviado en inglés, día, año) e importes «€10.00» (punto decimal, coma de miles).
  - El saldo final sale de la tabla «Balance summary» (columna «Closing balance», fila «Account (Current Account)»).
  - Los datos de cada línea (a quién, tarjeta, comisión «Fee: €0.10») entran como texto extra, igual que en español.
- **Pago de la tarjeta: reemplazar, no marcar «Ya está».** Se descarta marcar «Ya está» porque el banco perdería el cargo y su
  saldo quedaría 1512,34 € más alto que el real. Se descarta también dejar las dos cosas y pedir que la persona borre una: es
  justo la confusión que causó el fallo.
  - Coincidencia: ingreso en la tarjeta destino (`cuenta` = tarjeta), `tipo: "ingreso"`, mismo importe (±0,005) y fecha a ±3
    días de la línea. Cada ingreso se usa una sola vez (dos pagos iguales cercanos no se pisan).
  - Al guardar, si la línea sigue marcada, se quita ese ingreso y se anota la transferencia con la fecha del banco. Si la persona
    desmarca la línea, no se toca nada.
  - Sólo cuando el destino es una cuenta de tipo `tarjeta` o `financiacion` (una deuda): el ingreso «Pago» de un banco no se
    reemplaza.
- **Sin datos nuevos.** `datos: sin-cambios`. Se sube la versión de `CACHE`.

## Cómo se implementa en index.html

- `LECTORES`: segunda entrada para Revolut en inglés (misma función con parámetro de idioma). `lectorRevolut(L, idioma)` toma los
  rótulos de una tabla (`REV_ES`, `REV_EN`) y el analizador de fecha/importe correspondiente (`fechaEn()`, `dineroEn()`).
- `borradores()`: para cada línea con `que: "t|<tarjeta>"` y `s < 0`, busca el ingreso a reemplazar; guarda `x.reemplaza = id` y
  `marca: "reemplaza"`. Un conjunto de ids evita usar un ingreso dos veces.
- `pintarBorr()`: chip `data-ui="marca-reemplaza-pago"` con «Reemplaza el pago anotado».
- `iGuardar`: antes de anotar, `S.movs = S.movs.filter(y => y.id !== x.reemplaza)` y `desconciliar()` de la tarjeta en el mes de ese
  ingreso.
- Tests con extractos inventados en `tests/extractos.cjs` (builder de Revolut en inglés) y en `tests/importacion.test.cjs`.
