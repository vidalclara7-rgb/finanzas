# Tareas: fraccionadas-del-resumen

## Preview
- [x] Clases necesarias en `index.html` (bloque de fraccionadas en la revisión, desglose de la deuda)
- [x] Crear el esqueleto del preview
- [x] Pantallas: revisión del resumen con «Compras fraccionadas», conciliar con la deuda del resumen y hoja de la tarjeta con «Cómo se calcula la deuda»
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] `fracc` opcional en los movimientos; `norm()` descarta lo que no sea texto (`fraccNorm`)

## Lectura
- [x] `lectorSantanderTarjeta`: leer la tabla de operaciones fraccionadas (descripción en varias líneas, «k de m», pendiente)
- [x] El saldo del resumen suma lo pendiente de las fraccionadas en curso

## Pantallas
- [x] Revisión: bloque «Compras fraccionadas» (marcadas, «Ya está» si ya se anotaron)
- [x] Guardar: compra en cuotas por lo pendiente (o gasto normal si falta una cuota), desde el mes siguiente, con `fracc`
- [x] Conciliar: «Deuda del resumen» con el detalle (a pagar + pendiente en cuotas)
- [x] Hoja de la tarjeta: «Cómo se calcula la deuda» y lo que queda por pagar en cuotas
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `importacion`, `cuentas` y `datos` (resumen inventado con fraccionadas)
- [x] Pruebas extra: descripciones partidas en varias líneas, resumen sin la tabla

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado

## Documentación
- [x] `CLAUDE.md`: fraccionadas, `fracc`, conciliación con lo pendiente y desglose de la tarjeta
