# Tareas: moneda-y-movimientos

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «inicio»: sin las tarjetas chicas de últimos gastos
- [x] Pantalla «movs»: tarjetas con la moneda (EUR sin marca, USD y otra con su código)
- [x] Pantalla «hoja-movimiento»: selector de moneda (EUR, USD, GBP, Otra con código) y aviso «Los totales no convierten monedas»
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] `movs[i].moneda` opcional (ausente = EUR): comprobar que `norm()` no lo toca y que copias viejas valen
- [x] La moneda viaja en la copia de seguridad y al restaurar

## Pantallas
- [x] Quitar las tarjetas de últimos gastos de Inicio (marcado, CSS y código)
- [x] Selector de moneda en la hoja de movimiento, con «Otra» y su validación de 3 letras
- [x] Mostrar la moneda en la tarjeta del movimiento y el aviso de que no se convierte
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `movimientos` (Inicio sin gastos recientes, movimiento en otra moneda, elegir USD, otra moneda, código inválido, sin conversión, anteriores en euros)
- [x] Tests de `datos` (versión anterior, copia vieja, la moneda viaja en la copia)

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [x] Actualizar el modelo de datos y las pantallas en `CLAUDE.md`
