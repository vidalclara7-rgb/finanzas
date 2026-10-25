# Tareas: movimientos-y-conciliacion

## Preview (Gate 2)
- [ ] Clases nuevas en la hoja de estilos (barras dobles de ingresos y gastos), sin tocar marcado ni lógica
- [ ] `preview.html`: Inicio, Movimientos, hoja de movimiento (gasto y transferencia), Cuentas, hoja de cuenta, Cierre, hoja de conciliación, hoja de tarea y Ajustes, con datos y vacías
- [ ] `python3 kit.py preview movimientos-y-conciliacion` en verde y capturas en claro y oscuro

## Datos y migración
- [ ] Modelo v2 en `norm()`: cuentas con saldo de partida, `movs`, `tareas`, conciliaciones por mes
- [ ] Migración de la primera versión: cuentas Tarjeta, Revolut, Débito/efectivo y Fondo de emergencia, gastos asignados, tareas con sus importes y marcas
- [ ] Migración de la versión con cuentas (saldo escrito a mano como saldo de partida)
- [ ] Abrir dos veces y restaurar copias viejas convierte igual, sin duplicar

## Pantallas y lógica
- [ ] Saldo calculado por cuenta con sus movimientos desde el día de partida
- [ ] Hoja de movimiento: gasto, ingreso y transferencia; editar; sin cuentas
- [ ] Movimientos: lista del mes con signos y totales; borrar con dos toques
- [ ] Inicio: resultado del mes, disponibles con anillo por cuenta con tope, torta, barras por semana, ingresos contra gastos por mes, primer paso
- [ ] Cuentas: tope, fondo, estado de conciliación; no borrar con movimientos
- [ ] Cierre: conciliación (hoja con diferencia, ajuste o pendiente), estado «x de y», checklist editable, plan del fondo con la cuenta marcada
- [ ] Cambiar un movimiento de un mes conciliado lo devuelve a «sin conciliar»
- [ ] Ajustes: sólo el plan del fondo; resumen del mes nuevo
- [ ] Patrimonio del mes al cambiar cuentas o movimientos
- [ ] `data-pantalla` y `data-ui` del preview en la app
- [ ] Subir `CACHE` en `sw.js`

## Tests
- [ ] movimientos: 18 escenarios
- [ ] conciliacion: 8 escenarios
- [ ] cuentas: 10 escenarios
- [ ] datos: 7 escenarios
- [ ] fondo: 5 escenarios
- [ ] presupuesto: 5 escenarios
- [ ] cierre-mes: 7 escenarios
- [ ] graficos: 5 escenarios
- [ ] interfaz: 3 escenarios
- [ ] Tests de la especificación viva que sigue vigente, adaptados al modelo nuevo; los de gastos retirados se borran junto con su capacidad

## Comprobación y documentación
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` contra el preview aprobado, en claro y oscuro
- [ ] `CLAUDE.md`: modelo de datos, pantallas y migración
