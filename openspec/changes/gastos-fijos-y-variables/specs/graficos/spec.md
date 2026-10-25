# Capacidad: graficos

## Retirado: forma del gasto del mes
La sustituyen «fijos y variables del mes» y «porcentaje de lo que entró».

## Requisito: fijos y variables del mes

Arriba de Inicio, «Fijos y variables» muestra el gasto del mes en curso partido en dos, fijos y
variables, cada parte con su importe y su porcentaje del total. Debajo, las categorías de cada grupo
ordenadas de mayor a menor, con su importe y una barra proporcional. Los gastos de «Trabajo
(reembolsable)», los ingresos, las transferencias y los ajustes no cuentan.

### Escenario: reparto entre fijos y variables
- **Dado** este mes 600 € en Casa/Splitwise y 40 € en Ocio marcados como fijos, y 300 € en Súper y 60 € en Comida fuera sin marcar
- **Cuando** la persona abre Inicio
- **Entonces** «Fijos y variables» dice «Fijos 640 € · 64 %» y «Variables 360 € · 36 %»
- **Y** bajo Fijos aparecen Casa/Splitwise y Ocio, en ese orden, y bajo Variables Súper y Comida fuera

### Escenario: reembolsables fuera del reparto
- **Dado** este mes 100 € en Súper y 50 € en Trabajo (reembolsable)
- **Cuando** la persona abre Inicio
- **Entonces** «Fijos y variables» dice «Variables 100 € · 100 %» y no aparece Trabajo (reembolsable)

### Escenario: todavía sin gastos fijos
- **Dado** este mes sólo gastos sin marcar como fijos, por 200 €
- **Cuando** la persona abre Inicio
- **Entonces** la barra es entera de variables
- **Y** se lee «Marcá tus gastos fijos al anotarlos: alquiler, cuotas, suscripciones.»

### Escenario: sin gastos para repartir
- **Dado** que este mes sólo hay un gasto de 30 € en Trabajo (reembolsable)
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja la barra y se lee «Todavía no anotaste gastos este mes.»

## Requisito: porcentaje de lo que entró

Encima del resultado del mes, una línea de texto dice qué parte de lo que entró en el mes ya se
gastó. Si el gasto supera lo ingresado, la línea se marca. Transferencias y ajustes no cuentan, y
tampoco los gastos de «Trabajo (reembolsable)» ni los ingresos de Reembolso: no son plata propia.

### Escenario: gasto chico frente a lo que entró
- **Dado** ingresos de 1700 € y gastos de 149,80 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Gastaste el 9 % de lo que entró»
- **Y** debajo se ve el resultado, 1550,2 €

### Escenario: gasto mayor que lo que entró
- **Dado** ingresos de 100 € y gastos de 150 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Gastaste el 150 % de lo que entró» y la línea se marca como excedida

### Escenario: mes sin ingresos
- **Dado** gastos de 50 € y ningún ingreso este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Todavía no anotaste ingresos este mes»

### Escenario: reembolsos fuera del porcentaje
- **Dado** un ingreso de 1000 € en Sueldo y otro de 50 € en Reembolso, y gastos de 200 € en Súper y 50 € en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Inicio
- **Entonces** se lee «Gastaste el 20 % de lo que entró»
