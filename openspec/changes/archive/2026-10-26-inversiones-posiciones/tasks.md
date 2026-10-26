# Tareas: inversiones-posiciones

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «cuentas»: botón «Ver rendimiento» en el grupo de inversiones
- [x] Pantalla «hoja-inversiones»: activos con cantidad, valor y rendimiento; total de la cuenta; «Nuevo activo» y «Nueva operación»; estado vacío
- [x] Pantalla «hoja-activo»: alta de activo, precio actual y operaciones del activo (historial)
- [x] Pantalla «hoja-operacion»: compra o venta con fecha, cantidad, precio y comisión
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] `S.activos` y `S.ops` vacíos en `norm()` sin cambiar `v` (al cargar y al restaurar); copias viejas valen
- [x] Ignorar al restaurar operaciones huérfanas o inválidas (activo inexistente, cantidad o precio no positivos, tipo desconocido)
- [x] Activos y operaciones viajan en la copia de seguridad

## Pantallas
- [x] `valorCuenta()` para inversiones con activos: efectivo (con compras y ventas) más posiciones a su precio actual; sin activos, como hoy
- [x] Precio actual: último precio anotado por fecha (operación o «Actualizar precio»); sin precio vale 0
- [x] Rendimiento por activo (caja) y por cuenta, en euros y en %
- [x] Botón «Ver rendimiento» en Cuentas y hoja «Inversiones»
- [x] Alta de activo (nombre obligatorio) y actualizar precio (mayor que 0)
- [x] Nueva operación: compra o venta, validaciones («No tenés tantas unidades», «Poné una cantidad y un precio mayores que 0»), aviso de efectivo negativo
- [x] Editar y borrar operaciones (no borrar una compra que respalda ventas) y borrar activos con confirmación
- [x] Borrar una cuenta borra sus activos y operaciones
- [x] Compras y ventas no cuentan como gasto ni ingreso
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `inversiones` (27) y `datos` (4)

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [x] Actualizar el modelo de datos, `valorCuenta()` y las pantallas en `CLAUDE.md`
