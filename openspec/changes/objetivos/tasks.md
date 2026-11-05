# Tareas: objetivos

## Preview
- [x] Esqueleto del preview: panel con «Objetivos», hoja «Objetivos», hoja de edición con plan, tarjeta «Toca transferir» en Inicio, tarjeta «Objetivos» en Cierre y Ajustes sin el plan (normal y vacío)
- [x] `python3 kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos y migración
- [ ] `objetivosNorm()` en `norm()`: crea el objetivo del fondo desde `settings`, valida los guardados, idempotente
- [ ] Orden en `norm()` (después de la cuenta «Fondo de emergencia» de la primera versión) y al restaurar copia

## Cálculo
- [ ] `planDe(o)`, `saldoObjetivoEn(o, k)`, `estadoObjetivo(o, k)`, `llegaA(o)` (el plan del fondo sigue funcionando)
- [ ] `pendientesTransferir()` para Inicio
- [ ] `icsObjetivo(o)` con escape de texto, meses sin aporte y alarma

## Pantallas
- [ ] Panel: entrada «Objetivos»
- [ ] Hoja «Objetivos» (lista con progreso, estado y fecha límite) y formulario con validaciones y plan mes a mes
- [ ] «Agregar al calendario» y «Borrar objetivo» en dos toques
- [ ] Tarjeta «Toca transferir» en Inicio y tarjeta «Objetivos» en Cierre (en lugar de «Plan del fondo»)
- [ ] Ajustes sin el plan del fondo; resumen para copiar con objetivos
- [ ] `sw.js`: subir `CACHE`

## Tests
- [ ] Reescribir `tests/fondo.test.cjs` como tests de objetivos y ajustar `tests/interfaz.test.cjs`
- [ ] Un test por escenario (58) con `// Escenario: <título>`
- [ ] `python3 kit.py check` en verde

## Prueba en el navegador
- [ ] `python3 kit.py capturas` y revisión en claro y oscuro contra el preview
- [ ] Probar la migración con una copia real en local (sin subirla)

## Documentación
- [ ] `CLAUDE.md`: modelo de datos (`objetivos`), `norm()`, panel, Inicio, Cierre y Ajustes
