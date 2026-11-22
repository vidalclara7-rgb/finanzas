# Diseño: lo que hay que pagar de la tarjeta al cierre

Fecha: 2026-11-22. Origen: la persona pidió ver qué tendría que pagar de la tarjeta de crédito al cierre del mes en curso; cada mes carga la fecha de cierre que le da el banco.

## Decisiones

| Tema | Decisión | Descartado |
|---|---|---|
| Fecha de cierre | Una por tarjeta y por mes, la carga la persona (el banco la mueve cada mes) | Fin de mes fijo (no coincide con el banco); un día de corte fijo (la persona dijo que la fecha cambia) |
| Sin fecha cargada | Cuenta el último día del mes, y la tarjeta dice «Sin fecha de cierre» | No mostrar nada hasta que la cargue |
| Qué se paga | Deuda a la fecha de cierre (saldo de la tarjeta con los movimientos hasta ese día) menos las cuotas de las compras en cuotas que vencen después de ese mes | Sólo los gastos del periodo: no ve lo que quedó sin pagar del resumen anterior |
| Dónde | Tarjeta en Inicio, que abre una hoja con el detalle y la fecha | Hoja de la cuenta o Cierre (la persona eligió Inicio) |
| Mes | El mes que se ve en Inicio | Siempre el de hoy |
| Fecha fuera del mes | Se rechaza: «Elegí una fecha de <mes>.» | Aceptarla y desordenar los periodos |

## Modelo y migración

- Cuenta de tipo `tarjeta`: `cierres?: {"AAAA-MM": "AAAA-MM-DD"}` (la fecha cae en ese mes).
- `cierresNorm()` en `norm()` (al cargar y al restaurar): conserva sólo las entradas con clave AAAA-MM y una fecha válida de ese mes; borra `cierres` si queda vacío o si la cuenta no es tarjeta. Sin `cierres`, nada que migrar.

## Implementación en `index.html`

- `cierreDe(c, mes)`: la fecha cargada o el último día del mes. `aPagar(c, mes)`: `deuda = -valorCuenta(c, cierre)`; `vienen = Σ cuotasQuedan(m, mesSig(mes,1))` de sus compras en cuotas; `max(0, deuda − vienen)`.
- Inicio: `#pagarCard` (`.card.par`, color 8, `data-ui="a-pagar-tarjeta"`) después de «Cuotas del mes»; una fila por tarjeta y el total. `pintarPagar()` en `render()`.
- Hoja `#sheetPagar` (`data-pantalla="a-pagar-tarjeta"`), `abrirPagar()`: por tarjeta, `<input type="date">` con `min`/`max` del mes, filas «Deuda al cierre», «Cuotas que vienen después», «A pagar». Al cambiar la fecha se guarda (`save()`), se avisa «Fecha de cierre guardada» y se recalcula; vacío la borra.
- `esc()` en el nombre de cada tarjeta.
- `sw.js`: `CACHE` sube (después del cambio `abrir-gastado-ingresado`).
