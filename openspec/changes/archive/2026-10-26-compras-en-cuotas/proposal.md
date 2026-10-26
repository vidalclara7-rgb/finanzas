---
cambio: compras-en-cuotas
estado: archivado
datos: amplia
archivado: 2026-10-26
---
# Compras de tarjeta fraccionadas en cuotas

## Por qué

Una compra con la tarjeta que se fracciona en cuotas se anota hoy por su importe final, y ese total
cuenta de golpe como gasto del mes. Pero lo que se paga este mes es sólo la primera cuota: el resto se
reparte en los meses siguientes. Los totales, los topes y el «a pagar» del mes salen inflados, y no hay
dónde decir «esto está en cuotas».

## Qué cambia

- Al anotar un gasto en una **tarjeta**, hay una opción **«Pagar en cuotas»** con dos datos: cuántas
  cuotas y de cuánto es cada una (la escribe la persona, porque puede incluir intereses).
- El importe del gasto es lo que se debe en total por la compra; la deuda de la tarjeta lo refleja
  entero desde la fecha de la compra.
- Como **gasto de cada mes** cuenta sólo la cuota: este mes y los siguientes hasta la última. Los
  totales, la torta y los topes usan la cuota del mes.
- La tarjeta de la compra muestra «Cuota 1 de 6» y «faltan 5»; la hoja de la cuenta muestra
  «Cuotas de este mes» con lo que toca pagar.

## A quién afecta

A quienes usan tarjeta. Los gastos de tarjeta anteriores no tienen cuotas y se calculan como siempre.

## Pantallas

- Hoja «Nuevo movimiento» (gasto en tarjeta): «Pagar en cuotas», número y valor de la cuota.
- Movimientos: la tarjeta del gasto muestra su cuota.
- Cuentas, hoja de la tarjeta: «Cuotas de este mes».

## Fuera de alcance

- Que el importador de extractos arme las compras en cuotas a partir de las líneas «cuota fraccionar
  compra». Mientras tanto, esas líneas importadas se cuentan como gasto normal del mes y no deben
  anotarse además a mano (se avisa en design.md).
- Calcular intereses o la cuota a partir del total.
- Cuotas en cuentas que no son tarjeta, y adelantar o cancelar cuotas.
- Cambiar el importe de una cuota suelta sin editar toda la compra.
