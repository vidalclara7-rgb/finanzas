# Tareas: movimientos-y-conciliacion

## Preview (Gate 2)
- [x] Clases nuevas en la hoja de estilos (barras dobles de ingresos y gastos), sin tocar marcado ni lógica
- [x] `preview.html`: Inicio, Movimientos, hoja de movimiento (gasto y transferencia), Cuentas, hoja de cuenta, Cierre, hoja de conciliación, hoja de tarea y Ajustes, con datos y vacías
- [x] `python3 kit.py preview movimientos-y-conciliacion` en verde y capturas en claro y oscuro

## Datos y migración
- [x] Modelo v2 en `norm()`: cuentas con saldo de partida, `movs`, `tareas`, conciliaciones por mes
- [x] Migración de la primera versión: cuentas Tarjeta, Revolut, Débito/efectivo y Fondo de emergencia, gastos asignados, tareas con sus importes y marcas
- [x] Migración de la versión con cuentas (saldo escrito a mano como saldo de partida)
- [x] Abrir dos veces y restaurar copias viejas convierte igual, sin duplicar

## Pantallas y lógica
- [x] Saldo calculado por cuenta con sus movimientos desde el día de partida
- [x] Hoja de movimiento: gasto, ingreso y transferencia; editar; sin cuentas
- [x] Movimientos: lista del mes con signos y totales; borrar con dos toques
- [x] Inicio: resultado del mes, disponibles con anillo por cuenta con tope, torta, barras por semana, ingresos contra gastos por mes, primer paso
- [x] Cuentas: tope, fondo, estado de conciliación; no borrar con movimientos
- [x] Cierre: conciliación (hoja con diferencia, ajuste o pendiente), estado «x de y», checklist editable, plan del fondo con la cuenta marcada
- [x] Cambiar un movimiento de un mes conciliado lo devuelve a «sin conciliar»
- [x] Ajustes: sólo el plan del fondo; resumen del mes nuevo
- [x] Patrimonio del mes al cambiar cuentas o movimientos
- [x] `data-pantalla` y `data-ui` del preview en la app
- [x] Subir `CACHE` en `sw.js`

## Tests
- [x] movimientos: 19 escenarios (con «últimos gastos en Inicio»)
- [x] conciliacion: 8 escenarios
- [x] cuentas: 10 escenarios
- [x] datos: 7 escenarios
- [x] fondo: 5 escenarios
- [x] presupuesto: 6 escenarios (se repuso «tope en aviso», que el delta había perdido)
- [x] cierre-mes: 7 escenarios
- [x] graficos: 8 escenarios del delta (con la forma del gasto del mes) y 4 de la viva
- [x] interfaz: 5 escenarios del delta y 4 de la viva
- [x] Tests de la especificación viva que sigue vigente, adaptados al modelo nuevo; los de gastos retirados se borran junto con su capacidad

## Comprobación y documentación
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` contra el preview aprobado, en claro y oscuro
- [x] `CLAUDE.md`: modelo de datos, pantallas y migración
