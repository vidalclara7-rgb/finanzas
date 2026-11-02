# Tareas: revolut-ingles-y-pagos-de-tarjeta

## Preview
- [ ] Esqueleto del preview y pantalla de la revisión del extracto con la marca «Reemplaza el pago anotado» (normal y vacío)
- [ ] `python3 kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos y migración
- [ ] Sin migración (`datos: sin-cambios`): confirmar que `norm()` no cambia

## Lectura de Revolut en inglés
- [ ] Rótulos en español e inglés para el lector de Revolut; reconocer «EUR Statement» en `LECTORES`
- [ ] Fechas «Oct 5, 2026» e importes «€10.00»
- [ ] Saldo final desde «Balance summary» (solo la cuenta en euros; ignorar «USD Statement»)
- [ ] Extracto sin transacciones: avisa «No encontré movimientos en este archivo.»

## Pago de la tarjeta
- [ ] `borradores()`: línea de pago a tarjeta que coincide con un ingreso «Pago» (importe, ±3 días, cada ingreso una vez)
- [ ] Marca «Reemplaza el pago anotado» (`data-ui="marca-reemplaza-pago"`) en la revisión
- [ ] Guardar: quitar el ingreso reemplazado y anotar la transferencia; desmarcada no cambia nada
- [ ] `sw.js`: subir `CACHE`

## Tests
- [ ] Builder de Revolut en inglés en `tests/extractos.cjs`
- [ ] Un test por escenario (6 de Revolut en inglés, 8 de pagos de la tarjeta) con `// Escenario: <título>`
- [ ] `python3 kit.py check` en verde

## Prueba en el navegador
- [ ] `python3 kit.py capturas` y revisión en claro y oscuro contra el preview
- [ ] Probar con los extractos reales en local (sin subirlos): Revolut inglés y banco tras tres resúmenes de tarjeta

## Documentación
- [ ] `CLAUDE.md`: lector de Revolut en inglés y reemplazo del pago de la tarjeta
