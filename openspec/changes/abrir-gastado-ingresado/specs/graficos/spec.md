# Capacidad: graficos

## Requisito: gasto por categoría en tarjetas apiladas

Tocar el encabezado de «Gasto del mes», la fila «Resto» o la tarjeta «Gastado» abre la hoja «Gasto por categoría» del mes que se ve: todas las categorías con gasto, de mayor a menor, cada una en una tarjeta de su color con degradado, apiladas de modo que cada una asoma por debajo de la anterior. Cada tarjeta lleva el ícono y el nombre de la categoría, su total, su porcentaje del mes, cuántos gastos tiene, la marca «Fijo» si es una categoría siempre fija, y el cambio frente al mes anterior en porcentaje. Tocar una tarjeta abre la hoja de esa categoría. El total de arriba es el mismo que dice «Gastado»: «Trabajo (reembolsable)», si tiene gastos, va última, sin porcentaje y con la marca «No suma en Gastado».

### Escenario: categorías apiladas de mayor a menor
- **Dado** que hoy es 2026-10-15, este mes 60 € en Supermercado en tres gastos, 30 € en Comida fuera y 10 € en Transporte
- **Cuando** la persona toca «Gasto del mes» en Inicio
- **Entonces** se abre «Gasto por categoría» con «octubre 2026» y tres tarjetas: Supermercado, Comida fuera y Transporte, en ese orden
- **Y** la de Supermercado dice 60 €, «60 %» y «3 gastos»

### Escenario: cambio frente al mes anterior
- **Dado** 100 € en Supermercado en octubre 2026 y 80 € en septiembre 2026
- **Cuando** la persona abre «Gasto por categoría» en octubre
- **Entonces** la tarjeta de Supermercado dice «+25 % vs sep.»

### Escenario: sin gasto el mes anterior
- **Dado** 50 € en Supermercado en octubre 2026 y nada en septiembre 2026
- **Cuando** la persona abre «Gasto por categoría» en octubre
- **Entonces** la tarjeta de Supermercado no muestra cambio frente al mes anterior

### Escenario: desde Resto
- **Dado** gastos en siete categorías este mes
- **Cuando** la persona toca «Resto» en «Gasto del mes»
- **Entonces** se abre «Gasto por categoría» con las siete categorías

### Escenario: el texto de cada tarjeta se lee
- **Dado** un gasto en cada una de las 19 categorías
- **Cuando** la persona abre «Gasto por categoría» en las apariencias Clara y Oscura
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1 en el punto de su degradado donde peor se lee

### Escenario: lo reembolsable no suma en gastado
- **Dado** este mes 80 € en Supermercado y 200 € en Trabajo (reembolsable)
- **Cuando** la persona toca «Gastado» en Inicio
- **Entonces** arriba se lee «80 € en 1 categoría»
- **Y** la última tarjeta es Trabajo (reembolsable) con 200 € y «No suma en Gastado», sin porcentaje

## Requisito: ingresos por categoría en tarjetas apiladas

Tocar «Ingresado» en Inicio abre la hoja «Ingresos por categoría» del mes que se ve, con flechas para cambiar de mes: todas las categorías de ingreso con algo ese mes, de mayor a menor, en tarjetas apiladas del color de «Ingresado». Cada tarjeta lleva el ícono y el nombre de la categoría, su total, su porcentaje del mes, cuántos ingresos tiene y el cambio frente al mes anterior en porcentaje. El total de arriba es el mismo que dice «Ingresado»: «Reembolso», si tiene ingresos, va última, sin porcentaje y con la marca «No suma en Ingresado». Transferencias y ajustes no aparecen. Tocar una tarjeta abre la hoja de esa categoría.

### Escenario: ingresos de mayor a menor
- **Dado** que hoy es 2026-10-15, este mes 1500 € en Sueldo y 500 € en Otros en dos ingresos
- **Cuando** la persona toca «Ingresado» en Inicio
- **Entonces** se abre «Ingresos por categoría» con «octubre 2026», «2.000 € en 2 categorías» y dos tarjetas: Sueldo y Otros, en ese orden
- **Y** la de Otros dice 500 €, «25 %» y «2 ingresos»

### Escenario: cambio de ingresos frente al mes anterior
- **Dado** 1500 € en Sueldo en octubre 2026 y 1200 € en septiembre 2026
- **Cuando** la persona abre «Ingresos por categoría» en octubre
- **Entonces** la tarjeta de Sueldo dice «+25 % vs sep.»

### Escenario: el reembolso no suma en ingresado
- **Dado** este mes 1500 € en Sueldo y 200 € en Reembolso
- **Cuando** la persona abre «Ingresos por categoría»
- **Entonces** arriba se lee «1.500 € en 1 categoría»
- **Y** la última tarjeta es Reembolso con 200 € y «No suma en Ingresado», sin porcentaje

### Escenario: mes sin ingresos
- **Dado** un mes sin ingresos
- **Cuando** la persona abre «Ingresos por categoría»
- **Entonces** se lee «Todavía no anotaste ingresos este mes. Tocá + para empezar.» y no hay tarjetas

### Escenario: otro mes en ingresos
- **Dado** 1500 € en Sueldo en octubre 2026 y 1200 € en septiembre 2026, y hoy en octubre
- **Cuando** la persona abre «Ingresos por categoría» y toca «‹»
- **Entonces** ve «septiembre 2026» y Sueldo con 1200 €
- **Y** «›» se desactiva al volver a octubre

### Escenario: el texto de cada tarjeta de ingreso se lee
- **Dado** ingresos en Sueldo, Otros y Reembolso este mes
- **Cuando** la persona abre «Ingresos por categoría» en las apariencias Clara y Oscura
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1 en el punto de su degradado donde peor se lee

## Requisito: abrir una categoría de ingreso

Tocar una tarjeta de «Ingresos por categoría» abre la hoja de esa categoría en ese mes, con la misma forma que la de una categoría de gasto: su nombre, el total, el mes con flechas, la comparación con el mes anterior, el reparto por cuenta y sus ingresos de mayor a menor. Tocar un ingreso abre «Editar movimiento». Al cerrar la hoja se vuelve a «Ingresos por categoría».

### Escenario: abrir desde ingresos
- **Dado** este mes 1500 € en Sueldo en Banco A y 300 € en Otros
- **Cuando** la persona abre «Ingresos por categoría» y toca Sueldo
- **Entonces** se abre la hoja «Sueldo» con 1.500 €, «Por cuenta» con Banco A «1.500 € · 100 %» y la lista «Ingresos, de mayor a menor»

### Escenario: comparación de un ingreso
- **Dado** nada en Otros en septiembre 2026 y 300 € en octubre 2026
- **Cuando** la persona abre Otros en octubre
- **Entonces** se lee «En septiembre no entró nada de Otros»

### Escenario: categoría de ingreso sin movimientos ese mes
- **Dado** la hoja de Sueldo abierta en octubre 2026 y nada en Sueldo en septiembre 2026
- **Cuando** la persona toca «‹»
- **Entonces** se lee «No entró nada de Sueldo en septiembre 2026.»

### Escenario: volver a ingresos
- **Dado** la hoja de Sueldo abierta desde «Ingresos por categoría»
- **Cuando** la persona toca «Cerrar»
- **Entonces** vuelve a «Ingresos por categoría»
