# Capacidad: conciliacion

## Requisito: conciliar una cuenta al cierre del mes

En Cierre, cada cuenta muestra su saldo calculado a la fecha de cierre (el último día del mes, o hoy
si es el mes en curso) y su estado: «Conciliada» o «Sin conciliar». Al tocarla, la persona carga el
saldo real que le muestra su banco o plataforma. Si coincide con el calculado, la cuenta queda
conciliada ese mes.

### Escenario: saldo que coincide
- **Dado** que hoy es 2026-10-15, «Banco A» con saldo inicial de 1000 € desde el 2026-10-01 y un gasto de 12,50 €
- **Cuando** la persona abre Cierre, toca Banco A y carga 987,50 € como saldo real
- **Entonces** la app avisa «Cuenta conciliada»
- **Y** Banco A muestra «Conciliada»

### Escenario: cuentas pendientes
- **Dado** «Banco A» conciliada en octubre y «Tarjeta Y» sin conciliar
- **Cuando** la persona abre Cierre
- **Entonces** ve «1 de 2 cuentas conciliadas»

## Requisito: diferencia y ajuste

Si el saldo real no coincide con el calculado, la hoja muestra la diferencia. La persona puede
registrarla como ajuste, y la cuenta queda conciliada con el saldo real, o dejarla pendiente. Los
ajustes aparecen en Movimientos pero no cuentan como gasto ni ingreso, ni en las categorías ni en los
topes.

### Escenario: registrar un ajuste
- **Dado** Banco A con 987,5 € calculados
- **Cuando** la persona carga 975,20 € como saldo real y toca «Registrar ajuste y conciliar»
- **Entonces** Banco A tiene 975,2 € y muestra «Conciliada»
- **Y** Movimientos muestra un ajuste de conciliación de -12,3 €
- **Y** los gastos del mes no cambian

### Escenario: dejar la diferencia pendiente
- **Dado** Banco A con 987,5 € calculados
- **Cuando** la persona carga 975,20 € como saldo real y toca «Dejar pendiente»
- **Entonces** Banco A sigue con 987,5 € y muestra «Diferencia -12,3 €»

### Escenario: saldo real vacío
- **Dado** la hoja de conciliación de Banco A abierta
- **Cuando** la persona toca «Conciliar» sin cargar el saldo real
- **Entonces** la app avisa «Cargá el saldo real de la cuenta» y no concilia

## Requisito: cambiar un mes ya conciliado

Los movimientos de un mes conciliado se pueden crear, editar y borrar. Cuando cambia un movimiento de
ese mes, la cuenta (y, si es una transferencia, la otra cuenta) vuelve a «Sin conciliar».

### Escenario: editar un gasto de un mes conciliado
- **Dado** Banco A conciliada en octubre con un gasto de 20 € del 2026-10-05
- **Cuando** la persona cambia ese gasto a 25 €
- **Entonces** Banco A vuelve a mostrar «Sin conciliar» en Cierre

### Escenario: transferencia en un mes conciliado
- **Dado** Banco A y Tarjeta Y conciliadas en octubre
- **Cuando** la persona transfiere 100 € de Banco A a Tarjeta Y con fecha 2026-10-10
- **Entonces** las dos vuelven a «Sin conciliar»

## Requisito: inversiones al día con la conciliación

En una inversión, el saldo real es su valor actual. La diferencia con el calculado es lo que subió o
bajó el valor, y se registra como ajuste.

### Escenario: inversión que subió
- **Dado** «Broker X» con 2100 € calculados
- **Cuando** la persona concilia con 2180 € y registra el ajuste
- **Entonces** Broker X tiene 2180 € y muestra «Conciliada»
- **Y** el resultado del mes no cambia
