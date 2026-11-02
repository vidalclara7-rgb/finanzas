# Tareas: bonificaciones-e-internacionales

## Datos y migración
- [ ] Sin migración (`datos: sin-cambios`)

## Lógica
- [ ] `otraCuenta()`: «International Transfer» como «Transferencia internacional» (gasto, no transferencia propia)
- [ ] `otraCuenta()`: una bonificación no es una transferencia entre cuentas propias
- [ ] `propuestaCat()`: «International Transfer» a Regalos (o la categoría aprendida)
- [ ] `sw.js`: subir `CACHE`

## Tests
- [ ] Un test por escenario (3 de transferencia internacional, 3 de bonificación) con `// Escenario: <título>`
- [ ] `python3 kit.py check` en verde

## Prueba en el navegador
- [ ] Probar en local con el extracto real del banco y el de Revolut en inglés (sin subirlos)

## Documentación
- [ ] `CLAUDE.md`: las dos reglas en el párrafo de la importación
