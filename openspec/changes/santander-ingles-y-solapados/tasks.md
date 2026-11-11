# Tareas: santander-ingles-y-solapados

## Preview
- [x] Esqueleto del preview: revisión del extracto con la línea de resumen (normal y vacío)
- [x] `python3 kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos y migración
- [x] Sin migración (`datos: sin-cambios`)

## Lectura
- [x] `lectorSantanderCuentaEn()`: filas, signo «−» suelto, fecha valor, concepto en dos líneas, saldo disponible, número de cuenta y titular
- [x] Entrada en `LECTORES`; extracto sin movimientos avisa

## Solapados
- [x] «Ya está» con cuenta: cada movimiento guardado cubre uno solo del extracto (también la otra mitad de una transferencia)
- [x] Línea de resumen de la revisión (periodo, nuevos y ya estaban)
- [x] `sw.js`: subir `CACHE`

## Tests
- [x] Constructor de PDF de Santander en inglés en `tests/extractos.cjs`
- [x] Un test por escenario (15) con `// Escenario: <título>`
- [x] `python3 kit.py check` en verde

## Prueba en el navegador
- [x] `python3 kit.py capturas` y revisión contra el preview
- [x] Probar en local con el extracto real de noviembre sobre el anterior (hecho: 9 nuevos y 31 ya estaban, sin subirlo)

## Documentación
- [x] `CLAUDE.md`: lector en inglés, «Ya está» con cuenta y resumen de la revisión
