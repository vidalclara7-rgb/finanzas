# Capacidad: graficos

## Retirado: torta de gastos por categoría
La sustituye «lista de gastos por categoría»: la torta quedaba apretada.

## Requisito: lista de gastos por categoría

En «Gasto del mes», Inicio muestra el gasto del mes que se ve por categoría en una lista, de mayor a menor: una fila por categoría con el cuadradito de su color y su ícono, su nombre, su importe y su porcentaje del mes, y debajo una barra de su color proporcional a lo gastado (la más grande llega al ancho entero). El encabezado dice el total del mes. Entran las cinco categorías con más gasto; si hay más, las demás se suman en una fila gris «Resto (N categorías)». Cada nombre tiene su renglón: si es largo, se corta con puntos suspensivos y nunca se pisa con el importe. Ingresos, transferencias y ajustes no cuentan; los gastos reembolsables sí.

### Escenario: lista con tres categorías
- **Dado** 60 € en Supermercado, 30 € en Comida fuera y 10 € en Transporte este mes
- **Cuando** la persona abre Inicio
- **Entonces** «Gasto del mes» dice 100 € y la lista tiene tres filas: Supermercado, Comida fuera y Transporte, en ese orden
- **Y** la fila de Supermercado dice «60 €» y «60 %», y su barra es el doble de larga que la de Comida fuera

### Escenario: más de cinco categorías
- **Dado** gastos en siete categorías este mes
- **Cuando** la persona abre Inicio
- **Entonces** la lista tiene cinco filas de color y una gris «Resto (2 categorías)» con la suma de las otras dos

### Escenario: lista sin gastos
- **Dado** que no hay gastos en el mes que se ve
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja la lista y se lee «Todavía no anotaste gastos este mes. Tocá + para empezar.»

### Escenario: un nombre largo no se pisa
- **Dado** gastos en una categoría con un nombre de 30 caracteres
- **Cuando** la persona abre Inicio a 390 px
- **Entonces** el nombre se corta con puntos suspensivos, no se superpone con el importe y la pantalla no tiene desplazamiento horizontal

## Requisito: gasto por categoría en tarjetas apiladas

Tocar el encabezado de «Gasto del mes» o la fila «Resto» abre la hoja «Gasto por categoría» del mes que se ve: todas las categorías con gasto, de mayor a menor, cada una en una tarjeta de su color con degradado, apiladas de modo que cada una asoma por debajo de la anterior. Cada tarjeta lleva el ícono y el nombre de la categoría, su total, su porcentaje del mes, cuántos gastos tiene, la marca «Fijo» si es una categoría siempre fija, y el cambio frente al mes anterior en porcentaje. Tocar una tarjeta abre la hoja de esa categoría.

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

## Requisito: abrir una categoría

Tocar una fila de «Gasto del mes» o una tarjeta de «Gasto por categoría» abre la hoja de esa categoría en el mes que se está viendo, con su nombre, el total gastado y el mes. Cuenta lo mismo que la lista: los gastos de la categoría, sin ingresos, transferencias ni ajustes.

### Escenario: abrir desde la lista
- **Dado** que hoy es 2026-10-15 y este mes 64,30 € en Supermercado y 18 € en Comida fuera
- **Cuando** la persona toca la fila de Supermercado en «Gasto del mes»
- **Entonces** se abre la hoja «Supermercado» con 64,3 € y «octubre 2026»

### Escenario: abrir desde la pila
- **Dado** este mes 64,30 € en Supermercado y 18 € en Comida fuera
- **Cuando** la persona abre «Gasto por categoría» y toca Comida fuera
- **Entonces** se abre la hoja «Comida fuera» con 18 €

## Retirado: barras de gasto por semana
Inicio ya no muestra el gasto por semana: el detalle de cada semana está en Movimientos.

## Requisito: ingresos contra gastos por mes

Inicio muestra, para los últimos seis meses incluido el actual, dos curvas suaves, una verde de ingresos y otra en el color del texto de gastos, con un punto por mes. Al tocar un mes, un globo dice sus ingresos y sus gastos. Los meses que cerraron en negativo se marcan en el rosa de aviso. Transferencias y ajustes no cuentan.

### Escenario: dos meses con datos
- **Dado** que hoy es 2026-10-15, en septiembre 1500 € de ingresos y 900 € de gastos, y en octubre 1700 € de ingresos y 82,30 € de gastos
- **Cuando** la persona abre Inicio
- **Entonces** el gráfico muestra seis meses, de mayo a octubre 2026
- **Y** septiembre y octubre tienen su punto verde y su punto del color del texto, y los demás meses están en cero

### Escenario: globo con el mes tocado
- **Dado** el gráfico con datos de septiembre y octubre
- **Cuando** la persona toca octubre
- **Entonces** un globo dice «Ingresos 1700 €» y «Gastos 82,3 €»

### Escenario: mes que cerró en negativo
- **Dado** en septiembre 2026 ingresos de 800 € y gastos de 950 €
- **Cuando** la persona abre Inicio
- **Entonces** septiembre se marca en rosa en el gráfico

### Escenario: sin ingresos ni gastos
- **Dado** que no hay ingresos ni gastos en los últimos seis meses
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja el gráfico de ingresos contra gastos

## Requisito: porcentaje de lo que entró

En la tarjeta del resultado del mes, debajo del título, una línea de texto dice qué parte de lo que entró en el mes ya se gastó. Si el gasto supera lo ingresado, la línea se marca. Transferencias y ajustes no cuentan, y tampoco los gastos de «Trabajo (reembolsable)» ni los ingresos de Reembolso: no son plata propia.

### Escenario: gasto chico frente a lo que entró
- **Dado** ingresos de 1700 € y gastos de 149,80 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado dice «Te sobraron 1550,2 €»
- **Y** debajo se lee «Gastaste el 9 % de lo que entró»

### Escenario: gasto mayor que lo que entró
- **Dado** ingresos de 100 € y gastos de 150 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Gastaste el 150 % de lo que entró» y la línea se marca como excedida

### Escenario: mes sin ingresos
- **Dado** gastos de 50 € y ningún ingreso este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Todavía no anotaste ingresos este mes»

### Escenario: reembolsos fuera del porcentaje
- **Dado** un ingreso de 1000 € en Sueldo y otro de 50 € en Reembolso, y gastos de 200 € en Supermercado y 50 € en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Gastaste el 20 % de lo que entró»
