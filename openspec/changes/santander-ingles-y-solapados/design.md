# Diseño: santander-ingles-y-solapados

## Qué pasa hoy (reproducido el 2026-11-11 con el extracto real, que no se sube al repo)

- El PDF tiene texto (121 líneas). `LECTORES` no lo reconoce (busca «Movimientos de cuenta» y «CUENTA SANTANDER») y `lectorGenerico` no entiende «05 nov 2026» ni el «−» (U+2212) separado del importe: devuelve nada.
- Reimportar el mismo extracto en español da 70 de 70 «Ya está»: el solapamiento entre extractos del mismo formato ya funciona. Los huecos son la fecha (operación contra valor) y los movimientos iguales el mismo día.

## Decisiones (con la persona, 2026-11-11)

- «Solapado» = movimientos repetidos entre extractos (no el orden de los adjuntos).
- **Fecha valor** en el formato en inglés, igual que en español (`CLAUDE.md`: «En Santander cuenta la fecha es la fecha valor»): así el mismo movimiento coincide entre los dos formatos. Si una fila no trae «Value date», se usa la fecha de operación.
- **«Ya está» con cuenta.** Para cada grupo de borradores iguales (misma cuenta, fecha, importe y sentido) se cuentan los guardados que coinciden: los primeros N salen «Ya está» y el resto entra. La otra mitad de una transferencia (±3 días) sigue igual, también contando.
  Se descarta comparar por descripción: la persona puede haber cambiado la nota.
- **Resumen en la revisión:** «Del 23/10 al 05/11 · 12 nuevos · 20 ya estaban». Sin periodo, sólo los conteos.
- El saldo del formato en inglés es «Available balance» con su fecha («on 11 nov 2026»): se ofrece para conciliar a esa fecha.

## Cómo se implementa en index.html

- `lectorSantanderCuentaEn(L)`: reconoce «Your account activity» y «Account ES…»; filas con fecha «dd mmm aaaa» en la primera columna, importe y saldo por posición de columnas («Amount», «Balance»), el «−» suelto antes del importe da el signo; la línea siguiente «Value date: …» da la fecha y el resto del concepto. `ref` = últimos cuatro del IBAN de «Account», titular de «Holder».
- `LECTORES`: entrada nueva antes del genérico.
- `borradores()`: `yaEsta()` pasa a consumir coincidencias (un contador por movimiento guardado).
- `pintarBorr()`: línea `#iResumen` (`data-ui="resumen-importacion"`).
- Sin datos nuevos. Sube `CACHE`. Tests con un constructor de PDF inventado en `tests/extractos.cjs`.
- El formato en inglés no trae periodo: `desde` y `hasta` son la fecha del movimiento más viejo y la del más nuevo.

## Cambio del Gate 2 (2026-11-11)

- Los «Ya está» se pliegan: la lista muestra sólo los nuevos y un `<details id="iYa">` («Ver los N que ya estaban») guarda el resto, que se puede marcar igual. Las «Anulada» y «Cuota ya anotada» siguen en la lista principal.

## Hallazgo al construir (2026-11-11)

- El extracto real anterior de la persona («Últimos movimientos de cuenta», en español) **no** lo leía el lector de Santander (buscaba «Movimientos de cuenta» con mayúscula) sino el genérico, que guarda la fecha de operación y saca mal los últimos dígitos de la cuenta. Con sólo la fecha valor, 27 de 40 movimientos del extracto de noviembre entraban repetidos.
- Arreglo: (1) el lector de Santander reconoce también «Últimos movimientos de cuenta» (misma tabla); (2) los dos lectores de Santander guardan además la fecha de operación (`fechaOp`, sólo en el borrador, no se guarda) y «Ya está» coincide con cualquiera de las dos. Así lo ya importado con fecha de operación sigue reconociéndose.
- Segundo hallazgo: la «fecha de operación» no es la misma en los dos formatos (el de español da la de asiento; el de inglés, la del pago). Para lo ya guardado con la fecha de asiento se añade una segunda pasada: en extractos de banco con dos fechas (`fechaOp`), lo que no coincidió exacto se da por «Ya está» si hay un movimiento igual guardado a ±3 días, siempre contando (los exactos se asignan primero). Riesgo aceptado: un gasto nuevo del mismo importe a ≤3 días de uno guardado que no venga en el extracto saldría «Ya está»; queda en el plegado, donde se puede marcar.
