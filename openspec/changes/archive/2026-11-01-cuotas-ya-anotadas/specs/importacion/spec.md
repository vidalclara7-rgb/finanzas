# Capacidad: importacion

## Requisito: las cuotas de una compra fraccionada ya anotada no se cuentan dos veces

Cuando una compra fraccionada ya se anotó con un resumen anterior, la línea «CUOTA FRACCIONAR COMPRA …» de los resúmenes
siguientes sale desmarcada y con la marca «Cuota ya anotada», porque su gasto y su deuda ya cuentan en la compra en cuotas. Vale
también para la última cuota. Los intereses de cada mes se anotan como siempre. Si el resumen es anterior a lo que ya se anotó, la
cuota entra como siempre.

### Escenario: cuota de una compra ya anotada
- **Dado** «Tienda Uno» anotada con el resumen de septiembre (compra en cuotas desde octubre) y el resumen de octubre con la línea «CUOTA FRACCIONAR COMPRA Tienda Uno» de 21,48 €
- **Cuando** la persona importa el resumen de octubre
- **Entonces** esa línea sale desmarcada con «Cuota ya anotada»

### Escenario: la última cuota también
- **Dado** esa misma compra y el resumen de la última cuota («3 de 3»)
- **Cuando** la persona importa ese resumen
- **Entonces** la línea de la última cuota sale desmarcada con «Cuota ya anotada»

### Escenario: una compra que no estaba anotada
- **Dado** un resumen con la línea «CUOTA FRACCIONAR COMPRA Tienda Dos» y ninguna compra «Tienda Dos» anotada
- **Cuando** la persona lo importa
- **Entonces** esa línea sale marcada, como un gasto normal

### Escenario: los intereses siguen entrando
- **Dado** esa compra ya anotada y el interés del mes de la misma compra en el resumen
- **Cuando** la persona importa el resumen
- **Entonces** el interés sale marcado como gasto

### Escenario: un resumen anterior a lo anotado
- **Dado** «Tienda Uno» anotada con el resumen de octubre (compra en cuotas desde noviembre)
- **Cuando** la persona importa el resumen de septiembre con su línea «CUOTA FRACCIONAR COMPRA Tienda Uno»
- **Entonces** esa línea sale marcada como un gasto normal

### Escenario: tres resúmenes seguidos cuadran
- **Dado** una tarjeta sin movimientos y los resúmenes de tres meses seguidos con compras fraccionadas
- **Cuando** la persona los importa, del más antiguo al más nuevo, con la casilla del saldo anterior en el primero
- **Entonces** al conciliar con cada resumen la diferencia es 0 €
