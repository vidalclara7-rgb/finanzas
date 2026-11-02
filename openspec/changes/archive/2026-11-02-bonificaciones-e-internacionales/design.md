# Diseño: bonificaciones-e-internacionales

## Qué pasa hoy (2026-11-02)

- `otraCuenta()` reconoce una cuenta propia por los dígitos del texto (últimos cuatro del número de contrato de la tarjeta). El texto de la
  bonificación lleva ese contrato («… Del Contrato 0049 0755 50 21947146»), así que el abono llega como `t|<tarjeta>`.
- `otraCuenta()` y `propuestaCat()` sólo reconocen « transferencia internacional » (español).

## Decisiones

- **Bonificación = ingreso**, decidido con la persona el 2026-11-02 («ingresos reales»). Se descarta dejarlas como transferencia a la
  tarjeta (deja la deuda de la tarjeta de menos) y se descarta marcarlas «Ya está».
  - Regla: si el texto normalizado contiene « bonificacion », `otraCuenta()` devuelve `null` (no es una transferencia entre cuentas
    propias) y la propuesta de categoría de ingresos ya la manda a «Intereses y rendimientos».
  - Va antes que la búsqueda por dígitos. Una regla aprendida `t|` para esa descripción sigue mandando, porque `borradores()` la mira antes que `otraCuenta()`.
- **International Transfer = Transferencia internacional.** Misma regla, con las dos frases: « transferencia internacional » y
  « international transfer ». Sale a una cuenta fuera de la app (la persona la usa en otra moneda): gasto en Regalos o la categoría aprendida.
- **Sin datos nuevos.** Sube la versión de `CACHE`. `preview: no`.

## Cómo se implementa en index.html

- `otraCuenta()`: dos líneas al principio (internacional en inglés; bonificación).
- `propuestaCat()`: la misma frase en inglés.
- Tests en `tests/importacion.test.cjs` con extractos inventados.
