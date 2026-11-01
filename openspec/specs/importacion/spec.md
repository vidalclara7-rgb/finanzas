# Capacidad: importacion

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

## Requisito: crear una cuenta al revisar un extracto

En la revisión, la lista de cada movimiento tiene «Nueva cuenta…». Abre la hoja «Nueva cuenta» y, al guardar,
vuelve a la revisión con ese movimiento como transferencia a la cuenta creada. El resto de la revisión queda
como estaba. Cerrar la hoja sin guardar vuelve a la revisión sin cambios. La cuenta nueva parte desde la fecha
del movimiento más viejo del extracto, para que las transferencias del extracto cuenten en su saldo.

### Escenario: mandar plata a una inversión que no existía
- **Dado** «Banco A» y la revisión de un extracto con «Traspaso Fondo» de −200 € propuesto como gasto en Otros
- **Cuando** la persona elige «Nueva cuenta…» en ese movimiento, elige Inversiones, escribe «Broker X» y guarda
- **Entonces** vuelve a la revisión con ese movimiento como «Transferencia a Broker X»
- **Y** los demás movimientos de la revisión siguen igual
- **Y** al guardar la importación, Broker X tiene 200 € y Banco A 200 € menos

### Escenario: cobro que llega de una cuenta nueva
- **Dado** la revisión de un extracto con «Ingreso Fondo» de +150 € propuesto como ingreso
- **Cuando** la persona elige «Nueva cuenta…», escribe «Broker X» y guarda
- **Entonces** ese movimiento queda como «Transferencia desde Broker X»

### Escenario: cerrar sin guardar
- **Dado** la revisión de un extracto con un movimiento propuesto como gasto en Otros
- **Cuando** la persona elige «Nueva cuenta…» y cierra la hoja sin guardar
- **Entonces** vuelve a la revisión con ese movimiento como gasto en Otros
- **Y** no se creó ninguna cuenta

### Escenario: cuenta sin nombre
- **Dado** la hoja «Nueva cuenta» abierta desde la revisión
- **Cuando** la persona guarda sin nombre
- **Entonces** la app avisa «Ponele un nombre a la cuenta» y la hoja sigue abierta

## Requisito: recordar a qué cuenta va cada transferencia

Cuando la persona guarda una descripción como transferencia a una cuenta (o desde una cuenta), la próxima vez
que aparezca la misma descripción se propone esa misma transferencia, antes que lo que la app deduce por el
texto. Si después la persona la guarda como gasto o ingreso, se deja de proponer la transferencia.

### Escenario: la app recuerda el destino
- **Dado** una importación anterior en la que la persona guardó «Traspaso Fondo» como transferencia a «Broker X»
- **Cuando** importa otro extracto con «Traspaso Fondo»
- **Entonces** ese movimiento llega como «Transferencia a Broker X»

### Escenario: elegir otra cosa lo olvida
- **Dado** esa transferencia recordada
- **Cuando** la persona guarda «Traspaso Fondo» como gasto en Otros y después importa otro extracto con «Traspaso Fondo»
- **Entonces** ese movimiento llega como gasto en Otros

### Escenario: la cuenta recordada ya no existe
- **Dado** una descripción recordada como transferencia a una cuenta que la persona borró
- **Cuando** importa un extracto con esa descripción
- **Entonces** llega como siempre (gasto) y la importación funciona con normalidad

### Escenario: el destino es la misma cuenta
- **Dado** una descripción recordada como transferencia a «Broker X»
- **Cuando** la persona importa un extracto del propio «Broker X» con esa descripción
- **Entonces** no se propone una transferencia a sí misma

## Requisito: plata guardada a cuenta no es un gasto

Una plata que la persona entrega pero que sigue siendo suya (una garantía, un depósito) se maneja como una cuenta
propia de tipo «Deudas compartidas» con «Me deben». Mandarla es una transferencia: no cuenta como gasto del
mes y el patrimonio no cambia.

### Escenario: garantía como cuenta propia
- **Dado** «Banco A» con 1000 € y «Depósito», de tipo Deudas compartidas, «Me deben», con 0 €
- **Cuando** la persona importa un extracto de Banco A con «Garantía» de −300 € y la marca como transferencia a Depósito
- **Entonces** Banco A tiene 700 € y Depósito 300 €
- **Y** el resultado del mes no cambia y el patrimonio neto sigue en 1000 €

## Requisito: importar un extracto desde un archivo

Desde Movimientos o desde la hoja de una cuenta, la persona elige un archivo con movimientos: un PDF, un Excel (.xlsx), un
CSV, un archivo de texto o una foto. Los formatos conocidos (extracto de cuenta de Revolut en euros, movimientos de cuenta de
Santander y extracto de tarjeta de crédito de Santander) se leen como siempre. Cualquier otro se lee buscando filas con una
fecha y un importe, sea cual sea su formato: con importe negativo es un gasto y con importe positivo es un ingreso. La cuenta
se reconoce por los últimos cuatro dígitos del número de cuenta o de tarjeta que recuerda. La primera vez, la persona elige a
cuál de sus cuentas corresponde. Siempre se revisa antes de guardar.

### Escenario: extracto reconocido
- **Dado** «Banco A» con el extracto de Santander terminado en 4321 ya importado una vez
- **Cuando** la persona importa otro extracto de esa cuenta con 12 movimientos
- **Entonces** la app propone Banco A y dice «Revisá 12 movimientos»

### Escenario: primera vez con una cuenta
- **Dado** «Revolut» sin extractos importados
- **Cuando** la persona importa un extracto de Revolut y elige Revolut como su cuenta
- **Entonces** la próxima vez que importe un extracto de esa cuenta, la app propone Revolut

### Escenario: tabla en Excel con cabeceras en inglés
- **Dado** un Excel con las columnas «Transaction date», «Description», «Amount» y «Currency», y 3 filas con importes negativos
- **Cuando** la persona lo importa desde Movimientos y elige «Banco A» como cuenta
- **Entonces** la app dice «Revisá 3 movimientos» y los muestra como gastos con su fecha, descripción e importe

### Escenario: la misma tabla en un PDF
- **Dado** un PDF con esa misma tabla de 3 movimientos
- **Cuando** la persona lo importa
- **Entonces** la app dice «Revisá 3 movimientos» con los mismos importes

### Escenario: CSV con punto y coma y coma decimal
- **Dado** un CSV separado por punto y coma, con fechas «05/10/2026» e importes «-12,50» y «1.200,00»
- **Cuando** la persona lo importa
- **Entonces** ve un gasto de 12,50 € y un ingreso de 1200 €

### Escenario: columnas de cargo y abono
- **Dado** una tabla con las columnas «Cargo» y «Abono» y una fila con 30,00 en «Cargo» y otra con 100,00 en «Abono»
- **Cuando** la persona la importa
- **Entonces** la primera fila es un gasto de 30 € y la segunda un ingreso de 100 €

### Escenario: todos los importes positivos
- **Dado** una tabla de 4 movimientos con importes sin signo
- **Cuando** la persona la importa
- **Entonces** la app pregunta «Todos los importes son positivos. ¿Son gastos o ingresos?» antes de revisar
- **Y** al elegir «Gastos», los 4 movimientos se proponen como gastos

### Escenario: filas que no son movimientos
- **Dado** una tabla con un título, una fila de cabeceras, 2 movimientos y una fila de total sin fecha
- **Cuando** la persona la importa
- **Entonces** la app dice «Revisá 2 movimientos»

### Escenario: cuenta reconocida por el número de tarjeta
- **Dado** «Tarjeta Y» con el extracto terminado en 0123 ya importado, y un Excel con el número de tarjeta «4000 0000 0000 0123» arriba de la tabla
- **Cuando** la persona lo importa
- **Entonces** la app propone Tarjeta Y sin preguntar

### Escenario: archivo sin movimientos
- **Dado** la app abierta
- **Cuando** la persona elige un archivo de texto sin fechas ni importes
- **Entonces** la app avisa «No encontré movimientos en este archivo.» y no cambia nada

### Escenario: archivo que no se puede leer
- **Dado** un archivo «datos.xlsx» dañado
- **Cuando** la persona lo importa
- **Entonces** la app avisa «No pude leer este archivo.» y no cambia nada

## Requisito: leer fotos

Una foto de un extracto, de un recibo o de una pantalla se lee con reconocimiento de texto dentro de la app, sin enviar
nada a otro sitio, y sus filas pasan por la misma revisión. Mientras lee, la app avisa «Leyendo la foto…». Un PDF sin texto
(escaneado) se lee igual que una foto. La primera vez, el lector de fotos se descarga y necesita conexión.

### Escenario: foto de una tabla de movimientos
- **Dado** una foto con 3 filas de fecha, descripción e importe
- **Cuando** la persona la importa y elige «Banco A» como cuenta
- **Entonces** la app muestra «Leyendo la foto…» y después «Revisá 3 movimientos»

### Escenario: PDF escaneado
- **Dado** un PDF que es una imagen de una tabla con 3 movimientos
- **Cuando** la persona lo importa
- **Entonces** la app lo lee como una foto y dice «Revisá 3 movimientos»

### Escenario: foto sin texto
- **Dado** una foto sin texto legible
- **Cuando** la persona la importa
- **Entonces** la app avisa «No pude leer texto en la foto.» y no cambia nada

### Escenario: el lector de fotos no se puede cargar
- **Dado** que el lector de fotos no se puede descargar
- **Cuando** la persona importa una foto
- **Entonces** la app avisa «No pude cargar el lector de fotos. Probá de nuevo con conexión.» y no cambia nada

### Escenario: la lectura no pide nada a otros sitios
- **Dado** una foto de una tabla
- **Cuando** la persona la importa
- **Entonces** la app no hace ninguna petición fuera de su propio sitio

## Requisito: leer las compras fraccionadas del resumen

Cuando el resumen de la tarjeta de Santander trae la tabla de operaciones fraccionadas, la revisión muestra un bloque
«Compras fraccionadas» con las que siguen en curso: su descripción, la cuota («Cuota 3 de 5») y lo que queda por pagar. Cada una
viene marcada. Al guardar, cada marcada se anota en la tarjeta por lo que queda, como compra en cuotas repartida en las cuotas que
faltan (una sola, si sólo falta una), que empiezan a contar como gasto en el mes siguiente al del resumen; la deuda de la tarjeta
sube desde la fecha del resumen. La cuota que ya cobró el resumen sigue
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
- **Entonces** la tarjeta tiene una compra «Tienda Dos» de 45,29 € en 1 cuota de 45,29 €, desde noviembre de 2026
- **Y** octubre de 2026 no cuenta ese gasto

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

## Requisito: intereses del resumen de tarjeta

Los intereses de financiación que trae el resumen de la tarjeta de Santander entran como gastos de la tarjeta, uno por cada
compra fraccionada, con su importe y con el comercio al que corresponden. Se leen aunque su fila esté partida en dos líneas
del PDF, y el pie de página del resumen no forma parte de ninguna descripción.

### Escenario: cada interés con su importe
- **Dado** un resumen de tarjeta con tres intereses de financiación de 0,15 €, 1,70 € y 1,95 €
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra los tres intereses como gastos con esos importes

### Escenario: interés con la fila partida en dos líneas
- **Dado** un resumen donde la fecha y el concepto de un interés están en una línea del PDF y sus importes en la siguiente
- **Cuando** la persona lo importa
- **Entonces** el interés aparece en la revisión con su importe

### Escenario: el pie de página no es parte del interés
- **Dado** un resumen donde el pie de página «BANCO SANTANDER, S.A.» va justo después del último interés
- **Cuando** la persona lo importa
- **Entonces** la descripción de ese interés no contiene «Santander»
- **Y** se propone como gasto y no como transferencia a otra cuenta

## Requisito: empezar la cuenta con el saldo anterior del resumen

Cuando el resumen de una tarjeta de Santander trae el saldo anterior y la cuenta de destino es una tarjeta sin ningún
movimiento, la revisión muestra la casilla «Empezar esta cuenta con el saldo anterior del resumen» con ese importe y su fecha,
marcada. Si queda marcada al guardar, la deuda inicial de la cuenta pasa a ser ese saldo anterior, desde esa fecha, y lo que se
importa cuadra con el resumen. Si ya hay movimientos, o el resumen no trae el saldo anterior, no se ofrece.

### Escenario: ofrecer empezar con el saldo anterior
- **Dado** «Tarjeta Y» sin movimientos y un resumen de tarjeta con saldo anterior de 742,94 € al 29/09
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra la casilla marcada «Empezar esta cuenta con el saldo anterior del resumen: 742,94 € el 29/09»

### Escenario: guardar empezando con el saldo anterior
- **Dado** esa revisión con la casilla marcada y un resumen que paga 742,94 € y trae compras por 100 €
- **Cuando** la persona guarda
- **Entonces** la deuda inicial de Tarjeta Y es 742,94 € desde 2026-09-29
- **Y** al conciliar con el resumen la diferencia es 0 €

### Escenario: no empezar con el saldo anterior
- **Dado** esa revisión
- **Cuando** la persona desmarca la casilla y guarda
- **Entonces** la deuda inicial y la fecha de inicio de la cuenta no cambian

### Escenario: una cuenta con movimientos no lo ofrece
- **Dado** «Tarjeta Y» con un gasto
- **Cuando** la persona importa el resumen
- **Entonces** la revisión no muestra «Empezar esta cuenta con el saldo anterior del resumen»

### Escenario: un resumen sin saldo anterior no lo ofrece
- **Dado** «Banco A» sin movimientos y un extracto de la cuenta de Santander
- **Cuando** la persona lo importa
- **Entonces** la revisión no muestra «Empezar esta cuenta con el saldo anterior del resumen»
