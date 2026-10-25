# Tareas: reembolsos

## Preview (Gate 2)
- [ ] `preview.html`: Inicio con «Por cobrar», Movimientos con el filtro de reembolsos, hoja de gasto con el estado y hoja de ingreso de Reembolso con los gastos a marcar
- [ ] `python3 kit.py preview reembolsos` en verde y capturas en claro y oscuro

## Datos
- [ ] `norm()`: los gastos de «Trabajo (reembolsable)» sin estado quedan `pendiente` (al cargar y al restaurar)

## Pantallas y lógica
- [ ] Estado del reembolso en la hoja del gasto y en su tarjeta; se quita al cambiar de categoría
- [ ] Tarjeta «Por cobrar» en Inicio
- [ ] Ingreso de Reembolso: marcar gastos que cubre, aviso de diferencia, vínculo; al borrar el ingreso vuelven a Aprobado
- [ ] Filtro de reembolsos en Movimientos con conteos y suma
- [ ] `data-pantalla` y `data-ui` del preview en la app
- [ ] Subir `CACHE` en `sw.js`

## Tests
- [ ] reembolsos: 10 escenarios
- [ ] datos: 2 escenarios

## Comprobación y documentación
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` contra el preview aprobado
- [ ] `CLAUDE.md`: modelo de datos y pantallas
