# Capacidad: cuentas

## Requisito: crear una cuenta con nombre libre

En la pestaña Cuentas la persona crea cuentas con el nombre que quiera, uno de cinco tipos (Bancos y
efectivo, Inversiones, Tarjetas de crédito, Financiaciones y Deudas compartidas) y el saldo con el
que parte, en positivo. Bancos y efectivo y Tarjetas de crédito pueden tener un tope de gasto
mensual; una cuenta de Bancos y efectivo se puede marcar como fondo de emergencia. Las cuentas se
agrupan por tipo, cada grupo con su total, y cada cuenta muestra si está conciliada este mes.

### Escenario: cuenta de banco
- **Dado** que hoy es 2026-10-15 y no hay cuentas
- **Cuando** la persona crea «Banco A» de tipo Bancos y efectivo con 1200 €
- **Entonces** la app avisa «Cuenta guardada»
- **Y** aparece en el grupo «Bancos y efectivo» con 1200 € y «Sin conciliar»

### Escenario: cuenta sin nombre
- **Dado** el formulario de cuenta abierto
- **Cuando** la persona guarda sin nombre
- **Entonces** la app avisa «Ponele un nombre a la cuenta» y no guarda nada

### Escenario: sin cuentas todavía
- **Dado** que no hay cuentas
- **Cuando** la persona abre Cuentas
- **Entonces** ve la tarjeta «Tu foto financiera» y el botón «Agregar cuenta»
- **Y** Inicio no muestra el patrimonio neto

### Escenario: un solo fondo de emergencia
- **Dado** «Fondo A» marcada como fondo de emergencia
- **Cuando** la persona marca «Banco A» como fondo de emergencia y guarda
- **Entonces** Banco A es el fondo y Fondo A deja de serlo

## Requisito: patrimonio neto

El patrimonio neto es lo que se tiene menos lo que se debe. Suman los bancos, las inversiones y las
deudas compartidas a favor; restan las tarjetas, las financiaciones y las deudas compartidas en
contra. También se muestra el total de cuotas mensuales de las financiaciones. Aparece arriba en
Cuentas y en Inicio.

### Escenario: patrimonio con todos los tipos
- **Dado** Banco A con 1200 €, Broker X con 2100 €, Tarjeta Y con 350 €, Financiera Z con 600 € y 50 € de cuota, y Gastos del piso donde la persona debe 45 €
- **Cuando** la persona abre Cuentas
- **Entonces** el patrimonio neto es 2305 €, «Tenés 3300 €», «Debés 995 €»
- **Y** dice «Cuotas de financiaciones: 50 € por mes»

### Escenario: deuda compartida a favor
- **Dado** sólo una deuda compartida «Gastos del piso» donde a la persona le deben 30 €
- **Cuando** la persona abre Cuentas
- **Entonces** el patrimonio neto es 30 € y la cuenta dice «Te deben»

## Requisito: detalle según el tipo de cuenta

Cada tipo pide y muestra datos propios: en inversiones, lo aportado y la ganancia en euros y en
porcentaje; en tarjetas, el límite y lo disponible; en financiaciones, la cuota mensual, las cuotas
que faltan y el mes en que termina. Todos son opcionales salvo el importe.

### Escenario: ganancia de una inversión
- **Dado** Broker X con un valor de 2100 € y 2000 € aportados
- **Cuando** la persona abre Cuentas
- **Entonces** Broker X dice «+100 € (+5,0 %) sobre 2000 €»

### Escenario: disponible de una tarjeta
- **Dado** Tarjeta Y con 350 € de deuda y 1500 € de límite
- **Cuando** la persona abre Cuentas
- **Entonces** Tarjeta Y dice «Disponible 1150 € de 1500 €»

### Escenario: fin de una financiación
- **Dado** que hoy es 2026-10-15 y Financiera Z con 50 € de cuota y 12 cuotas por pagar
- **Cuando** la persona abre Cuentas
- **Entonces** Financiera Z dice «50 €/mes · faltan 12 (hasta septiembre 2027)»

## Requisito: editar y borrar una cuenta

Tocar una cuenta abre su formulario. Se pueden cambiar el nombre, el tope y los datos propios del
tipo; el saldo no se cambia a mano, se corrige conciliando. Borrar pide dos toques, y una cuenta con
movimientos no se puede borrar.

### Escenario: renombrar una cuenta
- **Dado** «Banco A» en la lista
- **Cuando** la persona la toca, cambia el nombre a «Banco principal» y guarda
- **Entonces** la cuenta se llama «Banco principal» y conserva su saldo y sus movimientos

### Escenario: borrar una cuenta sin movimientos
- **Dado** «Banco A» sin movimientos
- **Cuando** la persona toca Banco A, «Borrar cuenta» y «Tocá de nuevo para borrar»
- **Entonces** la app avisa «Cuenta borrada» y Banco A desaparece

### Escenario: cuenta con movimientos no se borra
- **Dado** «Banco A» con un gasto
- **Cuando** la persona toca Banco A, «Borrar cuenta» y «Tocá de nuevo para borrar»
- **Entonces** la app avisa «No se puede borrar: la cuenta tiene movimientos» y Banco A sigue

## Requisito: patrimonio neto de cada mes

Cada vez que cambia una cuenta o un movimiento, la app recuerda el patrimonio neto de ese mes, para
poder mostrar su evolución más adelante.

### Escenario: patrimonio del mes guardado
- **Dado** que hoy es 2026-10-15 y no hay cuentas
- **Cuando** la persona crea «Banco A» con 1200 € y anota un gasto de 200 € desde Banco A
- **Entonces** la copia de seguridad registra 1000 como patrimonio de 2026-10

## Requisito: saldo calculado con los movimientos

El saldo de cada cuenta es el saldo con el que partió más sus movimientos desde ese día: los gastos
restan, los ingresos suman, las transferencias pasan de una cuenta a otra y los ajustes de
conciliación corrigen. En tarjetas y financiaciones se muestra lo que se debe.

### Escenario: gasto con la tarjeta
- **Dado** «Tarjeta Y» con 350 € de deuda
- **Cuando** la persona anota un gasto de 50 € con Tarjeta Y
- **Entonces** Tarjeta Y debe 400 € y el patrimonio neto baja 50 €

### Escenario: movimientos anteriores al saldo de partida
- **Dado** «Banco A» creada con 1000 € el 2026-10-10 y un gasto de 30 € del 2026-10-05 en Banco A
- **Cuando** la persona abre Cuentas
- **Entonces** Banco A tiene 1000 €

## Requisito: cuotas de este mes en la tarjeta

La hoja de una tarjeta muestra «Cuotas de este mes»: lo que suman las cuotas de las compras
fraccionadas que caen en el mes en curso, y cuántas compras siguen en cuotas. Si no hay ninguna, no
aparece.

### Escenario: cuotas del mes
- **Dado** que hoy es 2026-10-15 y «Tarjeta Y» con una compra de 700 € en 3 cuotas de 240 € y otra de 300 € en 2 cuotas de 150 €
- **Cuando** la persona abre la hoja de Tarjeta Y
- **Entonces** ve «Cuotas de este mes: 390 € · 2 compras en cuotas»

### Escenario: sin compras en cuotas
- **Dado** «Tarjeta Y» sin compras fraccionadas
- **Cuando** la persona abre su hoja
- **Entonces** no ve «Cuotas de este mes»

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
