---
cambio: leer-capturas-del-banco
estado: aprobada
datos: sin-cambios
---
# Importar movimientos desde capturas de pantalla del banco

## Por qué

Hasta que el banco cierra el mes no genera el PDF del extracto. Mientras tanto, la persona hace capturas del historial de movimientos de la app del banco y quiere subirlas. Hoy la app dice que lee fotos, pero con estas capturas no importa nada y no avisa de lo que pasó:

- El historial agrupa por día: la fecha va sola en un encabezado («21 NOV 2026») y debajo vienen las filas con descripción e importe, **sin fecha propia**. La app sólo entiende filas que traen fecha e importe juntos.
- La fecha va con el mes en letras abreviado, que la app no reconoce.
- Una captura no abarca todo el mes: hacen falta varias, y entre una y otra se solapan filas. Hoy sólo se puede elegir un archivo por vez.

## Qué cambia

- Se lee una lista de movimientos agrupada por día (fecha en un encabezado, filas con descripción e importe debajo), en foto o en cualquier archivo con ese formato. Las fechas con el mes en letras, en castellano o en inglés, se reconocen.
- Se pueden elegir **varias capturas a la vez**. Se leen juntas y se revisan en una sola hoja; las filas que se repiten porque una captura solapa con otra se cuentan una sola vez.
- La app dice siempre qué pasó al terminar de leer: cuántos movimientos encontró (en la revisión) o por qué no encontró ninguno. Mientras lee, lo avisa.
- Los movimientos de una captura que coinciden con otros ya guardados (misma cuenta, mismo importe, fecha a ±3 días) salen como «Ya está», para que importar después el PDF del cierre no duplique nada.

## A quién afecta

A cualquier persona que importe movimientos desde una foto o una captura, de cualquier banco cuyo historial agrupe por día. Nada está pensado para un banco concreto. Quien importa PDF, Excel o CSV no nota cambios.

## Pantallas

- **Movimientos → Importar extracto**: el selector de archivos admite elegir varias fotos.
- **Aviso «Leyendo la foto…»**: dice cuántas fotos son cuando hay varias.
- **Revisión del extracto** (existente): sin cambios de diseño. Es la misma hoja, con los movimientos de todas las capturas.
- No hay pantallas nuevas.

## Fuera de alcance

- Capturas cuyas fechas no traen el año o el día completo: esas filas no se leen.
- Movimientos «pendientes» o provisionales del banco que luego cambian de importe: se leen como cualquier otro.
- Corregir a mano un importe mal leído por el reconocimiento de texto dentro de la revisión: se desmarca el movimiento y se anota a mano.
- Saldo para conciliar: las capturas del historial no lo traen, así que no se ofrece conciliar.
- Elegir varios archivos que no sean fotos a la vez.
- Mejorar la calidad del reconocimiento de texto (el motor es el mismo).
