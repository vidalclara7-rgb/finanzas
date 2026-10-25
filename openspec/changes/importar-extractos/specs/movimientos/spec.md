# Capacidad: movimientos

## Requisito: anotar un gasto

Con el botón «+» la persona abre «Nuevo movimiento», elige Gasto y anota importe, una de sus
cuentas, categoría, una nota opcional y la fecha, que por defecto es hoy. Las categorías de gasto
son: Súper, Comida fuera, Delivery, Transporte, Ocio, Compras, Belleza, Casa/Splitwise, Salud,
Viajes, Regalos, Trabajo (reembolsable) y Otros. El gasto baja el saldo de la cuenta o, si es una tarjeta,
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
