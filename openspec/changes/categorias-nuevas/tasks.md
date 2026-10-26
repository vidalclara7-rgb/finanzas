# Tareas: categorias-nuevas

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «hoja-movimiento»: elección de categoría de gasto (con las cinco nuevas) e ingreso (con «Reembolso por regalos»)
- [x] Pantalla «inicio»: torta y lista de categorías con las nuevas y sus colores
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] Sin migración (`datos: sin-cambios`): comprobar que lo guardado y las `reglas` siguen valiendo

## Pantallas
- [x] Sumar las cinco categorías a `CATS` (antes de «Trabajo (reembolsable)») y «Reembolso por regalos» a `INGRESOS`
- [x] Dar `--cat15` a `--cat19` en `NUM_CAT` y definirlas en `:root`, en oscuro y en las cuatro paletas, con contraste 4,5 a 1
- [x] Añadir a `CATS_OSC` las que queden oscuras
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `movimientos` (gasto en categoría nueva, todas elegibles, reembolso por regalos)
- [x] Tests de `interfaz`: mismo color en torta, lista y tarjeta; contraste en las cuatro paletas, claro y oscuro

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [x] Actualizar la lista de categorías y de colores en `CLAUDE.md`
