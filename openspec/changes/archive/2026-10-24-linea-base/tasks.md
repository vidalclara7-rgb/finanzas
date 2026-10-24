# Tareas: linea-base

Sin pantallas nuevas (`preview: no`) ni cambios en los datos (`datos: sin-cambios`): no se toca la
app. Si un test destapa un error de la app, se anota en `design.md` para un cambio propio y el test
documenta el comportamiento actual.

## Tests por capacidad (uno o más por escenario, `// Escenario: <título>`)
- [x] gastos: 9 escenarios (el de importe vacío o cero se separó en dos) en `tests/gastos.test.cjs`
- [x] presupuesto: 6 escenarios en `tests/presupuesto.test.cjs`
- [x] fondo: 5 escenarios en `tests/fondo.test.cjs`
- [x] cierre-mes: 3 escenarios en `tests/cierre-mes.test.cjs`
- [x] cuentas: 11 escenarios en `tests/cuentas.test.cjs`
- [x] datos: 7 escenarios en `tests/datos.test.cjs`
- [x] interfaz: 5 escenarios en `tests/interfaz.test.cjs`

## Comprobación
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas`: revisar la app real en claro y en oscuro

## Documentación
- [x] `design.md`: anotar lo que hayan destapado los tests
