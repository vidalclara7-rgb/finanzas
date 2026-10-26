# Diseño: adjuntos-en-gastos

## Decisiones de la persona (2026-10-26)

- Modo «Seleccionar» en Movimientos, no un adjunto por gasto suelto. Sin etiqueta IRPF: se descartó
  porque sólo hace falta guardar el documento, no clasificarlo.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- Sólo se seleccionan gastos del mes que se está viendo. Para otro mes, se cambia de mes y se repite.
- Un documento queda vinculado a todos los gastos marcados. Si se borra un gasto, sólo se quita de la
  lista de ese documento; si era el último gasto, el documento también se borra y la confirmación de
  borrar el gasto lo dice antes.
- Un documento de gastos no aparece en la hoja de ninguna cuenta: vive en sus gastos.
- Tope de tamaño: el mismo que ya rige para los adjuntos de cuenta.

## Cómo se implementa en index.html

- IndexedDB `finanzas-adjuntos`, almacén `archivos`: el registro suma `movs: [idMov, ...]` (opcional) y
  `cuenta` queda en `null` en estos. Los registros viejos no cambian. Sin migración en `norm()`: `S` y
  la clave de `localStorage` no se tocan.
- Movimientos guarda `seleccion` (conjunto de ids) mientras el modo está activo; no se persiste.
- Al borrar un movimiento se recorre el almacén: se quita su id de `movs` y se borra el registro que
  quede vacío.
- Sube la versión de `CACHE` en `sw.js`.
- Riesgo asumido: como los adjuntos no entran en la copia, restaurar una copia en otro teléfono deja los
  documentos fuera; ya pasa hoy y Ajustes lo avisa.
