# Tareas: bonificaciones-e-internacionales

## Datos y migración
- [x] Sin migración (`datos: sin-cambios`)

## Lógica
- [x] `otraCuenta()`: «International Transfer» como «Transferencia internacional» (gasto, no transferencia propia)
- [x] `otraCuenta()`: una bonificación no es una transferencia entre cuentas propias
- [x] `propuestaCat()`: «International Transfer» a Regalos (o la categoría aprendida)
- [x] `sw.js`: subir `CACHE`

## Tests
- [x] Un test por escenario (3 de transferencia internacional, 3 de bonificación) con `// Escenario: <título>`
- [x] `python3 kit.py check` en verde

## Prueba en el navegador
- [x] Probar en local con el extracto real del banco y el de Revolut en inglés (sin subirlos)

## Documentación
- [x] `CLAUDE.md`: las dos reglas en el párrafo de la importación
