# Tareas: categorias-propias

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantallas: Ajustes, hoja «Categorías», hoja de una categoría, hoja de movimiento con el desplegable y revisión del extracto
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] `categorias` en los datos: `norm()` crea las de siempre con su color, agrega lo que usen los movimientos, ignora lo inválido y deja «Otros» al final; viaja en la copia

## Pantallas
- [x] Tarjeta «Categorías» en Ajustes y hojas «Categorías» y de una categoría (crear, renombrar, color, siempre fija, borrar con confirmación)
- [x] Renombrar reescribe movimientos, lo aprendido y las reglas de fijos; borrar pasa los movimientos a «Otros» y descarta lo aprendido
- [x] Categorías con comportamiento propio (Otros, Trabajo (reembolsable), Reembolso en ingresos)
- [x] Categoría como desplegable en el movimiento, con «Nueva categoría…» y vuelta a lo que se estaba haciendo
- [x] «Nueva categoría…» en la revisión del extracto
- [x] «Siempre fija»: `esFijo()` en fijos y variables, etiqueta, casilla, sugerencia e importador
- [x] Colores y propuestas del importador salen de las categorías de la persona
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `categorias` (23), `datos` (5) y `movimientos` (los nuevos y los cambiados)
- [ ] Pruebas extra: nombre escapado, 390 px en claro y oscuro

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [ ] `CLAUDE.md`: modelo con `categorias`, `esFijo()`, hojas de categorías y selectores
