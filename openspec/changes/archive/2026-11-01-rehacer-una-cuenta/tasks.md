# Tareas: rehacer-una-cuenta

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantallas: hoja de la tarjeta con «Borrar todos sus movimientos» (y su confirmación), revisión del resumen con la casilla de saldo anterior y Ajustes con el respaldo de antes de borrar
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] El respaldo (`finanzas-respaldo`) admite el motivo `borrado` con el nombre de la cuenta; los demás respaldos se leen como siempre

## Pantallas
- [x] `borrarTodosCta()` con la lógica de `borrarMov()`, conciliaciones de la cuenta y confirmación de dos toques
- [x] Respaldo antes de borrar (y aviso si hay uno de datos ilegibles)
- [x] Hoja de la cuenta: botón «Borrar todos sus movimientos» (sólo con movimientos)
- [x] El lector de la tarjeta devuelve el saldo anterior; casilla `#iInicio` en la revisión y aplicar deuda inicial y fecha al guardar
- [x] Ajustes: texto del respaldo de antes de borrar
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `cuentas`, `importacion` y `datos`

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado
- [x] Con el resumen real (sin subirlo): borrar, volver a importar y comprobar que la diferencia al conciliar es 0

## Documentación
- [x] `CLAUDE.md`: borrar todos los movimientos de una cuenta, respaldo `borrado` y saldo anterior del resumen
