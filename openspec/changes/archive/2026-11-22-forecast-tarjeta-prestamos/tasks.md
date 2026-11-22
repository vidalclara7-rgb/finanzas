# Tareas: forecast-tarjeta-prestamos

## Preview
- [x] Preview de Forecast, A pagar de la tarjeta, Inicio y hoja de cuenta con préstamo
- [x] Gate 2 aprobado

## Datos
- [x] `settings.foreIng` y `pagos` de las tarjetas, limpiados en `norm()`

## Lógica y pantallas
- [x] Saldos de hoy sin movimientos futuros (`valorCuenta` hasta hoy)
- [x] Primera cuota de una financiación (`cuotasMes` futuro): sin cuota antes, no bajan las que faltan
- [x] Forecast: ingreso guardado, «Usar el promedio», tarjeta y préstamo por mes
- [x] A pagar: fecha de pago con validación; fila de Inicio con «· pagás el …»
- [x] Hoja de cuenta: «Primera cuota» y la sección del préstamo al crear una financiación
- [x] `CACHE` de `sw.js` sube

## Tests
- [x] Un test por escenario (`tests/forecast-prestamos.test.cjs` y los existentes al día)

## Cierre
- [x] `CLAUDE.md` al día
- [x] `python3 kit.py check` en verde
- [x] Capturas de la app real contra el preview
