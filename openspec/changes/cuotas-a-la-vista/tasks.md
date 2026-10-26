# Tareas: cuotas-a-la-vista

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «inicio»: tarjeta «Cuotas del mes» (con datos y sin cuotas)
- [x] Pantalla «hoja-cuotas»: detalle por financiación y por compra en cuotas
- [x] Pantalla «hoja-cuenta»: botón «Ver movimientos»
- [x] Pantalla «hoja-movimientos-cuenta»: lista por mes con flechas, con datos y mes vacío
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] `cuentas[i].cuotasMes` en financiaciones con `cuotas`: `norm()` lo pone al mes actual si falta y lo descarta si no es un mes válido (al cargar y al restaurar)
- [x] El mes de partida viaja en la copia; copias viejas valen

## Pantallas
- [x] `cuotasFaltan(c, mes)`: bajan solas, mes a mes; al llegar a cero no suma; `detalleCuenta()`, el resumen de Cuentas y la tarjeta usan ese cálculo
- [x] Editar «Cuotas que faltan» reinicia el mes de partida sólo si el número cambia
- [x] Tarjeta «Cuotas del mes» en Inicio y hoja «Cuotas» (financiaciones y compras en cuotas de tarjeta, con lo que queda por pagar)
- [x] «Ver movimientos» en la hoja de cuenta y hoja «Movimientos de la cuenta» con flechas de mes (sin pasar del mes actual)
- [x] Editar desde la lista y volver a ella (mismo mes) al guardar o cerrar
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `cuotas` (11), `cuentas` (5) y `datos` (4)
- [x] Pruebas extra: textos escapados, 390 px en claro y oscuro sin desbordes, borrar un movimiento desde la lista

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [x] `CLAUDE.md`: `cuotasMes`, la tarjeta de cuotas, la lista de movimientos de una cuenta y las pantallas
