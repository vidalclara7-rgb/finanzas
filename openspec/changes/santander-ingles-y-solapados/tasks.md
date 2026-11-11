# Tareas: santander-ingles-y-solapados

## Preview
- [ ] Esqueleto del preview: revisión del extracto con la línea de resumen (normal y vacío)
- [ ] `python3 kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos y migración
- [ ] Sin migración (`datos: sin-cambios`)

## Lectura
- [ ] `lectorSantanderCuentaEn()`: filas, signo «−» suelto, fecha valor, concepto en dos líneas, saldo disponible, número de cuenta y titular
- [ ] Entrada en `LECTORES`; extracto sin movimientos avisa

## Solapados
- [ ] «Ya está» con cuenta: cada movimiento guardado cubre uno solo del extracto (también la otra mitad de una transferencia)
- [ ] Línea de resumen de la revisión (periodo, nuevos y ya estaban)
- [ ] `sw.js`: subir `CACHE`

## Tests
- [ ] Constructor de PDF de Santander en inglés en `tests/extractos.cjs`
- [ ] Un test por escenario (15) con `// Escenario: <título>`
- [ ] `python3 kit.py check` en verde

## Prueba en el navegador
- [ ] `python3 kit.py capturas` y revisión contra el preview
- [ ] Probar en local con el extracto real de noviembre sobre los anteriores (sin subirlo)

## Documentación
- [ ] `CLAUDE.md`: lector en inglés, «Ya está» con cuenta y resumen de la revisión
