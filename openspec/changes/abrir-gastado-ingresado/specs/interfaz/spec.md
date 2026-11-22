# Capacidad: interfaz

## Requisito: Inicio con la tarjeta de resultado

Inicio muestra el resultado del mes en una tarjeta con el destino del sobrante y, debajo, «Gastado» e «Ingresado», con los totales del mes que se ve. Cada una ocupa todo el ancho, una debajo de otra, con el mismo formato que «Por cobrar»: el título en negrita, el importe grande y un botón «Ver». Tocar la tarjeta o «Ver» la abre. Transferencias y ajustes no suman en ninguna, «Gastado» no suma los gastos de «Trabajo (reembolsable)» e «Ingresado» no suma los ingresos de «Reembolso». El resto de las tarjetas de Inicio sigue en el mismo orden que antes: la torta pasa a ser una lista con barras y «Por semana» deja de estar.

### Escenario: gastado e ingresado
- **Dado** un ingreso de 1500 € y un gasto de 80 € este mes, y una transferencia de 300 €
- **Cuando** la persona abre Inicio
- **Entonces** «Gastado» dice 80 € e «Ingresado» dice 1500 €

### Escenario: sin movimientos
- **Dado** un mes sin movimientos
- **Cuando** la persona abre Inicio
- **Entonces** «Gastado» e «Ingresado» dicen 0 €

### Escenario: el orden de Inicio
- **Dado** gastos fijos y variables, una cuenta con tope, ingresos de seis meses y cuentas cargadas
- **Cuando** la persona abre Inicio
- **Entonces** de arriba abajo ve «Fijos y variables», el resultado del mes, «Gastado» e «Ingresado», el disponible por cuenta, «Gasto del mes», «Ingresos y gastos» y «Patrimonio neto», y no ve «Por semana»

### Escenario: el mismo formato que «Por cobrar»
- **Dado** un gasto reembolsable pendiente, un gasto de 80 € y un ingreso de 1500 € este mes
- **Cuando** la persona abre Inicio en 390 px
- **Entonces** «Gastado», «Ingresado» y «Por cobrar» tienen el mismo ancho, el mismo tamaño y peso de título y el mismo tamaño de importe
- **Y** «Ingresado» está debajo de «Gastado»
- **Y** cada una lleva «Ver»

### Escenario: abrir gastado
- **Dado** un gasto de 80 € en Supermercado este mes
- **Cuando** la persona toca «Gastado» en Inicio
- **Entonces** se abre «Gasto por categoría» del mes que se ve

### Escenario: abrir ingresado
- **Dado** un ingreso de 1500 € en Sueldo este mes
- **Cuando** la persona toca «Ver» en «Ingresado»
- **Entonces** se abre «Ingresos por categoría» del mes que se ve
