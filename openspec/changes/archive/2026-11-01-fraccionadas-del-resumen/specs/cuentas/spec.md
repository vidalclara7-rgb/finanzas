# Capacidad: cuentas

## Requisito: cómo se calcula la deuda de la tarjeta

La hoja de una tarjeta de crédito explica su deuda: lo que se anotó al empezar, las compras (las compras en cuotas por su total),
los pagos que recibió, los ajustes de conciliación y la deuda de hoy. Debajo dice cuánto de esa deuda queda por pagar en cuotas.

### Escenario: desglose de la deuda
- **Dado** «Tarjeta Y» con 100 € de deuda al empezar, compras por 300 €, un pago de 150 € desde «Banco A» y un ajuste de conciliación de −10 €
- **Cuando** la persona abre la hoja de Tarjeta Y
- **Entonces** «Cómo se calcula la deuda» muestra 100 €, compras 300 €, pagos −150 €, ajustes −10 € y deuda de hoy 240 €

### Escenario: lo que queda en cuotas
- **Dado** «Tarjeta Y» con una compra de 600 € en 3 cuotas de 200 €, con la primera cuota este mes
- **Cuando** la persona abre la hoja de Tarjeta Y
- **Entonces** el desglose dice «Por pagar en cuotas: 600 €» y «Lo demás: 0 €»

### Escenario: tarjeta sin movimientos
- **Dado** «Tarjeta Y» sin movimientos y sin deuda al empezar
- **Cuando** la persona abre su hoja
- **Entonces** el desglose muestra todo en 0 € y la deuda de hoy es 0 €

### Escenario: otras cuentas no lo muestran
- **Dado** «Banco A», una cuenta de bancos
- **Cuando** la persona abre su hoja
- **Entonces** no ve «Cómo se calcula la deuda»
