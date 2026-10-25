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
- [x] `pdfjs-dist` con versión fijada en `vendor/`, con su licencia; en `FILES` del service worker
- [x] Se carga sólo al importar; funciona sin conexión
- [x] `CLAUDE.md`: permitir esta única dependencia

## Datos
- [x] `cuentas[i].ref`, `reglas`, `movs[i].origen` y el índice de adjuntos; `norm()` crea lo que falte
- [x] Adjuntos en IndexedDB (archivo, cuenta, mes, nombre, tipo)

## Lectores de extractos
- [x] Líneas con posición desde el PDF
- [x] Revolut cuenta en euros
- [x] Santander movimientos de cuenta
- [x] Santander tarjeta de crédito
- [x] Reconocer formato y últimos cuatro dígitos; no reconocido → aviso

## Revisión y consolidación
- [x] Borradores con tipo, categoría y marca; guardar sólo lo marcado; cerrar sin guardar
- [x] Categoría: regla aprendida, palabras conocidas, Otros; aprender al guardar
- [x] «Ya está» (misma cuenta, fecha e importe) y «Anulada»
- [x] Transferencias entre cuentas propias y la otra mitad ya cargada
- [x] Reembolso por «Gastos» en el concepto, con los gastos que cubre
- [x] Gastos fijos: los borradores que coinciden con una regla de fijo llegan marcados
- [x] Conciliar con el extracto (coincide → conciliada; no coincide → hoja de conciliación)

## Adjuntos
- [x] El extracto importado queda adjunto con su mes
- [x] Adjuntar a mano PDF o foto; abrir y borrar con confirmación
- [x] Aviso en Ajustes con cuántos hay

## Pantallas
- [x] `data-pantalla` y `data-ui` del preview en la app
- [x] Subir `CACHE` en `sw.js`

## Tests
- [x] Extractos inventados generados por los tests en los tres formatos (nunca los reales)
- [x] importacion: 15 escenarios
- [x] adjuntos: 4 escenarios
- [x] datos: 1 escenario

## Comprobación y documentación
- [x] Probar los lectores contra los extractos reales fuera del repo (sin copiar nada)
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas`
- [x] `CLAUDE.md`: modelo de datos, pantallas y dependencia

## Gate 3, primera ronda
- [x] Categoría de gasto Regalos (`--cat13` en las cuatro paletas, colores por nombre)
- [x] Transferencia internacional a tu nombre: gasto en Regalos o la categoría aprendida
- [x] Avisos arriba con una hoja abierta; nunca más anchos que la pantalla
- [x] Tests: transferencia internacional, otra categoría recordada, aviso con la hoja abierta
- [x] Copia de prueba privada para Safari del iPhone

