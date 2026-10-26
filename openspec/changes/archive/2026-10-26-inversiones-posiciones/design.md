# Diseño: inversiones-posiciones

## Decisiones de la persona (2026-10-26)

- Posiciones por activo, con compras y ventas de cada uno. (Descartados: aportes y retiros con valor
  actual por fechas; y sólo mejorar el modelo actual de total aportado.)
- El valor de la cuenta sale de las posiciones más el efectivo. (Descartado: posiciones como detalle
  aparte sin tocar el patrimonio, que dejaría dos valores distintos de la misma cuenta.)

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Rendimiento de caja** de un activo: valor actual + lo cobrado por ventas − lo pagado por compras
  (con comisiones), en euros, y en % sobre lo pagado por compras. Es simple, correcto con compras y
  ventas parciales y no exige elegir un método de costo.
- **Precio actual**: el último precio anotado, sea en una operación o con «Actualizar precio»,
  según la fecha más reciente. Un activo sin precio vale 0 hasta que se anote uno.
- **Efectivo** de la cuenta: su saldo con los movimientos de siempre (saldo inicial, transferencias,
  ajustes) menos lo pagado en compras más lo cobrado en ventas. Puede quedar en negativo si la
  transferencia de entrada no se anotó: se avisa, no se bloquea.
- Vender más de lo que se tiene a esa fecha no se permite.
- **Conciliación** sin cambios: el saldo real es el valor actual de la cuenta y la diferencia se
  registra como ajuste (cae en el efectivo). Es el punto más flojo: si el desvío viene de un precio mal
  anotado, conviene corregir el precio antes de conciliar. Se deja dicho en la hoja.
- Entrada desde Cuentas: la barra de navegación ya tiene cinco lugares.
- **Rendimiento de la cuenta** = suma de sus activos (sin el efectivo). El «total aportado» de la
  cuenta deja de usarse cuando hay activos, y sigue como hoy cuando no.

## Cómo se implementa en index.html

- `S.activos: [{id, cuenta, nombre, precio?, fechaPrecio?}]` y `S.ops: [{id, activo, fecha, tipo:
  "compra"|"venta", cantidad, precio, comision?}]`. `norm()` los crea vacíos si faltan, sin cambiar
  `v`; copias viejas valen igual.
- `valorCuenta()` suma, sólo para `tipo: "inversion"` con activos: las posiciones a su precio y el
  efecto en efectivo de las operaciones. Cuentas sin activos: idéntico a hoy.
- Borrar una cuenta borra sus activos y operaciones; borrar un activo con operaciones pide confirmar.
- Textos con `esc()`. Sube la versión de `CACHE` en `sw.js`.
