# Tareas: a-pagar-tarjeta

## Preview
- [x] Preview de Inicio con «A pagar de la tarjeta» y de su hoja
- [x] Gate 2 aprobado

## Datos
- [x] `cierres` en las tarjetas y `cierresNorm()` en `norm()` (al cargar y al restaurar)

## Pantallas y lógica
- [x] `cierreDe()` y `aPagar()`: deuda al cierre menos cuotas que vencen después, mínimo 0
- [x] Tarjeta «A pagar de la tarjeta» en Inicio (sólo con tarjetas de crédito), mes que se ve, estado del cierre
- [x] Hoja «A pagar de la tarjeta»: fecha por tarjeta, validación del mes, borrar, detalle
- [x] `CACHE` de `sw.js` sube

## Tests
- [x] Un test por escenario en `tests/a-pagar-tarjeta.test.cjs`
- [x] Contraste y que nada se pise con la tarjeta nueva

## Cierre
- [x] `CLAUDE.md` al día (modelo de datos y pantalla)
- [x] `python3 kit.py check` en verde
- [x] Capturas de la app real contra el preview
