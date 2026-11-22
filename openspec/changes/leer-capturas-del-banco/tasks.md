# Tareas: leer-capturas-del-banco

## Preview
- [ ] Marcar el cambio como `preview: no` (no hay pantallas nuevas ni cambios visibles de diseño) y pasar a `diseno-aprobado`

## Datos y migración
- [ ] Confirmar que no hay migración (`datos: sin-cambios`): sin cambios en `norm()`

## Lógica
- [ ] Sacar el texto real que devuelve el lector de fotos con capturas del mismo formato (inventadas) y fijarlo como base de los tests
- [ ] `fechaDe()`: mes en letras (castellano e inglés), con año obligatorio
- [ ] `lectorListaPorDia()` y su uso en `leerArchivo()` para foto, PDF escaneado y texto
- [ ] Varias fotos: `#pdfIn` con `multiple`, aviso «Elegí varias fotos o un solo archivo.», «Leyendo N fotos…»
- [ ] Unir capturas quitando sólo el tramo solapado, en cualquier orden
- [ ] «Ya está» con tolerancia de ±3 días para lo leído de un archivo sin fecha valor
- [ ] Guardar cada captura como adjunto del mes del último movimiento
- [ ] Aviso siempre (también ante fallos inesperados) y aviso de «sin movimientos» de seis segundos

## Service worker
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario (17), con `// Escenario: <título exacto>`, a 390 px en claro y en oscuro

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y revisar claro y oscuro

## Documentación
- [ ] `CLAUDE.md`: lector de listas por día, varias capturas y aviso
