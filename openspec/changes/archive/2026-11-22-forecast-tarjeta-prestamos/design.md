# Diseño: Forecast con ingreso guardado, el resumen de la tarjeta y préstamos

Fecha: 2026-11-22. Origen: la persona pidió (1) guardar el ingreso del Forecast, que vuelve a 740 € cada vez que entra; (2) ver en el Forecast lo de la tarjeta que cierra este mes y se paga a principio del siguiente, con una fecha de pago además de la de cierre; (3) cargar un préstamo que le van a dar para mudarse, con su devolución, y verlo en la proyección.

## Decisiones

| Tema | Decisión | Descartado |
|---|---|---|
| Ingreso | Uno solo guardado (`settings.foreIng`) hasta que se cambie; «Usar el promedio» lo borra (elegido por la persona) | Uno por mes |
| Fecha de pago | Una por tarjeta y por mes, junto a la de cierre (`pagos:{"AAAA-MM":"AAAA-MM-DD"}`, clave = mes del cierre). Posterior al cierre y como mucho el último día del mes siguiente | Día fijo de pago |
| Tarjeta en el Forecast | Sólo el resumen del mes en curso (`aPagar(c, mes actual)`), en el mes de su fecha de pago (sin fecha: el mes siguiente) si cae en los 12 meses | Estimar resúmenes futuros |
| Cuotas con tarjeta | Al resumen también se le restan las cuotas del mes de sus compras en cuotas, que ya entran en «cuotas» (hallado al construir, 2026-11-22: si no, la cuota se contaba dos veces) | — |
| Fijos con tarjeta | Al resumen se le resta lo que ya cuenta como fijo: gastos fijos de esa tarjeta entre el cierre anterior (excluido) y el de este mes (elegido por la persona) | Sacar esos fijos de los fijos del mes del pago |
| Préstamo | Cuenta de Financiaciones con saldo inicial 0 y una transferencia de la financiación a la cuenta donde llega, el día que llega (elegido por la persona). Se arma al crear la cuenta | Plan aparte dentro del Forecast (habría que borrarlo para no contar dos veces las cuotas) |
| Primera cuota | Campo «Primera cuota» (mes) en toda financiación: guarda ese mes en `cuotasMes`; antes de ese mes no hay cuota ni bajan las que faltan | Campo nuevo aparte de `cuotasMes` |
| Movimientos futuros | Los saldos de hoy cuentan hasta hoy (`valorCuenta(c)` sin fecha = hasta hoy). Es lo que hace falta para que el préstamo no sea plata ni deuda antes de llegar | Excepción sólo para préstamos (dos reglas para lo mismo) |
| Entrada del préstamo en el Forecast | Las transferencias de una financiación a una cuenta que no es de financiaciones, con fecha en ese mes, suman a lo libre del mes | Contarlo como ingreso (inflaría «Ingresado») |

## Modelo y migración

- `settings.foreIng?: number` (≥ 0). Inválido → se borra.
- Tarjeta: `pagos?: {"AAAA-MM": "AAAA-MM-DD"}`. `cierresNorm()` también limpia `pagos`: sólo en tarjetas, clave AAAA-MM, fecha real posterior a `cierreDe(c, k)` y ≤ último día del mes siguiente.
- Financiación: `cuotasMes` puede ser un mes futuro (ya era válido).
- Sin campos nuevos en movimientos: el préstamo es una transferencia común con nota «Préstamo».

## Implementación en `index.html`

- `valorCuenta(c, hasta = hoy())`.
- `cuotaEnMes`/`cuotasDelMes()` y `cuotasFaltan(c, mes)`: una financiación con `cuotasMes` posterior a `mes` no suma cuota y conserva todas las que faltan.
- `pagoDe(c, mes)`, `resumenForecast()`: por tarjeta, `max(0, aPagar − fijos del periodo)` y el mes del pago.
- `proyeccion(ing)`: suma `tarjeta` y `prestamo` por mes; `libre = ing + prestamo − (fijos + cuotas + tarjeta)`.
- Forecast: `#foreIng` guarda al cambiar (válido), `#forePromedio` «Usar el promedio (X €)», `#foreIngSub`. Fila del mes: «Fijos X · cuotas Y · tarjeta Z», y «Entra un préstamo de X» si hay.
- A pagar: `input[data-pago]` por tarjeta; fila de Inicio con «· pagás el <día>».
- Hoja de cuenta: `#cPrimera` (`type="month"`, financiaciones) y, sólo al crear una financiación, `#cPrest` (casilla) con `#cPrestImp`, `#cPrestFecha`, `#cPrestDest`.
- `sw.js`: sube `CACHE`.
