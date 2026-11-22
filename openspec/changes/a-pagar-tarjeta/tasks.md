# Tareas: a-pagar-tarjeta

## Preview
- [x] Preview de Inicio con «A pagar de la tarjeta» y de su hoja
- [x] Gate 2 aprobado

## Datos
- [ ] `cierres` en las tarjetas y `cierresNorm()` en `norm()` (al cargar y al restaurar)

## Pantallas y lógica
- [ ] `cierreDe()` y `aPagar()`: deuda al cierre menos cuotas que vencen después, mínimo 0
- [ ] Tarjeta «A pagar de la tarjeta» en Inicio (sólo con tarjetas de crédito), mes que se ve, estado del cierre
- [ ] Hoja «A pagar de la tarjeta»: fecha por tarjeta, validación del mes, borrar, detalle
- [ ] `CACHE` de `sw.js` sube

## Tests
- [ ] Un test por escenario en `tests/a-pagar-tarjeta.test.cjs`
- [ ] Contraste y que nada se pise con la tarjeta nueva

## Cierre
- [ ] `CLAUDE.md` al día (modelo de datos y pantalla)
- [ ] `python3 kit.py check` en verde
- [ ] Capturas de la app real contra el preview
