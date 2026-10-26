# Capacidad: inversiones

## Requisito: dar de alta activos

En una cuenta de inversión, la persona da de alta activos con un nombre, por ejemplo «Fondo A». Cada
activo pertenece a una cuenta y empieza sin cantidad ni precio.

### Escenario: alta de un activo
- **Dado** «Broker X», una cuenta de inversión
- **Cuando** la persona abre «Ver rendimiento» y crea el activo «Fondo A»
- **Entonces** «Fondo A» aparece en la hoja con cantidad 0 y rendimiento sin datos

### Escenario: nombre vacío
- **Dado** el formulario de nuevo activo abierto
- **Cuando** la persona guarda sin nombre
- **Entonces** la app avisa «Poné un nombre para el activo» y no guarda nada

## Requisito: registrar compras y ventas

La persona anota una compra o una venta de un activo con fecha, cantidad, precio por unidad y una
comisión opcional. Compras y ventas mueven el efectivo de la cuenta y la cantidad del activo, y no
cuentan como gasto ni como ingreso.

### Escenario: compra
- **Dado** «Broker X» con 1000 € en efectivo desde el 2026-10-01 y el activo «Fondo A»
- **Cuando** la persona anota el 2026-10-10 una compra de 10 unidades a 50 €
- **Entonces** «Fondo A» tiene 10 unidades
- **Y** el efectivo de Broker X es 500 €
- **Y** Broker X vale 1000 €

### Escenario: compra con comisión
- **Dado** esa misma cuenta y activo
- **Cuando** la persona anota una compra de 10 unidades a 50 € con 2 € de comisión
- **Entonces** el efectivo de Broker X es 498 €

### Escenario: venta parcial
- **Dado** 10 unidades de «Fondo A» compradas a 50 €
- **Cuando** la persona anota una venta de 4 unidades a 60 €
- **Entonces** «Fondo A» tiene 6 unidades
- **Y** el efectivo de Broker X es 740 €

### Escenario: vender más de lo que se tiene
- **Dado** 6 unidades de «Fondo A»
- **Cuando** la persona intenta vender 8
- **Entonces** la app avisa «No tenés tantas unidades» y no guarda nada

### Escenario: cantidad o precio en cero
- **Dado** el formulario de nueva operación abierto
- **Cuando** la persona guarda con la cantidad o el precio en 0 o vacío
- **Entonces** la app avisa «Poné una cantidad y un precio mayores que 0» y no guarda nada

### Escenario: no es gasto ni ingreso
- **Dado** una compra de 500 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** los gastos, los ingresos y el resultado del mes no cambian

### Escenario: efectivo negativo
- **Dado** «Broker X» con 100 € en efectivo
- **Cuando** la persona anota una compra de 500 €
- **Entonces** la compra se guarda
- **Y** la hoja avisa «El efectivo de esta cuenta quedó en negativo: anotá la transferencia de entrada»

## Requisito: precio actual de un activo

El precio actual de un activo es el último que la persona anotó, en una operación o con «Actualizar
precio», según la fecha más reciente. La app no consulta cotizaciones. Un activo sin precio vale 0.

### Escenario: actualizar el precio
- **Dado** 10 unidades de «Fondo A» compradas a 50 €
- **Cuando** la persona actualiza el precio a 55 € con fecha de hoy
- **Entonces** «Fondo A» vale 550 €

### Escenario: precio más viejo no pisa al nuevo
- **Dado** «Fondo A» con precio 55 € anotado el 2026-10-20
- **Cuando** la persona anota una compra con fecha 2026-10-12 a 52 €
- **Entonces** el precio actual sigue siendo 55 €

### Escenario: precio inválido
- **Dado** la hoja «Actualizar precio» abierta
- **Cuando** la persona guarda con el precio vacío o en 0
- **Entonces** la app avisa «Poné un precio mayor que 0»

## Requisito: valor de la cuenta con posiciones

El valor de una cuenta de inversión con activos es su efectivo más lo que valen sus posiciones
(cantidad por precio actual). Ese valor entra en el patrimonio neto. Una cuenta de inversión sin
activos se calcula como siempre.

### Escenario: valor con una posición
- **Dado** «Broker X» con 500 € de efectivo y 10 unidades de «Fondo A» a 55 €
- **Cuando** la persona abre Cuentas
- **Entonces** Broker X vale 1050 €
- **Y** el patrimonio neto suma 1050 € por esa cuenta

### Escenario: cuenta sin activos
- **Dado** «Broker X» con saldo inicial de 2000 € y ningún activo
- **Cuando** la persona abre Cuentas
- **Entonces** Broker X vale 2000 € y muestra su ganancia sobre el total aportado como siempre

## Requisito: rendimiento por activo y por cuenta

La hoja «Inversiones» muestra, para cada activo, su cantidad, su valor y su rendimiento en euros y en
porcentaje: lo que valen hoy sus unidades más lo cobrado en ventas, menos lo pagado en compras
(comisiones incluidas), sobre lo pagado en compras. La cuenta suma sus activos y no cuenta el efectivo.

### Escenario: rendimiento con una venta
- **Dado** una compra de 10 unidades a 50 € y una venta de 4 unidades a 60 €, con precio actual de 60 €
- **Cuando** la persona abre «Ver rendimiento»
- **Entonces** «Fondo A» vale 360 € y muestra «+100 € (+20,0 %)»

### Escenario: precio subido
- **Dado** una compra de 10 unidades a 50 € y precio actual de 55 €
- **Cuando** la persona abre «Ver rendimiento»
- **Entonces** «Fondo A» muestra «+50 € (+10,0 %)»

### Escenario: activo sin compras
- **Dado** el activo «Fondo A» sin operaciones
- **Cuando** la persona abre «Ver rendimiento»
- **Entonces** «Fondo A» muestra «Sin datos todavía» en lugar del rendimiento

### Escenario: rendimiento de la cuenta
- **Dado** «Fondo A» con +50 € y «Fondo B» con −20 €
- **Cuando** la persona mira el total de Broker X
- **Entonces** el rendimiento de la cuenta es «+30 €»

### Escenario: sin cuentas de inversión
- **Dado** que la persona no tiene cuentas de inversión
- **Cuando** abre Cuentas
- **Entonces** no ve «Ver rendimiento»

## Requisito: corregir y borrar operaciones y activos

La persona edita o borra una operación, y borra un activo. Borrar un activo con operaciones pide
confirmar y borra también sus operaciones. Todo se recalcula al instante.

### Escenario: borrar una operación
- **Dado** una compra de 10 unidades a 50 €
- **Cuando** la persona la borra y confirma
- **Entonces** «Fondo A» vuelve a 0 unidades y el efectivo de la cuenta recupera los 500 €

### Escenario: borrar una compra que respalda ventas
- **Dado** una compra de 10, una venta de 4 y otra venta de 6, todas sobre el mismo activo
- **Cuando** la persona intenta borrar la compra
- **Entonces** la app avisa «Esa compra respalda ventas posteriores» y no la borra

### Escenario: borrar un activo con operaciones
- **Dado** «Fondo A» con dos operaciones
- **Cuando** la persona lo borra
- **Entonces** la app pide confirmar y avisa que se borran sus 2 operaciones
- **Y** al confirmar, el efectivo de la cuenta vuelve a lo que era antes de ellas

### Escenario: borrar la cuenta
- **Dado** «Broker X» con activos y operaciones
- **Cuando** la persona borra la cuenta y confirma
- **Entonces** sus activos y operaciones desaparecen también
