# Capacidad: movimientos

## Requisito: anotar un gasto

Con el botón «+» la persona abre «Nuevo movimiento», elige Gasto y anota importe, una de sus
cuentas, categoría, una nota opcional y la fecha, que por defecto es hoy. Las categorías de gasto
son las de la persona; al empezar: Supermercado, Comida fuera, Delivery, Transporte, Ocio, Compras, Ropa,
Belleza, Casa/Splitwise, Salud, Viajes, Regalos, Salidas bar/disco, Plan Iberia, Servicios mensuales,
Alquiler, Carga móvil, Trabajo (reembolsable) y Otros. También puede crear una con «Nueva categoría…». El gasto baja el saldo de la cuenta o, si es una tarjeta,
sube su deuda.

### Escenario: gasto desde una cuenta propia
- **Dado** que hoy es 2026-10-15 y «Banco A» con saldo inicial de 1000 € desde el 2026-10-01
- **Cuando** la persona anota un gasto de 12,50 € en Supermercado desde Banco A con la nota «verdulería»
- **Entonces** la app avisa «Gasto guardado»
- **Y** el gasto aparece en Movimientos con «−12,5 €» y la fecha 15/10
- **Y** Banco A tiene 987,5 €

### Escenario: gasto en una categoría nueva
- **Dado** que hoy es 2026-10-15 y «Banco A» con saldo inicial de 1000 € desde el 2026-10-01
- **Cuando** la persona anota un gasto de 30 € en Carga móvil desde Banco A
- **Entonces** el gasto aparece en Movimientos como «Carga móvil» con «−30 €»
- **Y** Banco A tiene 970 €

### Escenario: todas las categorías nuevas se pueden elegir
- **Dado** el formulario de gasto abierto
- **Cuando** la persona mira las categorías
- **Entonces** ve Salidas bar/disco, Plan Iberia, Servicios mensuales, Alquiler y Carga móvil
- **Y** «Otros» sigue siendo la última

### Escenario: importe en cero
- **Dado** el formulario de movimiento abierto
- **Cuando** la persona guarda con el importe en 0
- **Entonces** la app avisa «Poné un importe mayor que 0»
- **Y** no se guarda ningún movimiento

### Escenario: importe vacío
- **Dado** el formulario de movimiento abierto
- **Cuando** la persona guarda con el importe vacío
- **Entonces** el formulario sigue abierto con el aviso propio del teléfono de campo obligatorio
- **Y** no se guarda ningún movimiento

### Escenario: sin cuentas para anotar
- **Dado** que la persona no tiene cuentas
- **Cuando** toca «+» en Inicio
- **Entonces** la hoja dice «Primero creá una cuenta» con el botón «Crear cuenta»
- **Y** el botón abre «Nueva cuenta»

## Requisito: anotar un ingreso

En «Nuevo movimiento» la persona elige Ingreso y anota importe, cuenta, categoría, nota y fecha. Las
categorías de ingreso son las de la persona; al empezar: Sueldo, Reembolso, Reembolso por regalos, Venta o
trabajo extra, Regalo, Intereses y rendimientos, y Otros. El ingreso sube el saldo de la cuenta o, si es una tarjeta, baja su deuda.

### Escenario: ingreso extra
- **Dado** «Banco A» con 1000 €
- **Cuando** la persona anota un ingreso de 200 € en Venta o trabajo extra en Banco A con la nota «bicicleta»
- **Entonces** la app avisa «Ingreso guardado»
- **Y** aparece en Movimientos con «+200 €»
- **Y** Banco A tiene 1200 €

### Escenario: devolución en la tarjeta
- **Dado** «Tarjeta Y» con 350 € de deuda
- **Cuando** la persona anota un ingreso de 20 € en Reembolso en Tarjeta Y
- **Entonces** Tarjeta Y debe 330 €

### Escenario: reembolso por regalos
- **Dado** «Banco A» con 1000 € y un gasto de 80 € en Regalos este mes
- **Cuando** la persona anota un ingreso de 40 € en Reembolso por regalos en Banco A
- **Entonces** el ingreso aparece en Movimientos con «+40 €»
- **Y** el gasto en Regalos sigue siendo 80 € y los ingresos del mes suman 40 €

## Requisito: marcar un gasto como fijo

La hoja de gasto tiene la casilla «Gasto fijo», para lo que se repite al menos 12 meses: alquiler,
cuotas, seguros, suscripciones. No aparece en gastos de «Trabajo (reembolsable)». Al guardar un gasto
fijo con nota, los gastos siguientes con la misma categoría y la misma nota (sin distinguir
mayúsculas ni espacios de más) vienen con la casilla marcada. Desmarcar un gasto lo vuelve variable y
hace que los siguientes con esa nota ya no vengan marcados; los anteriores no cambian. Si la
categoría es «siempre fija», todo gasto de esa categoría cuenta como fijo y la casilla viene marcada, aunque
cambie el importe o la nota; desmarcarla en un gasto lo deja variable sólo a él. En Movimientos, los gastos
fijos llevan la etiqueta «Fijo».

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

### Escenario: categoría siempre fija con importe que cambia
- **Dado** «Siempre fija» activada en Servicios mensuales y gastos de 40 € en agosto y de 80 € en septiembre 2026 en esa categoría con notas distintas
- **Cuando** la persona abre Movimientos y mira Inicio en septiembre
- **Entonces** el gasto de septiembre dice «Fijo» aunque el importe haya cambiado
- **Y** Inicio muestra «Fijos 80 €» en el reparto de septiembre

## Requisito: sugerir gastos fijos

Cuando un mismo gasto (misma categoría y misma nota) aparece en tres meses de calendario seguidos,
con un importe parecido (lo de cada mes no se aparta más de un 10 % del promedio de los tres), y no
está marcado como fijo, Inicio muestra la tarjeta «¿“<nota>” es un gasto fijo?» con los botones «Sí,
es fijo» y «No». Se muestra una sugerencia a la vez, la de mayor importe. «Sí, es fijo» marca como
fijos todos los gastos ya anotados con esa categoría y nota, y los siguientes vienen marcados. «No»
hace que no se vuelva a preguntar por ese gasto. No se sugieren gastos sin nota, de «Trabajo
(reembolsable)» ni de categorías «siempre fijas».

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
- **Dado** que hoy es 2026-10-15 y gastos de 100 € en Supermercado sin nota en agosto, septiembre y octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia

### Escenario: categoría siempre fija no se sugiere
- **Dado** que hoy es 2026-10-15, «Siempre fija» activada en Salud y gastos en Salud con la nota «gimnasio» de 30 € en agosto, septiembre y octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia
