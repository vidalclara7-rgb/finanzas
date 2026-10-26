# Diseño: moneda-y-movimientos

## Decisiones de la persona (2026-10-26)

- Las tarjetas de últimos gastos se quitan de Inicio; Movimientos las conserva (ya tiene tarjetas
  apiladas del mismo estilo) y suma la moneda.
- Moneda como **etiqueta sin convertir**. (Descartadas: moneda por cuenta, que dejaría fuera de los
  totales las cuentas en otra moneda; y conversión a euros, que pide un dato más en cada movimiento.)
- Selector: EUR, USD, GBP y «Otra» con código libre de tres letras.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- Para no confundir, la tarjeta de un movimiento en EUR no muestra la moneda extra: el importe sigue
  con «€». En otra moneda, el importe lleva su código («−20 USD»).
- Consecuencia asumida: un gasto de 20 USD resta 20 del saldo de su cuenta y suma 20 al total del mes.
  Se avisa una vez en la hoja del movimiento: «Los totales no convierten monedas».
- «Otra» se guarda en mayúsculas; si no son tres letras, la app avisa y no guarda.

## Cómo se implementa en index.html

- `movs[i].moneda?: "USD"|"GBP"|"XXX"` sólo cuando no es EUR; ausente = EUR. No hace falta migrar:
  `norm()` no cambia y la clave de `localStorage` tampoco. Copias viejas valen tal cual.
- `movHTML()` pinta la moneda; `eur()` no cambia. Se quita el bloque de `#ultimos` de Inicio y su CSS.
- Sube la versión de `CACHE` en `sw.js`.
