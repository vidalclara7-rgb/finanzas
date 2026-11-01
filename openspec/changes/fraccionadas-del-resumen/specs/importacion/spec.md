# Capacidad: importacion

## Requisito: leer las compras fraccionadas del resumen

Cuando el resumen de la tarjeta de Santander trae la tabla de operaciones fraccionadas, la revisión muestra un bloque
«Compras fraccionadas» con las que siguen en curso: su descripción, la cuota («Cuota 3 de 5») y lo que queda por pagar. Cada una
viene marcada. Al guardar, cada marcada se anota en la tarjeta por lo que queda: como compra en cuotas, repartido en las cuotas que
faltan desde el mes siguiente al del resumen, o como un gasto normal si sólo falta una cuota. La cuota que ya cobró el resumen sigue
entrando como gasto del mes. Las ya terminadas no aparecen en el bloque, y una compra que ya se anotó en un resumen anterior no se
vuelve a crear.

### Escenario: fraccionadas en curso en el resumen
- **Dado** un resumen de tarjeta con tres fraccionadas: «Tienda Uno» en la cuota 3 de 5 con 42,96 € pendientes, «Tienda Dos» en la 1 de 2 con 45,29 € pendientes y «Tienda Tres» en la 7 de 7
- **Cuando** la persona importa el resumen
- **Entonces** la revisión muestra «Compras fraccionadas» con «Tienda Uno», «Cuota 3 de 5 · pendiente 42,96 €» y «Tienda Dos», «Cuota 1 de 2 · pendiente 45,29 €»
- **Y** «Tienda Tres» no está en el bloque

### Escenario: guardar una fraccionada con varias cuotas
- **Dado** esa revisión del resumen con periodo hasta el 2026-10-29 y «Tienda Uno» marcada
- **Cuando** la persona guarda
- **Entonces** la tarjeta tiene una compra «Tienda Uno» de 42,96 € en 2 cuotas de 21,48 €, desde noviembre de 2026
- **Y** «Cuotas del mes» de noviembre incluye 21,48 € de «Tienda Uno»

### Escenario: guardar una fraccionada con una sola cuota
- **Dado** esa revisión con «Tienda Dos» marcada
- **Cuando** la persona guarda
- **Entonces** la tarjeta tiene un gasto «Tienda Dos» de 45,29 € con fecha 2026-11-01

### Escenario: no marcar una fraccionada
- **Dado** esa revisión con «Tienda Uno» desmarcada
- **Cuando** la persona guarda
- **Entonces** no se anota ninguna compra «Tienda Uno»

### Escenario: la cuota cobrada sigue siendo un gasto
- **Dado** un resumen con la línea «CUOTA FRACCIONAR COMPRA Tienda Uno» de 20,99 € y esa fraccionada en curso
- **Cuando** la persona guarda todo
- **Entonces** hay un gasto de 20,99 € en octubre y la compra en cuotas empieza en noviembre

### Escenario: el resumen siguiente no duplica
- **Dado** «Tienda Uno» ya anotada desde un resumen anterior
- **Cuando** la persona importa el resumen del mes siguiente, con «Tienda Uno» en la cuota 4 de 5
- **Entonces** «Tienda Uno» aparece en el bloque como «Ya está» y desmarcada
- **Y** al guardar no se crea otra compra

### Escenario: resumen sin fraccionadas
- **Dado** un resumen de tarjeta sin la tabla de fraccionadas
- **Cuando** la persona lo importa
- **Entonces** la revisión no muestra «Compras fraccionadas»

## Requisito: conciliar la tarjeta con lo pendiente

Al conciliar una tarjeta con el resumen, la deuda del resumen es lo que hay que pagar más lo que queda por pagar de las compras
fraccionadas en curso, y la hoja de conciliar lo detalla.

### Escenario: deuda del resumen con lo pendiente
- **Dado** un resumen con 767,47 € a pagar y fraccionadas pendientes por 302,88 €
- **Cuando** la persona guarda y llega a conciliar con el saldo del resumen
- **Entonces** la hoja dice «Deuda del resumen» 1070,35 € con «a pagar 767,47 € + pendiente en cuotas 302,88 €»

### Escenario: resumen sin fraccionadas al conciliar
- **Dado** un resumen con 500 € a pagar y sin fraccionadas
- **Cuando** la persona llega a conciliar
- **Entonces** la deuda del resumen es 500 €
