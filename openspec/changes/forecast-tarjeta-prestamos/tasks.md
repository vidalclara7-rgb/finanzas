# Tareas: forecast-tarjeta-prestamos

## Preview
- [x] Preview de Forecast, A pagar de la tarjeta, Inicio y hoja de cuenta con préstamo
- [x] Gate 2 aprobado

## Datos
- [ ] `settings.foreIng` y `pagos` de las tarjetas, limpiados en `norm()`

## Lógica y pantallas
- [ ] Saldos de hoy sin movimientos futuros (`valorCuenta` hasta hoy)
- [ ] Primera cuota de una financiación (`cuotasMes` futuro): sin cuota antes, no bajan las que faltan
- [ ] Forecast: ingreso guardado, «Usar el promedio», tarjeta y préstamo por mes
- [ ] A pagar: fecha de pago con validación; fila de Inicio con «· pagás el …»
- [ ] Hoja de cuenta: «Primera cuota» y la sección del préstamo al crear una financiación
- [ ] `CACHE` de `sw.js` sube

## Tests
- [ ] Un test por escenario (`tests/forecast-prestamos.test.cjs` y los existentes al día)

## Cierre
- [ ] `CLAUDE.md` al día
- [ ] `python3 kit.py check` en verde
- [ ] Capturas de la app real contra el preview
