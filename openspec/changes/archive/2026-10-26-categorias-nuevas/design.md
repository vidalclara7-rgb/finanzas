# Diseño: categorias-nuevas

## Decisiones de la persona (2026-10-26)

- Las cinco de gasto, con los nombres que pidió.
- «Reembolsos por gastos regalos» es un **ingreso**: «Reembolso por regalos». Sin seguimiento de
  cobro: es un ingreso normal. (Descartadas: categoría de gasto aparte, que inflaría el gasto sin
  descontar el regalo; y reembolso con estados, que quedó fuera.)

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- Orden de la lista de gasto: las nuevas van después de «Regalos» y antes de «Trabajo
  (reembolsable)»; «Otros» sigue al final.
- Nombres exactos: «Salidas bar/disco», «Plan Iberia», «Servicios mensuales», «Alquiler», «Carga
  móvil» e ingreso «Reembolso por regalos».
- «Plan Iberia» es una marca concreta y no sirve igual a todas las personas; se incluye porque la
  persona lo pidió. Si más adelante hay categorías propias, esta es la primera candidata a salir.

## Cómo se implementa en index.html

- `CATS` suma las cinco y `INGRESOS` suma «Reembolso por regalos». Ni `norm()` ni la clave de
  `localStorage` cambian: lo guardado sigue valiendo y `reglas` sólo acepta categorías de `CATS`.
- `NUM_CAT` da `--cat15` a `--cat19` a las nuevas (la 14 es Ropa). Cada variable se define en `:root`,
  en modo oscuro y en las cuatro paletas, con contraste 4,5 a 1; `CATS_OSC` lleva las que queden oscuras.
- Las tarjetas de ingreso siguen verdes claras, sin color propio por categoría.
- Sube la versión de `CACHE` en `sw.js`.
