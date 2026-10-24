# Capacidad: movimientos

## Requisito: anotar un gasto

Con el botón «+» la persona abre «Nuevo movimiento», elige Gasto y anota importe, una de sus
cuentas, categoría, una nota opcional y la fecha, que por defecto es hoy. Las categorías de gasto
son: Súper, Comida fuera, Delivery, Transporte, Ocio, Compras, Belleza, Casa/Splitwise, Salud,
Viajes, Trabajo (reembolsable) y Otros. El gasto baja el saldo de la cuenta o, si es una tarjeta,
sube su deuda.

### Escenario: gasto desde una cuenta propia
- **Dado** que hoy es 2026-10-15 y «Banco A» con saldo inicial de 1000 € desde el 2026-10-01
- **Cuando** la persona anota un gasto de 12,50 € en Súper desde Banco A con la nota «verdulería»
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

## Requisito: anotar un ingreso

En «Nuevo movimiento» la persona elige Ingreso y anota importe, cuenta, categoría, nota y fecha. Las
categorías de ingreso son: Sueldo, Reembolso, Venta o trabajo extra, Regalo, Intereses y
rendimientos, y Otros. El ingreso sube el saldo de la cuenta o, si es una tarjeta, baja su deuda.

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

## Requisito: transferir entre cuentas

En «Nuevo movimiento» la persona elige Transferencia, una cuenta de origen, una de destino, el
importe y la fecha. La plata sale de una y entra en la otra: no es gasto ni ingreso y el patrimonio
no cambia. Pagar la tarjeta es una transferencia del banco a la tarjeta.

### Escenario: pagar la tarjeta
- **Dado** «Banco A» con 1000 € y «Tarjeta Y» con 350 € de deuda
- **Cuando** la persona transfiere 350 € de Banco A a Tarjeta Y
- **Entonces** la app avisa «Transferencia guardada»
- **Y** Banco A tiene 650 € y Tarjeta Y debe 0 €
- **Y** el patrimonio neto sigue en 650 € y los gastos del mes no cambian

### Escenario: misma cuenta de origen y destino
- **Dado** el formulario de transferencia abierto
- **Cuando** la persona elige Banco A como origen y como destino y guarda
- **Entonces** la app avisa «Elegí dos cuentas distintas» y no guarda nada

## Requisito: ver los movimientos del mes

La pestaña Movimientos muestra los movimientos del mes en curso, del más reciente al más antiguo:
ingresos con «+», gastos con «−», transferencias con la cuenta de origen y la de destino, y ajustes
de conciliación. Arriba, el total de ingresos y el de gastos del mes; transferencias y ajustes no
suman en ninguno.

### Escenario: movimientos de otro mes no aparecen
- **Dado** que hoy es 2026-10-15, un gasto del 2026-09-28 y otro del 2026-10-03
- **Cuando** la persona abre Movimientos
- **Entonces** sólo ve el gasto del 2026-10-03

### Escenario: mes sin movimientos
- **Dado** que no hay movimientos en el mes en curso
- **Cuando** la persona abre Movimientos
- **Entonces** ve «Sin movimientos este mes.»

### Escenario: totales sin transferencias
- **Dado** un ingreso de 1500 €, un gasto de 80 € y una transferencia de 300 € este mes
- **Cuando** la persona abre Movimientos
- **Entonces** ve ingresos 1500 € y gastos 80 €

## Requisito: editar un movimiento

Tocar un movimiento abre su hoja con los datos cargados; guardar lo actualiza.

### Escenario: corregir un importe
- **Dado** un gasto de 20 € en Súper desde Banco A, que tiene 980 €
- **Cuando** la persona lo toca, cambia el importe a 25 € y guarda
- **Entonces** el gasto muestra «−25 €» y Banco A tiene 975 €

## Requisito: borrar un movimiento con confirmación

Borrar pide dos toques sobre la cruz del movimiento: el primero la cambia por «Borrar» y el segundo
borra. Si no se confirma en dos segundos y medio, vuelve a la cruz.

### Escenario: borrar con dos toques
- **Dado** un movimiento en la lista del mes
- **Cuando** la persona toca la cruz y después «Borrar»
- **Entonces** la app avisa «Movimiento borrado» y desaparece de la lista

### Escenario: un solo toque no borra
- **Dado** un movimiento en la lista del mes
- **Cuando** la persona toca la cruz una vez y espera tres segundos
- **Entonces** el movimiento sigue en la lista y vuelve a mostrar la cruz

## Requisito: gasto por categoría

Inicio muestra lo gastado en el mes por categoría, de mayor a menor, incluidos los gastos
reembolsables. Ingresos, transferencias y ajustes no aparecen.

### Escenario: categorías ordenadas
- **Dado** 64,30 € en Súper, 42 € en Trabajo (reembolsable), 18 € en Comida fuera y un ingreso de 1500 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** «Por categoría» muestra Súper, Trabajo (reembolsable) y Comida fuera, en ese orden

### Escenario: sin gastos por categoría
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Inicio
- **Entonces** «Por categoría» dice «Todavía no anotaste gastos este mes. Tocá + para empezar.»

## Requisito: resultado del mes

Inicio muestra los ingresos, los gastos y el resultado del mes en curso (ingresos menos gastos).
Transferencias y ajustes no cuentan.

### Escenario: resultado con ingresos y gastos
- **Dado** ingresos de 1500 € en Sueldo y 200 € en Venta o trabajo extra, y gastos de 64,30 € y 18 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** ve ingresos 1700 €, gastos 82,3 € y resultado 1617,7 €

### Escenario: mes en negativo
- **Dado** un ingreso de 100 € y gastos por 150 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado es -50 € y se marca en rojo
