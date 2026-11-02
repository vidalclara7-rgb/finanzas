# Tareas: revolut-ingles-y-pagos-de-tarjeta

## Preview
- [x] Esqueleto del preview y pantalla de la revisión del extracto con la marca «Reemplaza el pago anotado» (normal y vacío)
- [x] `python3 kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos y migración
- [x] Sin migración (`datos: sin-cambios`): confirmar que `norm()` no cambia

## Lectura de Revolut en inglés
- [x] Rótulos en español e inglés para el lector de Revolut; reconocer «EUR Statement» en `LECTORES`
- [x] Fechas «Oct 5, 2026» e importes «€10.00»
- [x] Saldo final desde «Balance summary» (solo la cuenta en euros; ignorar «USD Statement»)
- [x] Extracto sin transacciones: avisa «No encontré movimientos en este archivo.»

## Pago de la tarjeta
- [x] `borradores()`: línea de pago a tarjeta que coincide con un ingreso «Pago» (importe, ±3 días, cada ingreso una vez)
- [x] Marca «Reemplaza el pago anotado» (`data-ui="marca-reemplaza-pago"`) en la revisión
- [x] Guardar: quitar el ingreso reemplazado y anotar la transferencia; desmarcada no cambia nada
- [x] `sw.js`: subir `CACHE`

## Tests
- [x] Builder de Revolut en inglés en `tests/extractos.cjs`
- [x] Un test por escenario (6 de Revolut en inglés, 8 de pagos de la tarjeta) con `// Escenario: <título>`
- [x] `python3 kit.py check` en verde

## Prueba en el navegador
- [x] `python3 kit.py capturas` y revisión en claro y oscuro contra el preview
- [x] Probar con los extractos reales en local (sin subirlos): Revolut inglés y banco tras tres resúmenes de tarjeta

## Documentación
- [x] `CLAUDE.md`: lector de Revolut en inglés y reemplazo del pago de la tarjeta
