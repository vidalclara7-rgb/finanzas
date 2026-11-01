# Diseño: intereses-del-resumen

## Qué pasa hoy (reproducido con un resumen real, que no se sube al repo)

En la sección «C - Comisiones, Gastos e Intereses» cada interés ocupa una fila con fecha, «INTERESES FINANCIACION FC» (y, en la
línea siguiente, el nombre del comercio) e importes. Dos casos fallan en `lectorSantanderTarjeta()`:

- **Fila partida:** en una de las filas, la fecha y el concepto están en una línea del PDF y los importes en otra, 1 punto más
  abajo (`y` 319 y 318). El lector sólo toma la fila si la línea empieza con fecha e importes a la vez: la segunda línea
  (sin fecha) se descarta y el interés se pierde.
- **Pie de página:** tras el último interés, el pie («BANCO SANTANDER, S.A. Domicilio social…») es una línea de un solo texto
  y el lector la toma como continuación del concepto. La descripción queda «INTERESES FINANCIACION FC Banco Santander» y
  `otraCuenta()` la reconoce como una transferencia a la cuenta «Santander».

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Fila partida:** líneas con importes pero sin fecha, cuya `y` está a menos de 3 puntos de la línea anterior sin importes, se
  unen a ella (`lineasPdf()` ya agrupa por `y` exacto: se agrupan las que difieren en 1 o 2 puntos sólo en la sección C).
- **Pie de página:** la continuación del concepto sólo vale si va justo debajo (dentro de 20 puntos) y no empieza por
  «BANCO SANTANDER» ni contiene «Domicilio social»; después de la sección se ignora el pie.
- **Descripción:** «Intereses financiación <comercio>» como hasta ahora.
- **Sin datos nuevos.** Sube la versión de `CACHE`.

## Cómo se implementa en index.html

Cambios sólo en `lectorSantanderTarjeta()` y su prueba con un resumen inventado que reproduce las dos formas (fila partida y pie
de página después del último interés).
