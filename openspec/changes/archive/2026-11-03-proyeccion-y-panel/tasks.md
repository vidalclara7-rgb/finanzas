# Tareas: proyeccion-y-panel

## Preview
- [x] Esqueleto del preview: encabezado con «≡», panel de análisis y hoja Forecast (normal y vacío)
- [x] `python3 kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos y migración
- [x] Sin migración (`datos: sin-cambios`): confirmar que `norm()` no cambia

## Cálculo
- [x] `ingresoPromedio()`: hasta tres meses anteriores con ingresos, sin Reembolso
- [x] `fijosBase()`: gastos fijos del mes anterior, sin compras en cuotas ni reembolsables
- [x] `proyeccion(ingreso)`: 12 meses desde el que viene con cuotas de `cuotasDelMes()`

## Pantallas
- [x] Botón «≡» en el encabezado de todas las vistas y panel lateral (abrir, cerrar fuera, Escape)
- [x] Entradas Forecast, Inversiones (con aviso sin cuentas de inversión) y Radar de noticias deshabilitada
- [x] Hoja Forecast: resumen, campo de ingreso (sin guardar, con validación), barras y lista por mes
- [x] `sw.js`: subir `CACHE`

## Tests
- [x] Un test por escenario (14 de proyección y 7 de interfaz) con `// Escenario: <título>`
- [x] `python3 kit.py check` en verde

## Prueba en el navegador
- [x] `python3 kit.py capturas` y revisión en claro y oscuro contra el preview

## Documentación
- [x] `CLAUDE.md`: panel de análisis y proyección en «Pantallas» y «Cómo funciona»
