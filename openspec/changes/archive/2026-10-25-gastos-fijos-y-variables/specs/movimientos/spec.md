# Capacidad: movimientos

## Requisito: marcar un gasto como fijo

La hoja de gasto tiene la casilla «Gasto fijo», para lo que se repite al menos 12 meses: alquiler,
cuotas, seguros, suscripciones. No aparece en gastos de «Trabajo (reembolsable)». Al guardar un gasto
fijo con nota, los gastos siguientes con la misma categoría y la misma nota (sin distinguir
mayúsculas ni espacios de más) vienen con la casilla marcada. Desmarcar un gasto lo vuelve variable y
hace que los siguientes con esa nota ya no vengan marcados; los anteriores no cambian. En
Movimientos, los gastos fijos llevan la etiqueta «Fijo».

### Escenario: gasto marcado como fijo
- **Dado** «Banco A» y ningún gasto este mes
- **Cuando** la persona anota 600 € en Casa/Splitwise con la nota «alquiler» y marca «Gasto fijo»
- **Entonces** su tarjeta en Movimientos dice «Fijo»
- **Y** Inicio muestra «Fijos 600 € · 100 %»

### Escenario: el siguiente viene marcado
- **Dado** un gasto fijo en Casa/Splitwise con la nota «alquiler» en septiembre 2026
- **Cuando** la persona abre un gasto nuevo, elige Casa/Splitwise y escribe la nota «Alquiler »
- **Entonces** la casilla «Gasto fijo» aparece marcada

### Escenario: desmarcar un fijo
- **Dado** dos gastos fijos «alquiler» en Casa/Splitwise, uno en septiembre y otro en octubre 2026
- **Cuando** la persona edita el de octubre y desmarca «Gasto fijo»
- **Entonces** el de octubre ya no dice «Fijo» y el de septiembre sí
- **Y** un gasto nuevo en Casa/Splitwise con la nota «alquiler» viene sin marcar

### Escenario: reembolsable sin casilla
- **Dado** la hoja de gasto abierta
- **Cuando** la persona elige Trabajo (reembolsable)
- **Entonces** no aparece la casilla «Gasto fijo»

### Escenario: sin nota no se arrastra
- **Dado** un gasto fijo en Ocio sin nota
- **Cuando** la persona abre un gasto nuevo y elige Ocio sin escribir nota
- **Entonces** la casilla «Gasto fijo» aparece sin marcar

## Requisito: sugerir gastos fijos

Cuando un mismo gasto (misma categoría y misma nota) aparece en tres meses de calendario seguidos,
con un importe parecido (lo de cada mes no se aparta más de un 10 % del promedio de los tres), y no
está marcado como fijo, Inicio muestra la tarjeta «¿“<nota>” es un gasto fijo?» con los botones «Sí,
es fijo» y «No». Se muestra una sugerencia a la vez, la de mayor importe. «Sí, es fijo» marca como
fijos todos los gastos ya anotados con esa categoría y nota, y los siguientes vienen marcados. «No»
hace que no se vuelva a preguntar por ese gasto. No se sugieren gastos sin nota ni de «Trabajo
(reembolsable)».

### Escenario: sugerencia tras tres meses
- **Dado** que hoy es 2026-10-15 y gastos en Salud con la nota «gimnasio» de 30 € en agosto, 30 € en septiembre y 32 € en octubre
- **Cuando** la persona abre Inicio
- **Entonces** aparece la tarjeta «¿“gimnasio” es un gasto fijo?»

### Escenario: aceptar la sugerencia
- **Dado** la tarjeta «¿“gimnasio” es un gasto fijo?» con sus tres gastos de agosto a octubre
- **Cuando** la persona toca «Sí, es fijo»
- **Entonces** la tarjeta desaparece y los tres gastos dicen «Fijo» en Movimientos
- **Y** Inicio muestra «Fijos 32 €» en el reparto de octubre

### Escenario: rechazar la sugerencia
- **Dado** la tarjeta «¿“gimnasio” es un gasto fijo?»
- **Cuando** la persona toca «No» y vuelve a abrir la app
- **Entonces** la tarjeta no aparece y los gastos siguen sin la etiqueta «Fijo»

### Escenario: importe que cambia mucho
- **Dado** que hoy es 2026-10-15 y gastos en Casa/Splitwise con la nota «luz» de 40 € en agosto, 80 € en septiembre y 45 € en octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia

### Escenario: un mes salteado
- **Dado** que hoy es 2026-10-15 y gastos en Salud con la nota «gimnasio» de 30 € en julio, agosto y octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia

### Escenario: gastos sin nota
- **Dado** que hoy es 2026-10-15 y gastos de 100 € en Súper sin nota en agosto, septiembre y octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia

## Requisito: resultado del mes

Inicio muestra los ingresos, los gastos y el resultado del mes en curso (ingresos menos gastos).
Transferencias y ajustes no cuentan, y tampoco los gastos de «Trabajo (reembolsable)» ni los ingresos de
Reembolso: el resultado es el de la plata propia. Los totales de Movimientos sí los incluyen.

### Escenario: resultado con ingresos y gastos
- **Dado** ingresos de 1500 € en Sueldo y 200 € en Venta o trabajo extra, y gastos de 64,30 € y 18 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** ve ingresos 1700 €, gastos 82,3 € y resultado 1617,7 €

### Escenario: mes en negativo
- **Dado** un ingreso de 100 € y gastos por 150 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado es -50 € y se marca en rojo

### Escenario: reembolsos fuera del resultado
- **Dado** un ingreso de 1000 € en Sueldo y otro de 50 € en Reembolso, y gastos de 200 € en Súper y 50 € en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Inicio
- **Entonces** ve ingresos 1000 €, gastos 200 € y resultado 800 €
- **Y** en Movimientos, los totales son ingresos 1050 € y gastos 250 €
