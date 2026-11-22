# Capacidad: cuentas

## Requisito: lo que hay que pagar de la tarjeta al cierre

Inicio muestra, si hay alguna cuenta de Tarjetas de crédito, la tarjeta «A pagar de la tarjeta» del mes que se ve: cuánto toca pagar de cada tarjeta de crédito al cierre de su resumen y el total. Lo que toca pagar es la deuda de la tarjeta a la fecha de cierre menos las cuotas de sus compras en cuotas que vencen en los meses siguientes, y nunca es menos de 0 €. Los movimientos posteriores al cierre van al resumen siguiente. Mientras el cierre no llegó, la fila dice «Hasta hoy · cierra el <día>»; después, «Cerró el <día>». Sin fecha de cierre cargada para ese mes, cuenta el último día del mes y la fila dice «Sin fecha de cierre».

### Escenario: lo que toca pagar
- **Dado** que hoy es 2026-11-25, «Tarjeta Y» sin deuda desde el 2026-10-01, cierre de noviembre el 2026-11-20, un gasto de 100 € el 2026-11-05, una compra de 300 € en 3 cuotas de 100 € el 2026-11-10 y un gasto de 50 € el 2026-11-22
- **Cuando** la persona abre Inicio
- **Entonces** «A pagar de la tarjeta» dice 200 € para Tarjeta Y y «Cerró el 20 nov.»

### Escenario: antes del cierre
- **Dado** que hoy es 2026-11-15, «Tarjeta Y» con cierre de noviembre el 2026-11-20 y un gasto de 100 € el 2026-11-05
- **Cuando** la persona abre Inicio
- **Entonces** la fila de Tarjeta Y dice 100 € y «Hasta hoy · cierra el 20 nov.»

### Escenario: sin fecha de cierre
- **Dado** que hoy es 2026-11-15 y «Tarjeta Y» sin fecha de cierre para noviembre, con un gasto de 100 € el 2026-11-05
- **Cuando** la persona abre Inicio
- **Entonces** la fila de Tarjeta Y dice 100 € y «Sin fecha de cierre»

### Escenario: lo que quedó del resumen anterior
- **Dado** «Tarjeta Y» con 80 € de gastos en octubre 2026 sin pagar y 100 € en noviembre antes del cierre
- **Cuando** la persona abre Inicio en noviembre
- **Entonces** la fila de Tarjeta Y dice 180 €

### Escenario: resumen pagado
- **Dado** «Tarjeta Y» con 80 € de gastos en octubre 2026 y una transferencia de 80 € de Banco A a Tarjeta Y el 2026-11-05, sin gastos en noviembre
- **Cuando** la persona abre Inicio en noviembre
- **Entonces** la fila de Tarjeta Y dice 0 €

### Escenario: varias tarjetas
- **Dado** «Tarjeta Y» con 100 € a pagar y «Tarjeta Z» con 50 € a pagar este mes
- **Cuando** la persona abre Inicio
- **Entonces** «A pagar de la tarjeta» dice 150 € en total y una fila por tarjeta

### Escenario: sin tarjetas de crédito
- **Dado** sólo una cuenta de bancos
- **Cuando** la persona abre Inicio
- **Entonces** no ve «A pagar de la tarjeta»

### Escenario: otro mes en a pagar
- **Dado** que hoy es 2026-11-15, «Tarjeta Y» con cierre de octubre el 2026-10-18 y un gasto de 40 € el 2026-10-10
- **Cuando** la persona va a octubre con «‹» en Inicio
- **Entonces** la fila de Tarjeta Y dice 40 € y «Cerró el 18 oct.»

## Requisito: cargar la fecha de cierre

Tocar «A pagar de la tarjeta» abre su hoja con el mes que se ve y, por cada tarjeta de crédito, el campo «Fecha de cierre», la deuda al cierre, las cuotas que vienen después y lo que toca pagar. Al elegir una fecha se guarda para esa tarjeta y ese mes, se avisa «Fecha de cierre guardada» y se recalcula. La fecha tiene que ser de ese mes. Borrar la fecha vuelve a contar el último día del mes.

### Escenario: cargar la fecha
- **Dado** que hoy es 2026-11-15 y «Tarjeta Y» con un gasto de 100 € el 2026-11-05 y otro de 50 € el 2026-11-25
- **Cuando** la persona abre «A pagar de la tarjeta» y elige 2026-11-20 en Tarjeta Y
- **Entonces** ve «Fecha de cierre guardada»
- **Y** Tarjeta Y dice «Deuda al cierre» 100 € y «A pagar» 100 €
- **Y** al volver a abrir la app sigue el cierre del 20

### Escenario: el detalle de las cuotas
- **Dado** «Tarjeta Y» con una compra de 300 € en 3 cuotas de 100 € este mes, antes del cierre
- **Cuando** la persona abre «A pagar de la tarjeta»
- **Entonces** Tarjeta Y dice «Deuda al cierre» 300 €, «Cuotas que vienen después» 200 € y «A pagar» 100 €

### Escenario: fecha de otro mes
- **Dado** la hoja «A pagar de la tarjeta» de noviembre 2026
- **Cuando** la persona escribe 2026-12-03 como fecha de cierre de Tarjeta Y
- **Entonces** ve «Elegí una fecha de noviembre 2026.» y no se guarda

### Escenario: borrar la fecha
- **Dado** «Tarjeta Y» con cierre de noviembre el 2026-11-20
- **Cuando** la persona borra la fecha en la hoja
- **Entonces** Tarjeta Y vuelve a decir «Sin fecha de cierre» y cuenta hasta el 2026-11-30

### Escenario: cada mes su fecha
- **Dado** «Tarjeta Y» con cierre de octubre el 2026-10-18
- **Cuando** la persona abre la hoja en noviembre 2026
- **Entonces** el campo de Tarjeta Y está vacío y dice «Sin fecha de cierre»
