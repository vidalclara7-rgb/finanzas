# Capacidad: graficos

## Requisito: torta de gastos por categoría

Inicio muestra el gasto del mes en curso repartido por categoría en un gráfico circular, con el
total del mes en el centro. Cada categoría tiene su color, y la lista de categorías de debajo usa el
mismo color.

### Escenario: torta con tres categorías
- **Dado** 64,30 € en Súper, 42 € en Trabajo (reembolsable) y 18 € en Comida fuera este mes
- **Cuando** la persona abre Inicio
- **Entonces** la torta tiene tres porciones y en el centro dice «124,3 €»
- **Y** la porción de Súper es la más grande

### Escenario: torta sin gastos
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja la torta y se lee «Todavía no anotaste gastos este mes. Tocá + para empezar.»

## Requisito: anillo del tope

La tarjeta de disponible de cada cuenta con tope muestra un anillo con el porcentaje del tope mensual
ya usado, sin contar los gastos reembolsables, los ingresos, las transferencias ni los ajustes. Al
superar el tope, el anillo se completa y se marca como excedido.

### Escenario: tope usado en parte
- **Dado** «Tarjeta» con tope de 500 € y 64,30 € gastados con esa tarjeta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Tarjeta dice «13 %»

### Escenario: tope superado en el anillo
- **Dado** «Revolut» con tope de 300 € y 320 € gastados con esa cuenta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Revolut dice «107 %» y se marca como excedido

## Requisito: barras de gasto por semana

Inicio muestra el gasto del mes en curso por semana (días 1 a 7, 8 a 14, 15 a 21, 22 a 28 y 29 a
fin de mes), con la semana de hoy resaltada.

### Escenario: gasto repartido en semanas
- **Dado** que hoy es 2026-10-15 y gastos de 64,30 € el día 3, 18 € el 5, 42 € el 8 y 25,50 € el 11
- **Cuando** la persona abre Inicio
- **Entonces** la semana 1 suma 82,3 €, la semana 2 suma 67,5 € y las demás 0 €
- **Y** la semana 3 aparece resaltada como la actual

### Escenario: barras sin gastos
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Inicio
- **Entonces** no se dibujan las barras

## Requisito: ingresos contra gastos por mes

Inicio muestra, para los últimos seis meses incluido el actual, una barra de ingresos y otra de
gastos por mes, y marca los meses que cerraron en negativo. Transferencias y ajustes no cuentan.

### Escenario: dos meses con datos
- **Dado** que hoy es 2026-10-15, en septiembre 1500 € de ingresos y 900 € de gastos, y en octubre 1700 € de ingresos y 82,30 € de gastos
- **Cuando** la persona abre Inicio
- **Entonces** el gráfico muestra seis meses, de mayo a octubre 2026
- **Y** septiembre y octubre tienen sus dos barras, y los demás meses están vacíos

### Escenario: mes que cerró en negativo
- **Dado** en septiembre 2026 ingresos de 800 € y gastos de 950 €
- **Cuando** la persona abre Inicio
- **Entonces** septiembre se marca en rojo en el gráfico

### Escenario: sin ingresos ni gastos
- **Dado** que no hay ingresos ni gastos en los últimos seis meses
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja el gráfico de ingresos contra gastos

## Requisito: forma del gasto del mes

Arriba de Inicio, una forma roja muestra cuánto de lo que entró en el mes ya se gastó: crece con el
gasto y se completa al llegar a lo ingresado. Debajo, el resultado del mes en grande. Si el gasto
supera lo ingresado, se marca. Transferencias y ajustes no cuentan.

### Escenario: gasto chico frente a lo que entró
- **Dado** ingresos de 1700 € y gastos de 149,80 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** la forma dice «Gastaste el 9 % de lo que entró»
- **Y** debajo se ve el resultado, 1550,2 €

### Escenario: gasto mayor que lo que entró
- **Dado** ingresos de 100 € y gastos de 150 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** la forma dice «Gastaste el 150 % de lo que entró» y se marca como excedida

### Escenario: mes sin ingresos
- **Dado** gastos de 50 € y ningún ingreso este mes
- **Cuando** la persona abre Inicio
- **Entonces** la forma dice «Todavía no anotaste ingresos este mes»
