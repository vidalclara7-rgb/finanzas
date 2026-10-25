# Tareas: reembolsos

## Preview (Gate 2)
- [x] `preview.html`: Inicio con «Por cobrar», Movimientos con el filtro de reembolsos, hoja de gasto con el estado y hoja de ingreso de Reembolso con los gastos a marcar
- [x] `python3 kit.py preview reembolsos` en verde y capturas en claro y oscuro

## Datos
- [x] `norm()`: los gastos de «Trabajo (reembolsable)» sin estado quedan `pendiente` (al cargar y al restaurar)

## Pantallas y lógica
- [x] Tarjetas de color según su contenido (disponibles y grupos por tipo, semana, ingresos y gastos, conciliación, checklist) y Trabajo (reembolsable) en frambuesa con texto blanco
- [x] Estado del reembolso en la hoja del gasto y en su tarjeta; se quita al cambiar de categoría
- [x] Tarjeta «Por cobrar» en Inicio
- [x] Ingreso de Reembolso: marcar gastos que cubre, aviso de diferencia, vínculo; al borrar el ingreso vuelven a Aprobado
- [x] Filtro de reembolsos en Movimientos con conteos y suma
- [x] `data-pantalla` y `data-ui` del preview en la app
- [x] Subir `CACHE` en `sw.js`

## Tests
- [x] reembolsos: 10 escenarios
- [x] datos: 2 escenarios
- [x] interfaz: 4 escenarios del requisito de estilo sustituido

## Comprobación y documentación
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` contra el preview aprobado
- [x] `CLAUDE.md`: modelo de datos y pantallas
