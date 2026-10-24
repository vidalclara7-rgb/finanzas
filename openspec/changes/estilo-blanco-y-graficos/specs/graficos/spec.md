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

La tarjeta de disponible de Tarjeta y la de Revolut muestran un anillo con el porcentaje del tope
mensual ya usado, sin contar los gastos reembolsables. Al superar el tope, el anillo se completa y
se marca como excedido.

### Escenario: tope usado en parte
- **Dado** un tope de Tarjeta de 500 € y 64,30 € gastados con Tarjeta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Tarjeta dice «13 %»

### Escenario: tope superado en el anillo
- **Dado** un tope de Revolut de 300 € y 320 € gastados con Revolut este mes
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
