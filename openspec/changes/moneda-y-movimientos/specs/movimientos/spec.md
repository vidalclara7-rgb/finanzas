# Capacidad: movimientos

## Requisito: ver los movimientos del mes

La pestaña Movimientos muestra los movimientos del mes en curso, del más reciente al más antiguo,
como tarjetas apiladas: cada gasto del color de su categoría, los ingresos en verde claro, las
transferencias y los ajustes en gris. Cada tarjeta lleva la categoría, la nota o la cuenta y el
importe: ingresos con «+», gastos con «−», transferencias con la cuenta de origen y la de destino.
Si el movimiento no es en euros, el importe lleva su moneda. Arriba, el total de ingresos y el de
gastos del mes; transferencias y ajustes no suman en ninguno. Inicio no repite la lista de gastos
recientes: para verlos, se abre Movimientos.

### Escenario: movimientos de otro mes no aparecen
- **Dado** que hoy es 2026-10-15, un gasto del 2026-09-28 y otro del 2026-10-03
- **Cuando** la persona abre Movimientos
- **Entonces** sólo ve el gasto del 2026-10-03

### Escenario: Inicio sin gastos recientes
- **Dado** seis gastos este mes
- **Cuando** la persona abre Inicio
- **Entonces** no ve tarjetas con los últimos gastos
- **Y** Movimientos muestra los seis, el más reciente primero

### Escenario: mes sin movimientos
- **Dado** que no hay movimientos en el mes en curso
- **Cuando** la persona abre Movimientos
- **Entonces** ve «Sin movimientos este mes.»

### Escenario: totales sin transferencias
- **Dado** un ingreso de 1500 €, un gasto de 80 € y una transferencia de 300 € este mes
- **Cuando** la persona abre Movimientos
- **Entonces** ve ingresos 1500 € y gastos 80 €

### Escenario: movimiento en otra moneda
- **Dado** un gasto de 20 USD este mes
- **Cuando** la persona abre Movimientos
- **Entonces** la tarjeta muestra «−20 USD»

## Requisito: moneda de un movimiento

Al anotar o editar un movimiento la persona elige su moneda: EUR (la de siempre), USD, GBP u Otra,
con un código de tres letras. La moneda es una etiqueta: la app no convierte, así que saldos, topes y
totales suman el importe tal cual. Un movimiento sin moneda es en euros.

### Escenario: elegir USD
- **Dado** el formulario de gasto abierto con la moneda en EUR
- **Cuando** la persona elige USD, anota 20 y guarda
- **Entonces** el gasto queda con la moneda USD
- **Y** al editarlo, el selector muestra USD

### Escenario: otra moneda
- **Dado** el formulario de gasto abierto
- **Cuando** la persona elige Otra, escribe «chf», anota 15 y guarda
- **Entonces** el gasto queda con la moneda CHF

### Escenario: código de moneda inválido
- **Dado** el formulario con «Otra» elegida
- **Cuando** la persona escribe «ab» y guarda
- **Entonces** la app avisa «Poné un código de 3 letras, por ejemplo CHF» y no guarda nada

### Escenario: sin conversión
- **Dado** «Banco A» con 1000 € y un gasto de 20 USD desde Banco A
- **Cuando** la persona abre Cuentas
- **Entonces** Banco A tiene 980 €
- **Y** la hoja del movimiento avisa «Los totales no convierten monedas»

### Escenario: movimientos anteriores siguen en euros
- **Dado** movimientos guardados antes de este cambio, sin moneda
- **Cuando** la persona abre Movimientos
- **Entonces** los ve igual que antes, en euros
