# Capacidad: movimientos

## Requisito: gasto en cuotas con la tarjeta

Al anotar un gasto en una tarjeta de crédito, la persona puede activar «Pagar en cuotas» e indicar
cuántas cuotas son (dos o más) y de cuánto es cada una. El importe del gasto es lo que debe en total
por la compra. Como gasto de cada mes cuenta sólo la cuota, desde el mes de la compra hasta la última
cuota. La tarjeta de la compra en Movimientos dice «Cuota 1 de 6», con la cuota de cada mes.

### Escenario: compra fraccionada
- **Dado** que hoy es 2026-10-15 y «Tarjeta Y» sin deuda
- **Cuando** la persona anota un gasto de 700 € en Compras con Tarjeta Y, en 3 cuotas de 240 €
- **Entonces** Tarjeta Y debe 700 €
- **Y** el gasto del mes en Compras es 240 €
- **Y** la tarjeta del gasto dice «Cuota 1 de 3»

### Escenario: cuotas en los meses siguientes
- **Dado** esa compra del 2026-10-15 en 3 cuotas de 240 €
- **Cuando** la persona mira el mes de noviembre de 2026
- **Entonces** el gasto de noviembre en Compras es 240 €
- **Y** la tarjeta dice «Cuota 2 de 3»

### Escenario: después de la última cuota
- **Dado** esa compra del 2026-10-15 en 3 cuotas de 240 €
- **Cuando** la persona mira el mes de enero de 2027
- **Entonces** esa compra no cuenta en el gasto de enero

### Escenario: cuota mayor que el total
- **Dado** el formulario de gasto en tarjeta, con 700 € de importe
- **Cuando** la persona pone 3 cuotas de 800 € y guarda
- **Entonces** la app avisa «La cuota no puede ser mayor que el total» y no guarda nada

### Escenario: menos de dos cuotas
- **Dado** el formulario de gasto en tarjeta con «Pagar en cuotas» activado
- **Cuando** la persona pone 1 cuota y guarda
- **Entonces** la app avisa «Poné 2 cuotas o más» y no guarda nada

### Escenario: cuota vacía
- **Dado** el formulario de gasto en tarjeta con «Pagar en cuotas» activado y 3 cuotas
- **Cuando** la persona guarda sin el valor de la cuota
- **Entonces** la app avisa «Poné el valor de cada cuota» y no guarda nada

### Escenario: cuotas y tope de la tarjeta
- **Dado** «Tarjeta Y» con tope mensual de 500 € y un gasto de 700 € en 3 cuotas de 240 €
- **Cuando** la persona abre Inicio en el mes de la compra
- **Entonces** Tarjeta Y muestra 260 € disponibles del tope

### Escenario: la opción sólo existe en tarjetas
- **Dado** el formulario de gasto con «Banco A», una cuenta de bancos
- **Cuando** la persona mira el formulario
- **Entonces** no ve «Pagar en cuotas»

### Escenario: borrar una compra en cuotas
- **Dado** una compra de 700 € en 3 cuotas
- **Cuando** la persona la borra y confirma
- **Entonces** desaparecen todas sus cuotas y la deuda de la tarjeta baja 700 €
