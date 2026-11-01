# Diseño: rehacer-una-cuenta

## Decisiones de la persona (2026-11-01)

- **Borrar todos los movimientos de una cuenta** (descartado por ahora: deshacer una importación y seleccionar varios en Movimientos).
- **Al importar el primer resumen, la app pregunta** si empieza la cuenta con el saldo anterior del resumen (descartado: hacerlo sola,
  y no tocarlo).

## Qué pasa hoy

La deuda de partida de una cuenta es `saldoInicial` con su `desde`; después de crearla no se edita (se corrige conciliando). El
resumen de tarjeta trae «SALDO ANTERIOR» (la deuda con la que empezó el periodo), que el lector ignora.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Qué se borra:** todos los movimientos donde la cuenta es origen o destino (gastos, ingresos, ajustes y transferencias; las
  transferencias con otras cuentas también desaparecen de la otra). Cada uno pasa por la misma lógica que borrar un movimiento:
  se quita de sus documentos, los ingresos de «Reembolso» devuelven sus gastos a «Aprobado» y se borran las marcas de
  conciliación de la cuenta (`meses[mes].conc[id]`). La confirmación dice «N movimientos (K transferencias con otras cuentas)».
- **No se toca:** la cuenta, su deuda inicial y su fecha de inicio, los adjuntos (quedan los resúmenes guardados) y las reglas
  aprendidas.
- **Respaldo:** antes de borrar se guarda el texto de los datos en `finanzas-respaldo` con `motivo:"borrado"` y la cuenta (reemplaza
  el respaldo anterior). Si el respaldo que hay es de datos que no se pudieron leer (`ilegible`), no se pisa: la app avisa
  «Antes de borrar, copiá o descartá el respaldo de datos que no se pudieron leer» y no borra nada. Ajustes lo muestra como
  «Datos de antes de borrar los movimientos de «Cuenta», del dd/mm» y se restaura igual que los demás.
- **Empezar con el saldo anterior:** el lector de la tarjeta de Santander devuelve `saldoAnterior:{importe, fecha}` (la línea
  «SALDO ANTERIOR» de la sección A). Se ofrece sólo si la cuenta de destino es una tarjeta **sin ningún movimiento**. La
  casilla viene marcada y dice «Empezar esta cuenta con el saldo anterior del resumen: 742,94 € el 29/09»; si la cuenta ya
  tenía una deuda inicial, lo aclara («hoy empieza con X desde Y»). Al guardar, `saldoInicial` = el saldo anterior (deuda
  positiva) y `desde` = su fecha. Los movimientos de antes de esa fecha no cuentan (como siempre con `desde`).
- **Sin datos nuevos en `S`;** el respaldo (clave aparte) gana el motivo `borrado` y el nombre de la cuenta. Un respaldo con otro
  motivo se lee como hasta ahora.

## Cómo se implementa en index.html

- `borrarTodosCta(id)` recorre `S.movs` con la lógica de `borrarMov()` y limpia `conc`; botón `#cBorrarMovs` en la hoja de cuenta (con
  dos toques, como `#cBorrar`); `guardarRespaldo(motivo, texto, extra)` generaliza lo que hace «Restaurar copia».
- `lectorSantanderTarjeta()` devuelve `saldoAnterior`; la revisión suma la casilla `#iInicio` (visible con `imp.cuenta` tarjeta sin
  movimientos) y `iGuardar` aplica `saldoInicial`/`desde`.
- Sube la versión de `CACHE`.
