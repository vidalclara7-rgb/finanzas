# Capacidad: cuentas

## Requisito: ver y editar los movimientos de una cuenta

La hoja de una cuenta tiene «Ver movimientos»: los movimientos de esa cuenta (los que salen o entran en ella) del
mes elegido, empezando por el mes en curso, con flechas para ir a los meses anteriores. Al tocar uno se abre para
editarlo y, al guardar o cerrar, se vuelve a la lista del mismo mes.

### Escenario: un mes anterior
- **Dado** que hoy es 2026-10-15 y dos gastos de «Tarjeta Y» del 2026-09-10 y del 2026-10-03
- **Cuando** la persona abre la hoja de Tarjeta Y, toca «Ver movimientos» y la flecha del mes anterior
- **Entonces** ve septiembre de 2026 con el gasto del 10/09 y no el del 03/10

### Escenario: marcar un gasto importado como compra en cuotas
- **Dado** un gasto de 700 € del 2026-09-10 en «Tarjeta Y» en la lista de septiembre
- **Cuando** la persona lo toca, activa «Pagar en cuotas» con 3 cuotas de 240 € y guarda
- **Entonces** vuelve a la lista de septiembre con ese gasto como «Cuota 1 de 3» de 240 €
- **Y** la lista de octubre muestra «Cuota 2 de 3»

### Escenario: incluye las transferencias
- **Dado** una transferencia de «Banco A» a «Financiera Z» del 2026-10-05
- **Cuando** la persona abre la lista de Financiera Z en octubre
- **Entonces** ve esa transferencia

### Escenario: mes sin movimientos
- **Dado** que «Tarjeta Y» no tiene movimientos en agosto de 2026
- **Cuando** la persona va a agosto en su lista
- **Entonces** ve «Sin movimientos de Tarjeta Y en agosto de 2026.»

### Escenario: no se avanza más allá del mes actual
- **Dado** que hoy es 2026-10-15 y la lista de «Tarjeta Y» en octubre
- **Cuando** la persona mira la flecha del mes siguiente
- **Entonces** está desactivada
