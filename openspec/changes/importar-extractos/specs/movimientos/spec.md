# Capacidad: movimientos

## Requisito: anotar un gasto

Con el botón «+» la persona abre «Nuevo movimiento», elige Gasto y anota importe, una de sus
cuentas, categoría, una nota opcional y la fecha, que por defecto es hoy. Las categorías de gasto
son: Supermercado, Comida fuera, Delivery, Transporte, Ocio, Compras, Ropa, Belleza, Casa/Splitwise,
Salud, Viajes, Regalos, Trabajo (reembolsable) y Otros. El gasto baja el saldo de la cuenta o, si es una tarjeta,
sube su deuda.

### Escenario: gasto desde una cuenta propia
- **Dado** que hoy es 2026-10-15 y «Banco A» con saldo inicial de 1000 € desde el 2026-10-01
- **Cuando** la persona anota un gasto de 12,50 € en Supermercado desde Banco A con la nota «verdulería»
- **Entonces** la app avisa «Gasto guardado»
- **Y** el gasto aparece en Movimientos con «−12,5 €» y la fecha 15/10
- **Y** Banco A tiene 987,5 €

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

## Requisito: editar un movimiento

Tocar un movimiento abre su hoja con los datos cargados; guardar lo actualiza.

### Escenario: corregir un importe
- **Dado** un gasto de 20 € en Supermercado desde Banco A, que tiene 980 €
- **Cuando** la persona lo toca, cambia el importe a 25 € y guarda
- **Entonces** el gasto muestra «−25 €» y Banco A tiene 975 €

## Requisito: gasto por categoría

Inicio muestra lo gastado en el mes por categoría, de mayor a menor, incluidos los gastos
reembolsables. Ingresos, transferencias y ajustes no aparecen.

### Escenario: categorías ordenadas
- **Dado** 64,30 € en Supermercado, 42 € en Trabajo (reembolsable), 18 € en Comida fuera y un ingreso de 1500 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** «Por categoría» muestra Supermercado, Trabajo (reembolsable) y Comida fuera, en ese orden

### Escenario: sin gastos por categoría
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Inicio
- **Entonces** «Por categoría» dice «Todavía no anotaste gastos este mes. Tocá + para empezar.»

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
- **Dado** un ingreso de 1000 € en Sueldo y otro de 50 € en Reembolso, y gastos de 200 € en Supermercado y 50 € en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Inicio
- **Entonces** ve ingresos 1000 €, gastos 200 € y resultado 800 €
- **Y** en Movimientos, los totales son ingresos 1050 € y gastos 250 €

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
- **Dado** que hoy es 2026-10-15 y gastos de 100 € en Supermercado sin nota en agosto, septiembre y octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia
