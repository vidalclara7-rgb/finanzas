# Diseño: movimientos-y-conciliacion

## Decisiones de la persona (2026-10-24)

- Se divide en tres cambios: títulos, este, y adjuntos después.
- Conciliación = movimientos + saldo real al cierre, con ajuste opcional por la diferencia.
- Mes pasa a ser el cierre; el fondo pasa a ser una cuenta y su plan se conserva.
- Los gastos viejos se asignan a cuentas creadas solas (Tarjeta, Revolut, Débito/efectivo).
- Cambiar un movimiento de un mes conciliado se permite y devuelve la cuenta a «sin conciliar».
- Categorías de ingreso: Sueldo, Reembolso, Venta o trabajo extra, Regalo, Intereses y rendimientos,
  Otros.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **No se puede borrar una cuenta con movimientos**: borrarla dejaría movimientos huérfanos y
  rompería la conciliación de la otra cuenta en las transferencias. Aviso: «No se puede borrar: la
  cuenta tiene movimientos».
- **El saldo no se edita a mano**: la hoja de cuenta muestra el saldo inicial sólo al crearla. Para
  corregir el saldo de una cuenta existente se concilia.
- **Los ajustes no son gastos ni ingresos**: cambian el saldo, pero no cuentan en el resultado del
  mes, en las categorías ni en los topes.
- **Fecha de cierre**: el último día del mes, o hoy si es el mes en curso.
- **Checklist**: la tarea «Transferir … a Revolut» pasa a «Transferir el presupuesto del mes a tus
  cuentas», porque los topes ya no son dos fijos. Las otras cuatro no cambian.
- **Topes**: opcionales, sólo en Bancos y efectivo y en Tarjetas de crédito. El disponible se calcula
  como hoy (sin los gastos «Trabajo (reembolsable)»).
- **«Gasto por categoría»** sigue sumando los reembolsables, como hoy: cambiarlo es otro cambio.

## Cómo se implementa en index.html

Modelo nuevo (versión 2 de los datos, marcada con `v: 2`; la clave de guardado no cambia):

```
{ v: 2,
  settings: { aporte, objetivoFondo, inicio, saltos },
  cuentas: [{ id, tipo, nombre, saldoInicial, desde: "AAAA-MM-DD", tope?, fondo?, aportado?, limite?, cuota?, cuotas? }],
  movs:    [{ id, tipo: "gasto"|"ingreso"|"transferencia"|"ajuste", fecha, importe, cuenta, destino?, cat?, nota }],
  meses:   { "AAAA-MM": { checks, neto?, fondo?, conc?: { <idCuenta>: { real, fecha } } } } }
```

- `saldoInicial` sigue la convención de hoy (las deudas en positivo; compartida con signo). El saldo
  se calcula en «valor con signo» (activos positivos, deudas negativas): gasto resta, ingreso suma,
  transferencia resta en `cuenta` y suma en `destino`, ajuste suma su importe con signo. La deuda que
  se muestra es el valor cambiado de signo.
- Sólo cuentan los movimientos con fecha igual o posterior a `desde`.
- Conciliada = existe `meses[m].conc[id]`. Al crear, editar o borrar un movimiento con fecha en un
  mes conciliado de esa cuenta (o de la de destino), se borra esa marca.
- Registrar ajuste: un movimiento `ajuste` por `real − calculado`, con la fecha del cierre.
- Pantallas: Gastos → Movimientos (`v-movs`), Mes → Cierre (`v-mes`). Hoja de movimiento con selector
  Gasto / Ingreso / Transferencia. Nueva hoja de conciliación.

Migración en `norm()` (se aplica al cargar y al restaurar una copia; sólo si `v` no es 2):

1. Cuentas de la versión con Cuentas: `saldo` → `saldoInicial`, `actualizado` → `desde`.
2. Por cada cuenta vieja (`tarjeta`, `revolut`, `santander`) con gastos o tope: se crea Tarjeta
   (tipo tarjeta, tope = topeTarjeta), Revolut (bancos, tope = topeRevolut) o Débito/efectivo (bancos),
   con saldo inicial 0 desde el primer día del mes del gasto más antiguo de esa cuenta.
3. `gastos` → `movs` de tipo gasto, con `cuenta` = id de la cuenta creada.
4. Si hay algún saldo del fondo anotado: se crea «Fondo de emergencia» (bancos, `fondo: true`) con
   saldo inicial = último saldo anotado, desde el primer día de ese mes. Los saldos anotados de meses
   anteriores se conservan para el plan.
5. Se quitan `topeTarjeta` y `topeRevolut` de `settings` y se pone `v: 2`. Volver a abrir no repite
   nada.

Sube la versión de la caché del service worker. `CLAUDE.md` se actualiza con el modelo nuevo.

## Descartado

- Saldo editable a mano además de calculado: dos fuentes de verdad, la conciliación pierde sentido.
- Bloquear los meses conciliados: la persona eligió permitir cambios.
- Ajustes como gasto u otra categoría: ensuciarían el resultado del mes.
