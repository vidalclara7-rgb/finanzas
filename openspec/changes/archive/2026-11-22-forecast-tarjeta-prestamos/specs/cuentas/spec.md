# Capacidad: cuentas

## Requisito: lo que hay que pagar de la tarjeta al cierre

Inicio muestra, si hay alguna cuenta de Tarjetas de crédito, la tarjeta «A pagar de la tarjeta» del mes que se ve: cuánto toca pagar de cada tarjeta de crédito al cierre de su resumen y el total. Lo que toca pagar es la deuda de la tarjeta a la fecha de cierre menos las cuotas de sus compras en cuotas que vencen en los meses siguientes, y nunca es menos de 0 €. Los movimientos posteriores al cierre van al resumen siguiente. Mientras el cierre no llegó, la fila dice «Hasta hoy · cierra el <día>»; después, «Cerró el <día>». Sin fecha de cierre cargada para ese mes, cuenta el último día del mes y la fila dice «Sin fecha de cierre». Con fecha de pago cargada, la fila suma «· pagás el <día>».

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

### Escenario: con fecha de pago
- **Dado** que hoy es 2026-11-25, «Tarjeta Y» con cierre de noviembre el 2026-11-20, pago el 2026-12-05 y un gasto de 100 € el 2026-11-05
- **Cuando** la persona abre Inicio
- **Entonces** la fila de Tarjeta Y dice 100 € y «Cerró el 20 nov. · pagás el 5 dic.»

## Requisito: cargar las fechas de cierre y de pago

Tocar «A pagar de la tarjeta» abre su hoja con el mes que se ve y, por cada tarjeta de crédito, los campos «Fecha de cierre» y «Fecha de pago», la deuda al cierre, las cuotas que vienen después y lo que toca pagar. Al elegir una fecha se guarda para esa tarjeta y ese mes, se avisa «Fecha de cierre guardada» y se recalcula. La fecha de cierre tiene que ser de ese mes; borrarla vuelve a contar el último día del mes. La fecha de pago se guarda igual («Fecha de pago guardada»), tiene que ser posterior a la fecha de cierre y como mucho del último día del mes siguiente; si no, la app avisa «La fecha de pago tiene que ser después del cierre y antes de fin de <mes siguiente>.» y no la guarda.

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

### Escenario: cargar la fecha de pago
- **Dado** «Tarjeta Y» con cierre de noviembre el 2026-11-20
- **Cuando** la persona elige 2026-12-05 como fecha de pago en la hoja
- **Entonces** ve «Fecha de pago guardada» y al volver a abrir la app sigue el pago del 5 de diciembre

### Escenario: fecha de pago antes del cierre
- **Dado** «Tarjeta Y» con cierre de noviembre el 2026-11-20
- **Cuando** la persona elige 2026-11-15 como fecha de pago
- **Entonces** ve «La fecha de pago tiene que ser después del cierre y antes de fin de diciembre 2026.» y no se guarda

## Requisito: saldo calculado con los movimientos

El saldo de cada cuenta es el saldo con el que partió más sus movimientos desde ese día: los gastos
restan, los ingresos suman, las transferencias pasan de una cuenta a otra y los ajustes de
conciliación corrigen. En tarjetas y financiaciones se muestra lo que se debe. Los saldos de hoy no cuentan los movimientos con fecha posterior a hoy: suman recién cuando llega su día.

### Escenario: gasto con la tarjeta
- **Dado** «Tarjeta Y» con 350 € de deuda
- **Cuando** la persona anota un gasto de 50 € con Tarjeta Y
- **Entonces** Tarjeta Y debe 400 € y el patrimonio neto baja 50 €

### Escenario: movimientos anteriores al saldo de partida
- **Dado** «Banco A» creada con 1000 € el 2026-10-10 y un gasto de 30 € del 2026-10-05 en Banco A
- **Cuando** la persona abre Cuentas
- **Entonces** Banco A tiene 1000 €

### Escenario: un movimiento con fecha futura
- **Dado** que hoy es 2026-11-15 y «Banco A» con 1000 € y un ingreso de 500 € del 2026-12-01
- **Cuando** la persona abre Cuentas
- **Entonces** Banco A tiene 1.000 €
- **Y** el 2026-12-01 tiene 1.500 €

## Requisito: registrar un préstamo

Al crear una cuenta de Financiaciones, la persona puede marcar «Es un préstamo que voy a recibir» y cargar el importe, el día que llega y la cuenta donde llega (una que no sea de Financiaciones). La app crea la financiación sin deuda inicial y anota, ese día, una transferencia «Préstamo» del importe desde la financiación a esa cuenta. Desde ese día la financiación debe el importe y la cuenta lo tiene; antes, ninguna de las dos cambia. Toda financiación puede tener el mes de su primera cuota. Sin importe, sin día o sin cuenta, la app avisa y no guarda.

### Escenario: préstamo que llega más adelante
- **Dado** que hoy es 2026-11-22 y «Banco A» con 1000 €
- **Cuando** la persona crea «Préstamo piso» de Financiaciones, marca el préstamo con 6000 €, el 2027-01-10 y Banco A, cuota de 300 €, 20 cuotas y primera cuota febrero de 2027, y guarda
- **Entonces** ve «Cuenta guardada» y hoy Banco A tiene 1.000 € y Préstamo piso no debe nada
- **Y** hay una transferencia «Préstamo» de 6.000 € del 2027-01-10 de Préstamo piso a Banco A

### Escenario: cuando llega el préstamo
- **Dado** ese préstamo y que hoy es 2027-01-15
- **Cuando** la persona abre Cuentas
- **Entonces** Banco A tiene 7.000 € y Préstamo piso debe 6.000 €

### Escenario: préstamo sin cuenta donde llega
- **Dado** el formulario de Financiaciones con el préstamo marcado, 6000 € y el 2027-01-10
- **Cuando** la persona guarda sin elegir la cuenta donde llega
- **Entonces** la app avisa «Elegí a qué cuenta llega el préstamo» y no guarda nada

### Escenario: préstamo sin importe
- **Dado** el formulario de Financiaciones con el préstamo marcado
- **Cuando** la persona guarda sin importe
- **Entonces** la app avisa «Poné el importe del préstamo» y no guarda nada

## Retirado: cargar la fecha de cierre
Lo sustituye «cargar las fechas de cierre y de pago».
