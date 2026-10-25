# Tareas: importar-extractos

## Preview (Gate 2)
- [x] Movimientos con «Importar extracto»
- [x] Hoja de importación: elegir la cuenta (primera vez) y revisar borradores con sus marcas («Ya está», «Anulada», transferencia, Reembolso)
- [x] Después de guardar: «Conciliar con el extracto»
- [x] Hoja de cuenta con adjuntos, «Adjuntar archivo» e «Importar extracto»
- [x] Ajustes con el aviso de adjuntos fuera de la copia
- [x] Aviso de archivo no reconocido
- [x] `python3 kit.py preview importar-extractos` en verde y capturas en claro y oscuro

## Lector de PDF
- [ ] `pdfjs-dist` con versión fijada en `vendor/`, con su licencia; en `FILES` del service worker
- [ ] Se carga sólo al importar; funciona sin conexión
- [ ] `CLAUDE.md`: permitir esta única dependencia

## Datos
- [ ] `cuentas[i].ref`, `reglas`, `movs[i].origen` y el índice de adjuntos; `norm()` crea lo que falte
- [ ] Adjuntos en IndexedDB (archivo, cuenta, mes, nombre, tipo)

## Lectores de extractos
- [ ] Líneas con posición desde el PDF
- [ ] Revolut cuenta en euros
- [ ] Santander movimientos de cuenta
- [ ] Santander tarjeta de crédito
- [ ] Reconocer formato y últimos cuatro dígitos; no reconocido → aviso

## Revisión y consolidación
- [ ] Borradores con tipo, categoría y marca; guardar sólo lo marcado; cerrar sin guardar
- [ ] Categoría: regla aprendida, palabras conocidas, Otros; aprender al guardar
- [ ] «Ya está» (misma cuenta, fecha e importe) y «Anulada»
- [ ] Transferencias entre cuentas propias y la otra mitad ya cargada
- [ ] Reembolso por «Gastos» en el concepto, con los gastos que cubre
- [ ] Gastos fijos: los borradores que coinciden con una regla de fijo llegan marcados
- [ ] Conciliar con el extracto (coincide → conciliada; no coincide → hoja de conciliación)

## Adjuntos
- [ ] El extracto importado queda adjunto con su mes
- [ ] Adjuntar a mano PDF o foto; abrir y borrar con confirmación
- [ ] Aviso en Ajustes con cuántos hay

## Pantallas
- [ ] `data-pantalla` y `data-ui` del preview en la app
- [ ] Subir `CACHE` en `sw.js`

## Tests
- [ ] Extractos inventados generados por los tests en los tres formatos (nunca los reales)
- [ ] importacion: 15 escenarios
- [ ] adjuntos: 4 escenarios
- [ ] datos: 1 escenario

## Comprobación y documentación
- [ ] Probar los lectores contra los extractos reales fuera del repo (sin copiar nada)
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas`
- [ ] `CLAUDE.md`: modelo de datos, pantallas y dependencia
