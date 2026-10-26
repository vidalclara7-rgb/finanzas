# Capacidad: movimientos

## Requisito: anotar un gasto

Con el botón «+» la persona abre «Nuevo movimiento», elige Gasto y anota importe, una de sus
cuentas, categoría, una nota opcional y la fecha, que por defecto es hoy. Las categorías de gasto
son: Supermercado, Comida fuera, Delivery, Transporte, Ocio, Compras, Ropa, Belleza, Casa/Splitwise,
Salud, Viajes, Regalos, Salidas bar/disco, Plan Iberia, Servicios mensuales, Alquiler, Carga móvil,
Trabajo (reembolsable) y Otros. El gasto baja el saldo de la cuenta o, si es una tarjeta,
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
categorías de ingreso son: Sueldo, Reembolso, Reembolso por regalos, Venta o trabajo extra, Regalo,
Intereses y rendimientos, y Otros. El ingreso sube el saldo de la cuenta o, si es una tarjeta, baja su deuda.

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
