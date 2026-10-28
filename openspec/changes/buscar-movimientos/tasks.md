# Tareas: buscar-movimientos

## Preview
- [x] Clases nuevas en `index.html`: movimiento en una línea, segunda fila de marcas, lupa y campo de búsqueda
- [x] Crear el esqueleto del preview
- [x] Pantallas: Movimientos (lista en una línea, con y sin datos), búsqueda con resultados y búsqueda sin resultados
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [ ] Sin datos nuevos: nada que migrar ni guardar

## Pantallas
- [ ] `movHTML()` en una línea, con marcas en una segunda fila sólo si las hay, sin apilado
- [ ] Lupa en el encabezado (sólo Movimientos) y campo `#busca`
- [ ] `buscarMovs()`: palabras, importe exacto, fecha, sin mayúsculas ni tildes, todos los meses
- [ ] Resultados con fecha completa y «N resultados»; «Sin resultados para «…».»; totales y acciones ocultos
- [ ] Abrir un resultado y volver a la búsqueda; borrar desde los resultados; cerrar la búsqueda al salir
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `movimientos` (los nuevos y los que cambian a una línea); actualizar los que miran `.cat` y `.linea`
- [ ] 390 px sin desbordes con descripción larga

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado

## Documentación
- [ ] `CLAUDE.md`: pantalla Movimientos (una línea, búsqueda)
