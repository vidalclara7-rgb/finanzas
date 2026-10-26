# Tareas: adjuntos-en-gastos

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «movs»: botón «Seleccionar», casillas, barra con «Adjuntar documento», clip y filtro «Con documento»
- [x] Pantalla «hoja-movimiento»: sección «Documentos» de un gasto
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [ ] Registros de adjuntos con `movs: [ids]` opcional y `cuenta` nula; los registros viejos no cambian y `S` no se toca
- [ ] Ajustes cuenta también los documentos de gastos en el aviso de la copia
- [ ] Restaurar una copia con gastos que ya no existen: el documento no aparece en ningún gasto

## Pantallas
- [ ] Modo «Seleccionar» en Movimientos: casillas sólo en gastos, contador «N seleccionados», «Cancelar»
- [ ] «Adjuntar documento» (PDF o foto) vinculado a todos los gastos marcados; aviso «Documento adjuntado a N gastos»; «Elegí un PDF o una foto»
- [ ] Clip en las tarjetas con documento y filtro «Con documento» (con «Ningún gasto de este mes tiene documento.»)
- [ ] Hoja del gasto: lista de documentos, abrir y quitar con dos toques
- [ ] Borrar un gasto: quita su id de los documentos; si era el último, borra el documento y la confirmación lo dice
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `movimientos`, `adjuntos` y `datos`

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [ ] Actualizar la sección de adjuntos y las pantallas en `CLAUDE.md`
