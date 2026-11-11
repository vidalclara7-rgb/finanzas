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
