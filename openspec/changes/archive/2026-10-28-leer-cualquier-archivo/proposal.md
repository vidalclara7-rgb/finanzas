---
cambio: leer-cualquier-archivo
estado: archivado
datos: amplia
archivado: 2026-10-28
---
# Importar desde cualquier archivo y adjuntar con un solo botón

## Por qué

La app sólo lee tres formatos de PDF en castellano. Un export de tarjeta de Santander en inglés, en PDF o en Excel, da «No
reconozco este extracto»: no hay forma de cargar sus movimientos sin escribirlos a mano. Además, en la hoja de cada cuenta
hay dos botones casi iguales («Adjuntar archivo» e «Importar extracto»), y adjuntar sólo admite PDF y fotos, que ni siquiera se
leen.

## Qué cambia

- **La app lee cualquier tabla de movimientos**: busca filas con fecha, descripción e importe, sea cual sea el formato. Los tres
  formatos conocidos siguen leyéndose como hasta ahora; el resto, con un lector genérico.
- **Archivos que lee:** PDF, Excel (.xlsx), CSV y texto. **Fotos** (y PDF escaneados, sin texto) con reconocimiento de texto
  (OCR) dentro de la app: se añade una librería (Tesseract) en `vendor/`, la segunda dependencia del proyecto, tras pdf.js.
- **Siempre se revisa antes de guardar**, con la misma pantalla de revisión de hoy: categoría propuesta, «Ya está», transferencias
  entre cuentas propias, etc.
- **Un solo botón «Adjuntar archivo»** en la hoja de la cuenta. Acepta fotos y archivos de cualquier tipo. Guarda el archivo en
  la cuenta y, si encuentra movimientos, pregunta «Encontré N movimientos. ¿Querés revisarlos?».
- **«Importar extracto» de Movimientos** acepta los mismos archivos y usa el mismo lector.
- **Documentos de gastos** («Adjuntar documento» con gastos marcados) también aceptan cualquier tipo de archivo (no se leen).

## A quién afecta

A todas las personas. Lo guardado sigue valiendo; los adjuntos pueden ahora ser de más tipos (los de antes se siguen abriendo).

## Pantallas

- Hoja de cuenta: la sección Adjuntos con un solo botón.
- Hoja «Importar extracto»: mensajes de lectura y la pregunta de importar.
- Movimientos: el botón «Importar extracto» acepta más tipos.

## Fuera de alcance

- Interpretar con inteligencia artificial: haría falta un servidor y una clave, y la app no tiene backend.
- Excel antiguo (.xls), Word, ZIP y demás: se adjuntan y se abren, pero no se leen. PDF con contraseña, tampoco.
- Convertir monedas: se toma el importe tal cual, y la columna de moneda se ignora.
- Leer saldos de extractos desconocidos (la conciliación con el extracto sólo se ofrece en los formatos conocidos).
- Leer fotos con muy poca luz, torcidas o con el texto cortado: puede fallar, y siempre se avisa.
