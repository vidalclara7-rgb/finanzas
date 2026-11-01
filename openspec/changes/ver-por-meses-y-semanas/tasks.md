# Tareas: ver-por-meses-y-semanas

## Preview
- [x] Clases nuevas en `index.html`: selector de mes junto al título, encabezados de semana y de día
- [x] Crear el esqueleto del preview
- [x] Pantallas: Inicio, Movimientos (con semanas y días, y sin movimientos) y Cierre, con el selector de mes
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] Sin datos nuevos: el mes elegido vive en memoria

## Pantallas
- [x] `mesVista` y `mesV()`; Inicio, Movimientos y Cierre usan el mes elegido; el selector con flechas, desactivado en el mes en curso
- [x] Patrimonio al cierre del mes elegido (`totales(hasta)`); barras de la semana de hoy sólo en el mes en curso; seis meses terminando en el elegido
- [x] Cierre: conciliar y ajustar un mes ya cerrado (fecha de cierre = último día)
- [x] Movimientos agrupados por semana y día, con totales; categorías juntas dentro del día; filas sin fecha
- [x] La búsqueda y la lista de una cuenta siguen planas y con fecha
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `meses` (8) y de `movimientos` (los nuevos y los que cambian)
- [x] 390 px sin desbordes con los encabezados de semana y día

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado

## Documentación
- [x] `CLAUDE.md`: mes elegido, semanas y días en Movimientos
