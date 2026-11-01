# Capacidad: cuentas

## Requisito: borrar todos los movimientos de una cuenta

La hoja de una cuenta con movimientos tiene el botón «Borrar todos sus movimientos». Pide dos toques: el primero dice cuántos
se borran («Tocá de nuevo: se borran 3 movimientos») y el segundo los borra. Se borran los gastos, ingresos, ajustes y
transferencias donde la cuenta es origen o destino, y las marcas de conciliación de esa cuenta. La cuenta, su deuda inicial,
sus adjuntos y lo aprendido no cambian. Antes de borrar, la app guarda una copia de lo que había.

### Escenario: borrar todos los movimientos de una cuenta
- **Dado** «Tarjeta Y» con tres movimientos
- **Cuando** la persona abre su hoja, toca «Borrar todos sus movimientos» y después «Tocá de nuevo: se borran 3 movimientos»
- **Entonces** la app avisa «3 movimientos borrados» y Tarjeta Y no tiene movimientos
- **Y** su saldo es el de su deuda inicial

### Escenario: un solo toque no borra
- **Dado** «Tarjeta Y» con tres movimientos
- **Cuando** la persona toca «Borrar todos sus movimientos» una vez y cierra la hoja
- **Entonces** los tres movimientos siguen ahí

### Escenario: las transferencias con otras cuentas
- **Dado** «Tarjeta Y» con un gasto y un pago de 100 € desde «Banco A»
- **Cuando** la persona toca «Borrar todos sus movimientos»
- **Entonces** el botón dice «Tocá de nuevo: se borran 2 movimientos (1 transferencia con otras cuentas)»
- **Y** al confirmar, Banco A también deja de tener ese pago

### Escenario: la conciliación de la cuenta se borra
- **Dado** «Tarjeta Y» conciliada en octubre 2026 con movimientos
- **Cuando** la persona borra todos sus movimientos
- **Entonces** Tarjeta Y aparece «Sin conciliar» en Cierre

### Escenario: una cuenta sin movimientos
- **Dado** «Banco A» sin movimientos
- **Cuando** la persona abre su hoja
- **Entonces** no ve «Borrar todos sus movimientos»

### Escenario: los reembolsos vuelven a aprobado
- **Dado** un gasto reembolsable en «Tarjeta Y», pagado por un ingreso de «Reembolso» en «Banco A»
- **Cuando** la persona borra todos los movimientos de Banco A
- **Entonces** el gasto reembolsable de Tarjeta Y vuelve a «Aprobado»

### Escenario: los adjuntos se quedan
- **Dado** «Tarjeta Y» con un resumen adjunto y movimientos
- **Cuando** la persona borra todos sus movimientos
- **Entonces** el resumen sigue en los adjuntos de Tarjeta Y
