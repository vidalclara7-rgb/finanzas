# Diseño: fecha-sin-desborde

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- El problema es de WebKit en iOS: los `input type=date` toman un ancho intrínseco. No se reproduce en el
  navegador de prueba (Chromium), así que el test comprueba el contrato (el campo termina dentro de la hoja) y la
  corrección usa el estilo estándar para eso, sin tocar el selector del sistema.
- Se corrige para todos los campos de fecha y de mes, no sólo el de «Nuevo movimiento».

## Cómo se implementa en index.html

- En la regla de estilo de los campos (`input[type=date]`, `input[type=month]`): `min-width:0`, `width:100%`,
  `max-width:100%`, `-webkit-appearance:none` y `text-align:left`, y `display:block` para que no tome el ancho del
  contenido.
- Sin cambios en los datos. Sube la versión de `CACHE` en `sw.js`.
