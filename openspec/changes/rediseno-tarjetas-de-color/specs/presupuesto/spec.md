# Capacidad: presupuesto

## Requisito: qué hiciste con lo que sobró

La tarjeta del resultado del mes de Inicio dice cuánto sobró del mes que se ve (ingresos menos gastos de plata propia) y adónde fue, según las transferencias de ese mes:

- **Invertiste**: lo transferido a cuentas de inversión desde cuentas que no son de inversión, menos lo que volvió de ellas en el mes. Debajo, el detalle por cuenta de inversión («Broker X 250 € · Fondo Y 150 €»).
- **Ahorraste**: lo transferido, con el mismo cálculo, a la cuenta destino de algún objetivo o a la cuenta marcada como fondo de emergencia, si no es de inversión. Debajo, el nombre del objetivo o «Fondo de emergencia».
- **Sin mover**: lo que sobró menos lo invertido y lo ahorrado, con el botón «Mover», que abre «Nuevo movimiento» como transferencia con ese importe.

Una barra partida muestra las tres partes en proporción, cada una de su color. Una fila en 0 o negativa no se muestra. Las transferencias entre dos cuentas de inversión, o entre dos cuentas que no son de inversión ni de ahorro, no cuentan. Si lo invertido y lo ahorrado superan lo que sobró, no hay «Sin mover» y se lee «Moviste X € más de lo que sobró este mes». En un mes en negativo no hay barra, y se muestran igual lo invertido y lo ahorrado si los hay.

### Escenario: sobrante repartido
- **Dado** ingresos de 2000 € y gastos de 1200 € este mes, una transferencia de 300 € de Banco A a Broker X y otra de 200 € de Banco A a la cuenta del objetivo «Viaje»
- **Cuando** la persona abre Inicio
- **Entonces** el resultado dice «Te sobraron 800 €»
- **Y** las filas dicen «Invertiste» 300 € con «Broker X 300 €», «Ahorraste» 200 € con «Viaje» y «Sin mover» 300 €

### Escenario: detalle de varias inversiones
- **Dado** este mes una transferencia de 250 € de Banco A a Broker X y otra de 150 € de Banco A a Fondo Y, las dos cuentas de inversión
- **Cuando** la persona abre Inicio
- **Entonces** «Invertiste» dice 400 € con «Broker X 250 € · Fondo Y 150 €»

### Escenario: lo que vuelve de una inversión resta
- **Dado** este mes una transferencia de 300 € de Banco A a Broker X y otra de 100 € de Broker X a Banco A
- **Cuando** la persona abre Inicio
- **Entonces** «Invertiste» dice 200 €

### Escenario: entre inversiones no cuenta
- **Dado** este mes sólo una transferencia de 500 € de Broker X a Fondo Y, las dos cuentas de inversión, y ingresos de 1000 € con gastos de 400 €
- **Cuando** la persona abre Inicio
- **Entonces** no aparece «Invertiste» y «Sin mover» dice 600 €

### Escenario: nada movido
- **Dado** ingresos de 1000 € y gastos de 400 € este mes y ninguna transferencia
- **Cuando** la persona abre Inicio
- **Entonces** sólo aparece «Sin mover» con 600 € y el botón «Mover»

### Escenario: mover lo que quedó
- **Dado** «Sin mover» con 600 €
- **Cuando** la persona toca «Mover»
- **Entonces** se abre «Nuevo movimiento» como transferencia con el importe 600

### Escenario: movió más de lo que sobró
- **Dado** ingresos de 1000 € y gastos de 900 € este mes, y una transferencia de 300 € de Banco A a Broker X
- **Cuando** la persona abre Inicio
- **Entonces** «Invertiste» dice 300 €, no aparece «Sin mover» y se lee «Moviste 200 € más de lo que sobró este mes»

### Escenario: mes en negativo
- **Dado** ingresos de 500 € y gastos de 700 € este mes, y ninguna transferencia
- **Cuando** la persona abre Inicio
- **Entonces** el resultado dice «Te faltaron 200 €», no hay barra ni filas

### Escenario: el objetivo en una cuenta de inversión
- **Dado** el objetivo «Jubilación» con destino Broker X, cuenta de inversión, y una transferencia de 100 € de Banco A a Broker X este mes
- **Cuando** la persona abre Inicio
- **Entonces** los 100 € cuentan en «Invertiste» y no en «Ahorraste»

### Escenario: otro mes
- **Dado** que hoy es 2026-11-02 y una transferencia de 300 € a Broker X el 2026-10-20
- **Cuando** la persona abre Inicio y toca la flecha ‹ hasta octubre
- **Entonces** «Invertiste» dice 300 € en octubre y no aparece en noviembre
