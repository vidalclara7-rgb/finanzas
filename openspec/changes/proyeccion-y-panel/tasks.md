# Tareas: proyeccion-y-panel

## Preview
- [ ] Esqueleto del preview: encabezado con «≡», panel de análisis y hoja Forecast (normal y vacío)
- [ ] `python3 kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos y migración
- [ ] Sin migración (`datos: sin-cambios`): confirmar que `norm()` no cambia

## Cálculo
- [ ] `ingresoPromedio()`: hasta tres meses anteriores con ingresos, sin Reembolso
- [ ] `fijosBase()`: gastos fijos del mes anterior, sin compras en cuotas ni reembolsables
- [ ] `proyeccion(ingreso)`: 12 meses desde el que viene con cuotas de `cuotasDelMes()`

## Pantallas
- [ ] Botón «≡» en el encabezado de todas las vistas y panel lateral (abrir, cerrar fuera, Escape)
- [ ] Entradas Forecast, Inversiones (con aviso sin cuentas de inversión) y Radar de noticias deshabilitada
- [ ] Hoja Forecast: resumen, campo de ingreso (sin guardar, con validación), barras y lista por mes
- [ ] `sw.js`: subir `CACHE`

## Tests
- [ ] Un test por escenario (14 de proyección y 7 de interfaz) con `// Escenario: <título>`
- [ ] `python3 kit.py check` en verde

## Prueba en el navegador
- [ ] `python3 kit.py capturas` y revisión en claro y oscuro contra el preview

## Documentación
- [ ] `CLAUDE.md`: panel de análisis y proyección en «Pantallas» y «Cómo funciona»
