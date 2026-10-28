# Tareas: leer-cualquier-archivo

## Preview
- [x] Preview: hoja de cuenta con un solo botón, lectura de una foto, pregunta «Encontré N movimientos» y pregunta de signo
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos
- [ ] Adjuntos con más tipos (`pdf`, `foto`, `excel`, `texto`, `otro`): los registros viejos se leen igual, sin migración

## Lectura de archivos
- [ ] Lector de ZIP y de Excel (.xlsx) sin librerías; lector de CSV y texto
- [ ] Lector genérico de tablas (fechas, importes, cabeceras, cargo/abono, número de tarjeta)
- [ ] Pregunta de signo cuando todos los importes son positivos
- [ ] Tesseract en `vendor/tesseract/` (con licencias) y lectura de fotos y PDF escaneados
- [ ] Mensajes: sin movimientos, archivo ilegible, foto sin texto, lector de fotos que no carga, archivo vacío

## Pantallas
- [ ] Hoja de cuenta: un solo botón «Adjuntar archivo» que acepta cualquier tipo; pregunta «Encontré N movimientos»
- [ ] Movimientos: «Importar extracto» y documentos de gastos aceptan cualquier tipo
- [ ] El adjunto pasa al mes del último movimiento si se importan los movimientos
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `importacion`, `adjuntos` y `datos`, con archivos fabricados (xlsx, csv, PNG, PDF) con datos inventados; actualizar los que usaban «Importar extracto» de la hoja de cuenta y el aviso viejo
- [ ] Pruebas extra: ZIP con entradas deflate y stored, fechas y importes en formatos distintos

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado

## Documentación
- [ ] `CLAUDE.md`: Tesseract entre las dependencias de `vendor/`, lectura de cualquier archivo y adjuntos de cualquier tipo
