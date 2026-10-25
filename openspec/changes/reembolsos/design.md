# Diseño: reembolsos

## Decisiones de la persona (2026-10-25)

- Estados Pendiente → Aprobado → Pagado, como la app de gastos de su empresa.
- Este cambio va antes que la importación de extractos, que lo usa para proponer vincular la
  transferencia de la empresa con los gastos pendientes.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- El estado se cambia a mano en cualquier orden (se puede pasar de Pendiente a Pagado directo).
- Un gasto pagado vinculado a un ingreso vuelve a «Aprobado» si ese ingreso se borra.
- Si un ingreso de Reembolso cubre gastos por un importe distinto, se guarda igual y se avisa la
  diferencia: la empresa puede descontar o redondear.
- Los gastos reembolsables siguen contando como gasto del mes (como hoy) y el ingreso de Reembolso
  como ingreso: el resultado del mes refleja la plata que salió y entró de verdad.

## Cómo se implementa en index.html

- `movs[i].reembolso = { estado: "pendiente"|"aprobado"|"pagado", cobro?: idDelIngreso }` en los
  gastos de «Trabajo (reembolsable)». `norm()` pone `pendiente` a los que no lo tienen (también al
  restaurar copias), sin cambiar `v`.
- Al cambiar la categoría de un gasto a otra, se le quita `reembolso`.
- Sube la versión de la caché.
