# Capacidad: importacion

## Requisito: importar un extracto en PDF

Desde Movimientos o desde la hoja de una cuenta, la persona elige un PDF. La app reconoce el formato
(extracto de cuenta de Revolut en euros, movimientos de cuenta de Santander o extracto de tarjeta de
crédito de Santander) y de qué cuenta es, por los últimos cuatro dígitos que recuerda. La primera
vez que importa un extracto de una cuenta, la persona elige a cuál de sus cuentas corresponde.

### Escenario: extracto reconocido
- **Dado** «Banco A» con el extracto de Santander terminado en 4321 ya importado una vez
- **Cuando** la persona importa otro extracto de esa cuenta con 12 movimientos
- **Entonces** la app propone Banco A y dice «Revisá 12 movimientos»

### Escenario: primera vez con una cuenta
- **Dado** «Revolut» sin extractos importados
- **Cuando** la persona importa un extracto de Revolut y elige Revolut como su cuenta
- **Entonces** la próxima vez que importe un extracto de esa cuenta, la app propone Revolut

### Escenario: archivo no reconocido
- **Dado** la app abierta
- **Cuando** la persona elige un PDF que no es de ninguno de los formatos que lee
- **Entonces** la app avisa «No reconozco este extracto. Por ahora leo Revolut (cuenta en euros) y Santander (cuenta y tarjeta de crédito).» y no cambia nada

## Requisito: revisar antes de guardar

Los movimientos del extracto aparecen como borradores, cada uno con fecha, descripción, importe, tipo
y categoría propuestos, marcados para guardar. La persona puede cambiar tipo y categoría o desmarcar
cada uno. Nada se guarda hasta tocar «Guardar»; cerrar sin guardar no cambia nada.

### Escenario: guardar sólo lo marcado
- **Dado** un extracto con 5 movimientos en revisión
- **Cuando** la persona desmarca uno y toca «Guardar 4 movimientos»
- **Entonces** se guardan 4 movimientos en la cuenta y la app avisa «4 movimientos importados»

### Escenario: cerrar sin guardar
- **Dado** un extracto en revisión
- **Cuando** la persona cierra la hoja
- **Entonces** no se guarda ningún movimiento

## Requisito: categoría propuesta

Cada gasto llega con una categoría propuesta: la que la persona eligió antes para el mismo comercio
o, si no hay, la que corresponde a palabras conocidas (por ejemplo, un supermercado conocido es
Supermercado). Si no hay ninguna, Otros. Lo que la persona elige al guardar queda recordado.

### Escenario: comercio conocido
- **Dado** un extracto con una compra en «Consum»
- **Cuando** la persona lo importa
- **Entonces** esa compra llega con la categoría Supermercado

### Escenario: tienda de ropa
- **Dado** un extracto con una compra en «Zara»
- **Cuando** la persona lo importa
- **Entonces** esa compra llega con la categoría Ropa

### Escenario: la app aprende
- **Dado** una importación anterior en la que la persona guardó «Bar Ejemplo» como Ocio
- **Cuando** importa otro extracto con una compra en «Bar Ejemplo»
- **Entonces** esa compra llega con la categoría Ocio

## Requisito: no contar dos veces

Un movimiento que ya está cargado en esa cuenta (misma fecha e importe) llega desmarcado como «Ya
está». Una compra y su anulación por el mismo importe y comercio el mismo día llegan desmarcadas las
dos, como «Anulada».

### Escenario: movimiento ya cargado
- **Dado** un gasto de 25,30 € del 2026-10-18 ya cargado en Banco A
- **Cuando** la persona importa un extracto de Banco A con ese mismo movimiento
- **Entonces** ese movimiento llega desmarcado como «Ya está»

### Escenario: compra anulada
- **Dado** un extracto con una compra de 3,50 € y su anulación el mismo día en el mismo comercio
- **Cuando** la persona lo importa
- **Entonces** las dos llegan desmarcadas como «Anulada»

## Requisito: transferencias entre tus cuentas

Cuando un movimiento es plata que pasa entre dos cuentas de la persona (una recarga de Revolut desde
el banco, un pago a su propio nombre, el cargo de la tarjeta de crédito), se propone como
transferencia con la otra cuenta. Si la otra mitad ya estaba cargada, llega desmarcado como «Ya
está».

### Escenario: recarga de Revolut desde el banco
- **Dado** «Banco A» y «Revolut»
- **Cuando** la persona importa un extracto de Banco A con «Compra Revolut» por 100 €
- **Entonces** ese movimiento llega como transferencia de Banco A a Revolut

### Escenario: la otra mitad ya está
- **Dado** una transferencia de 100 € de Banco A a Revolut del 2026-10-13 ya guardada
- **Cuando** la persona importa un extracto de Revolut con una recarga de 100 € del 2026-10-13
- **Entonces** esa recarga llega desmarcada como «Ya está»

## Requisito: reembolsos al importar

Una transferencia que entra con «Gastos» en el concepto se propone como ingreso de Reembolso, y al
revisarla se pueden marcar los gastos por cobrar que cubre.

### Escenario: transferencia de la empresa
- **Dado** gastos reembolsables pendientes de 12,40 € y 4,60 €
- **Cuando** la persona importa un extracto con una transferencia de 17 € con el concepto «Gastos de agosto», marca los dos gastos y guarda
- **Entonces** el ingreso queda como Reembolso y los dos gastos quedan «Pagado»

## Requisito: conciliar con el extracto

Después de guardar, si el extracto trae el saldo de la cuenta (o el importe a pagar, en la tarjeta),
la app ofrece conciliar la cuenta con ese importe a la fecha del último movimiento.

### Escenario: saldo que coincide
- **Dado** un extracto de Banco A cuyo saldo final coincide con el calculado después de importar
- **Cuando** la persona toca «Conciliar con el extracto»
- **Entonces** Banco A queda «Conciliada» ese mes

### Escenario: saldo que no coincide
- **Dado** un extracto de Banco A cuyo saldo final es 10 € menos que el calculado
- **Cuando** la persona toca «Conciliar con el extracto»
- **Entonces** se abre la conciliación de Banco A con ese saldo y la diferencia de -10 €

## Requisito: gastos fijos al importar

Un gasto del extracto cuya categoría y descripción coinciden con un gasto que la persona marcó como
fijo llega en la revisión con la etiqueta «Fijo», y se guarda como fijo salvo que la persona la
quite.

### Escenario: alquiler importado
- **Dado** un gasto fijo «alquiler» en Casa/Splitwise de septiembre 2026
- **Cuando** la persona importa un extracto con un cargo «Alquiler» que llega en Casa/Splitwise
- **Entonces** ese borrador dice «Fijo» y, al guardarlo, el gasto queda fijo

## Requisito: transferencia internacional a tu nombre

Una transferencia internacional a nombre de la persona sale a una cuenta que no está en la app (por
ejemplo, para pagar algo en otro país): llega como gasto en Regalos, no como transferencia entre sus
cuentas. Si para ese mismo destinatario la persona eligió antes otra categoría, llega con esa.

### Escenario: transferencia internacional
- **Dado** «Banco A» y «Revolut», y un extracto de Revolut con «Transferencia internacional a Ana Ejemplo» por 20 €
- **Cuando** la persona lo importa
- **Entonces** ese movimiento llega como «Gasto · Regalos»

### Escenario: otra categoría recordada
- **Dado** una importación anterior en la que la persona guardó esa transferencia internacional como Casa/Splitwise
- **Cuando** importa otro extracto con otra transferencia internacional al mismo destinatario
- **Entonces** llega como «Gasto · Casa/Splitwise»

