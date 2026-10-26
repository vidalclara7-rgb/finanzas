# Tareas: compras-en-cuotas

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «hoja-movimiento»: gasto en tarjeta con «Pagar en cuotas», número de cuotas y valor de la cuota; avisos de error
- [x] Pantalla «movs»: tarjeta de una compra con «Cuota 1 de 3»
- [x] Pantalla «cuentas»: hoja de la tarjeta con «Cuotas de este mes»
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] `movs[i].cuotas` opcional `{n, cuota}` sólo en gastos de tarjeta: `norm()` no lo toca y las copias viejas valen
- [x] Datos guardados con `cuotas` inválidas (no tarjeta, n < 2, cuota mayor que el total): se ignoran al cargar
- [x] Las cuotas viajan en la copia de seguridad y al restaurar

## Pantallas
- [x] Función única `importeEnMes(m, mes)` y que todos los cálculos por mes pasen por ella (totales, categorías, topes, resultado, fijos y variables, torta, barras, ingresos y gastos, resumen)
- [x] Hoja de movimiento: «Pagar en cuotas» sólo en gastos de tarjeta, con validación («Poné 2 cuotas o más», «La cuota no puede ser mayor que el total»)
- [x] Tarjeta del movimiento: «Cuota k de n»
- [x] Hoja de la tarjeta: «Cuotas de este mes: X € · N compras en cuotas»
- [x] Borrar una compra borra todas sus cuotas (confirmación)
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `movimientos` (compra fraccionada, cuotas siguientes, después de la última, cuota mayor que el total, menos de dos cuotas, tope de la tarjeta, sólo en tarjetas, borrar la compra)
- [x] Tests de `cuentas` (cuotas del mes, sin compras en cuotas) y `datos` (versión anterior, la copia conserva las cuotas)

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [x] Actualizar el modelo de datos y las pantallas en `CLAUDE.md`
