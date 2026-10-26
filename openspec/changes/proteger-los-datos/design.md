# Diseño: proteger-los-datos

## Decisiones de la persona (2026-10-26)

- Aviso en **Ajustes e Inicio a los 7 días** (descartadas: a los 30 días, que deja demasiado margen, y
  sólo en Ajustes, que casi nadie abre).
- Restaurar **pide confirmar y guarda lo anterior** (descartadas: sólo confirmar, que pierde lo que había,
  y dejarlo como está, un toque para reemplazar todo).
- Copia como archivo y restauración desde archivo, además del texto.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Qué cuenta como copia:** copiar el texto o guardar el archivo con éxito. Cancelar la hoja de compartir
  no cuenta. Restaurar no cambia la fecha: no sabemos de cuándo es esa copia.
- **«Hace N días»** se cuenta en días de calendario; avisa en Inicio con N ≥ 7. Sin datos cargados (sin
  cuentas ni movimientos) no avisa. Sin fecha de copia y con datos, avisa «Todavía no hiciste ninguna».
- **Un solo respaldo guardado**, el más reciente: «antes de restaurar» o «no se pudo leer». Uno nuevo
  reemplaza al anterior. Restaurar el respaldo guarda a su vez lo que había (se puede ir y volver).
- **El aviso de Inicio no se puede descartar**; sólo desaparece al hacer la copia. Es una molestia
  deliberada: el costo de perder todo es mucho mayor. Si molesta, se cambia en otro cambio.
- **Archivo:** `mis-finanzas-AAAA-MM-DD.json`, con el mismo texto que se copia. Se ofrece por la hoja de
  compartir del sistema (en iPhone permite «Guardar en Archivos») y, si no está disponible, se descarga.
- **Restaurar desde archivo** carga el texto en el mismo cuadro de pegar y usa el mismo botón con su
  confirmación: un solo camino de restauración.
- **Datos ilegibles:** el texto guardado no es JSON, o no tiene la forma de la app, o convertirlo falla.
  Se guarda tal cual, la app abre vacía y avisa. Si no había nada guardado (primer uso), no hay respaldo
  ni aviso.

## Cómo se implementa en index.html

- Claves nuevas de `localStorage`, separadas de `finanzas-v1` (ésta y su formato no cambian):
  - `finanzas-copia`: `{"fecha":"AAAA-MM-DD"}`, la última copia hecha.
  - `finanzas-respaldo`: `{"texto":"<original>","motivo":"restaurar"|"ilegible","fecha":"AAAA-MM-DD"}`.
- `load()` guarda el texto original en `finanzas-respaldo` (motivo `ilegible`) antes de caer en la app
  vacía, cuando había algo guardado que no pudo leer. `persist()` al arrancar ya no puede perder el
  original. Todo con `try/catch`: si ni el respaldo cabe, se sigue sin él.
- «Restaurar copia»: primer toque cambia el texto a «Tocá de nuevo: reemplaza todo lo que tenés»; el segundo
  valida, guarda `JSON.stringify(S)` como respaldo (motivo `restaurar`) y reemplaza. Una copia inválida se
  rechaza antes de guardar nada.
- Archivo: `Blob` con `navigator.share({files})` si `navigator.canShare` lo permite; si no, un enlace con
  `download`. `AbortError` no cuenta. Restaurar: `<input type="file" accept=".json,application/json,text/plain">`
  que pone el texto en `#backupIn`.
- Las tarjetas de Inicio y Ajustes se pintan en `render()` con `esc()` donde corresponda.
- Sin cambios en `norm()`: no se toca el formato de los datos. Sube la versión de `CACHE` en `sw.js`.
- La copia sigue siendo `JSON.stringify(S)`; los adjuntos no entran.
