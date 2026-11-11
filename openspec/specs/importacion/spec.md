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

Un movimiento que ya está cargado en esa cuenta (misma fecha e importe) llega desmarcado como «Ya está». Cada movimiento guardado cubre uno solo del extracto: si el extracto trae más movimientos iguales que los guardados, los que sobran entran como nuevos. Vale igual entre extractos de formatos distintos de la misma cuenta: cuando el extracto trae fecha de operación y fecha valor, coincide con lo guardado en cualquiera de las dos y, si no, con un movimiento igual guardado a tres días o menos (cada formato fecha distinto el mismo movimiento). Una compra y su anulación por el mismo importe y comercio el mismo día llegan desmarcadas las dos, como «Anulada».

### Escenario: movimiento ya cargado
- **Dado** un gasto de 25,30 € del 2026-10-18 ya cargado en Banco A
- **Cuando** la persona importa un extracto de Banco A con ese mismo movimiento
- **Entonces** ese movimiento llega desmarcado como «Ya está»

### Escenario: compra anulada
- **Dado** un extracto con una compra de 3,50 € y su anulación el mismo día en el mismo comercio
- **Cuando** la persona lo importa
- **Entonces** las dos llegan desmarcadas como «Anulada»

### Escenario: dos iguales y uno guardado
- **Dado** un gasto de 400,00 € del 2026-11-03 ya cargado en Banco A
- **Cuando** la persona importa un extracto de Banco A con dos gastos de 400,00 € del 2026-11-03
- **Entonces** uno llega como «Ya está» y el otro entra como nuevo

### Escenario: dos iguales y dos guardados
- **Dado** dos gastos de 400,00 € del 2026-11-03 ya cargados en Banco A
- **Cuando** la persona importa un extracto con esos dos gastos
- **Entonces** los dos llegan como «Ya está»

### Escenario: extractos solapados de distinto formato
- **Dado** un extracto de Santander en español ya importado, con movimientos del 23 al 31 de octubre
- **Cuando** la persona importa un extracto en inglés del 23 de octubre al 5 de noviembre con esos mismos movimientos y tres más
- **Entonces** los de octubre llegan como «Ya está» y sólo entran los tres nuevos

### Escenario: importar dos veces el mismo extracto
- **Dado** un extracto ya importado entero
- **Cuando** la persona lo importa otra vez
- **Entonces** todos sus movimientos llegan como «Ya está» y la app avisa «Marcá al menos un movimiento» si intenta guardar

### Escenario: guardado con la fecha de operación
- **Dado** un gasto de 8,00 € guardado en Banco A con fecha 2026-10-05
- **Cuando** la persona importa un extracto de Santander con ese gasto, con fecha de operación 5 de octubre y fecha valor 4 de octubre
- **Entonces** ese movimiento llega como «Ya está»

### Escenario: guardado con otra fecha cercana
- **Dado** un gasto de 20,70 € guardado en Banco A con fecha 2026-10-05
- **Cuando** la persona importa un extracto de Santander con ese gasto con fecha de operación y fecha valor 4 de octubre
- **Entonces** ese movimiento llega como «Ya está»

### Escenario: la holgura no tapa un movimiento nuevo
- **Dado** un gasto de 2,10 € guardado en Banco A con fecha 2026-10-10
- **Cuando** la persona importa un extracto de Santander con ese gasto del 10 de octubre y otro de 2,10 € del 11 de octubre
- **Entonces** el del 10 llega como «Ya está» y el del 11 entra como nuevo

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
cuentas. Vale igual para el extracto en español («Transferencia internacional») y en inglés («International Transfer»). Si para ese mismo destinatario la persona eligió antes otra categoría, llega con esa.

### Escenario: transferencia internacional
- **Dado** «Banco A» y «Revolut», y un extracto de Revolut con «Transferencia internacional a Ana Ejemplo» por 20 €
- **Cuando** la persona lo importa
- **Entonces** ese movimiento llega como «Gasto · Regalos»

### Escenario: transferencia internacional en inglés
- **Dado** «Banco A» y «Revolut», y un extracto de Revolut en inglés con «International Transfer to Ana Ejemplo» por 20 €
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

## Requisito: leer el extracto de Revolut en inglés

El extracto de la cuenta de Revolut en euros descargado en inglés se lee igual que el de español: cada línea con su fecha, su
descripción y su importe (lo que sale, negativo; lo que entra, positivo), el saldo final para conciliar y el número de cuenta. Si
el PDF trae también un extracto en otra moneda, esa parte no se lee. El extracto en español se lee como siempre.

### Escenario: extracto en inglés
- **Dado** un extracto de Revolut en inglés de octubre de 2026 con un pago de 10,00 € el 1 de octubre y un ingreso de 40,00 € el 5 de octubre
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra el pago de 10,00 € como gasto el 2026-10-01
- **Y** el ingreso de 40,00 € el 2026-10-05
- **Y** la app reconoce la cuenta por los últimos cuatro dígitos de su número

### Escenario: saldo final del extracto en inglés
- **Dado** un extracto de Revolut en inglés con saldo final de 17,89 €
- **Cuando** la persona lo guarda
- **Entonces** la app ofrece conciliar con ese saldo

### Escenario: el extracto en español sigue igual
- **Dado** un extracto de Revolut en español con los mismos movimientos
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra los mismos movimientos, con las mismas fechas e importes

### Escenario: otra moneda en el mismo archivo
- **Dado** un archivo con un extracto de Revolut en euros y otro en dólares sin movimientos
- **Cuando** la persona lo importa
- **Entonces** sólo se leen los movimientos en euros

### Escenario: el mismo extracto con otro rango de fechas
- **Dado** el extracto del 1 al 31 de octubre ya importado y el mismo extracto hasta el 2 de noviembre
- **Cuando** la persona importa el segundo
- **Entonces** los movimientos de octubre llegan desmarcados como «Ya está»

### Escenario: extracto en inglés sin movimientos
- **Dado** un extracto de Revolut en inglés sin ninguna transacción
- **Cuando** la persona lo importa
- **Entonces** la app avisa «No encontré movimientos en este archivo.» y no abre la revisión

## Requisito: el pago de la tarjeta no se cuenta dos veces

Cuando el extracto de una cuenta trae un pago a una tarjeta propia y esa tarjeta ya tiene anotado un ingreso «Pago» del mismo importe
con fecha a no más de tres días, la línea llega marcada como «Reemplaza el pago anotado». Al guardar, queda una sola transferencia
de la cuenta a la tarjeta y se quita el ingreso anotado antes. Si no hay un ingreso que coincida, el pago se anota como transferencia
nueva. Si la persona desmarca la línea, no se cambia nada. Un mismo ingreso no se reemplaza dos veces.

### Escenario: el pago ya estaba en la tarjeta
- **Dado** «Tarjeta A» con un ingreso «Pago» de 700,00 € del 2026-10-02 y «Banco A» con una deuda de 1.000,00 € en la tarjeta
- **Cuando** la persona importa un extracto de Banco A con «Liquidación de las tarjetas de crédito» por 700,00 € el 2026-10-02
- **Entonces** esa línea llega marcada como «Reemplaza el pago anotado»
- **Y** al guardar, la tarjeta tiene una transferencia de Banco A por 700,00 € y ningún ingreso «Pago»
- **Y** la deuda de la tarjeta es la misma que antes de importar

### Escenario: el pago de este mes todavía no estaba
- **Dado** «Tarjeta A» sin ningún ingreso «Pago» de 767,00 €
- **Cuando** la persona importa un extracto de Banco A con una liquidación de 767,00 €
- **Entonces** esa línea llega sin marca y se anota como transferencia nueva

### Escenario: fecha a tres días
- **Dado** un ingreso «Pago» de 700,00 € en la tarjeta el 2026-10-01 y una liquidación en el banco el 2026-10-04
- **Cuando** la persona importa el extracto del banco
- **Entonces** la línea reemplaza ese ingreso

### Escenario: fecha a más de tres días
- **Dado** un ingreso «Pago» de 700,00 € en la tarjeta el 2026-10-01 y una liquidación en el banco el 2026-10-05
- **Cuando** la persona importa el extracto del banco
- **Entonces** la línea llega sin marca y el ingreso se queda como estaba

### Escenario: dos pagos iguales
- **Dado** dos ingresos «Pago» de 100,00 € en la tarjeta y una sola liquidación de 100,00 € en el banco
- **Cuando** la persona importa el extracto del banco
- **Entonces** la liquidación reemplaza un solo ingreso y el otro se queda

### Escenario: la línea desmarcada no cambia nada
- **Dado** un ingreso «Pago» reemplazable y la línea marcada «Reemplaza el pago anotado»
- **Cuando** la persona la desmarca y guarda
- **Entonces** el ingreso «Pago» sigue en la tarjeta y no se anota ninguna transferencia por esa línea

### Escenario: primero el banco y después la tarjeta
- **Dado** la transferencia de 700,00 € de Banco A a la tarjeta ya guardada
- **Cuando** la persona importa el resumen de la tarjeta con ese pago
- **Entonces** el pago llega desmarcado como «Ya está»

### Escenario: tres resúmenes y el extracto del banco
- **Dado** tres resúmenes de tarjeta seguidos con sus pagos ya importados y el extracto del banco con esos mismos pagos más uno nuevo
- **Cuando** la persona importa el extracto del banco
- **Entonces** los pagos repetidos se reemplazan, el nuevo se anota como transferencia y la deuda de la tarjeta baja sólo por el pago nuevo

## Requisito: una bonificación es un ingreso

Un abono del banco cuyo concepto dice «bonificación» es dinero que entra, no plata que pasa entre cuentas propias: llega como ingreso, aunque el texto lleve el número de contrato de una tarjeta de la persona. Su categoría es «Intereses y rendimientos» si existe, y si no «Otros». La persona puede cambiarla en la revisión.

### Escenario: bonificación con el contrato de la tarjeta
- **Dado** «Banco A» y «Tarjeta A» terminada en 7146, y un extracto de Banco A con «Liquidación por bonificación de campaña del contrato 0049 0755 50 21947146» por 5,86 €
- **Cuando** la persona lo importa
- **Entonces** ese movimiento llega como ingreso, no como transferencia a «Tarjeta A»

### Escenario: la liquidación de la tarjeta sigue siendo transferencia
- **Dado** esas mismas cuentas y un extracto de Banco A con «Liquidación de las tarjetas de crédito del contrato 0049 0755 502 1947146» por 700 €
- **Cuando** la persona lo importa
- **Entonces** ese movimiento llega como transferencia a «Tarjeta A»

### Escenario: bonificación sin tarjeta
- **Dado** «Banco A» sin ninguna tarjeta
- **Cuando** la persona importa un extracto con una bonificación de 4,20 €
- **Entonces** llega como ingreso

## Requisito: leer el extracto de Santander en inglés

El extracto de movimientos de la cuenta de Santander descargado en inglés se lee como el de español: cada movimiento con su fecha valor, su concepto y su importe con signo, el saldo disponible para conciliar y el número de cuenta. Si un movimiento no trae fecha valor, se usa la fecha de operación.

### Escenario: extracto en inglés
- **Dado** un extracto de Santander en inglés con un pago de 35,00 € del 2 de noviembre de 2026 y una nómina de 2000,00 € del 30 de octubre
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra el pago como gasto de 35,00 € y la nómina como ingreso de 2000,00 €
- **Y** la app reconoce la cuenta por los últimos cuatro dígitos de su número

### Escenario: se usa la fecha valor
- **Dado** un movimiento con fecha de operación 5 de noviembre y fecha valor 3 de noviembre
- **Cuando** la persona importa el extracto
- **Entonces** el movimiento llega con fecha 2026-11-03

### Escenario: saldo para conciliar
- **Dado** un extracto en inglés con saldo disponible de 52,00 € al 11 de noviembre de 2026
- **Cuando** la persona lo guarda
- **Entonces** la app ofrece conciliar con 52,00 €

### Escenario: concepto en dos líneas
- **Dado** un movimiento cuyo concepto sigue en la línea de la fecha valor
- **Cuando** la persona importa el extracto
- **Entonces** el movimiento se reconoce con el concepto completo, por ejemplo como pago a su tarjeta propia

### Escenario: el extracto en español sigue igual
- **Dado** un extracto de Santander en español con los mismos movimientos
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra los mismos movimientos, con las mismas fechas e importes

### Escenario: extracto en inglés sin movimientos
- **Dado** un extracto de Santander en inglés sin ningún movimiento
- **Cuando** la persona lo importa
- **Entonces** la app avisa «No encontré movimientos en este archivo.» y no abre la revisión

## Requisito: resumen de la revisión

Arriba de la lista, la revisión del extracto dice el periodo que cubre el archivo y cuántos movimientos son nuevos y cuántos ya estaban. El periodo es el de las fechas del primer y del último movimiento del archivo; si no hay fechas, muestra sólo los conteos. La lista muestra sólo los movimientos nuevos; los que ya estaban quedan plegados bajo «Ver los N que ya estaban» y, al abrirlo, se pueden marcar para guardarlos igual.

### Escenario: nuevos y repetidos
- **Dado** un extracto del 23/10 al 05/11 con 3 movimientos nuevos y 5 que ya estaban
- **Cuando** la persona abre la revisión
- **Entonces** ve «Del 23/10 al 05/11 · 3 nuevos · 5 ya estaban»

### Escenario: todo nuevo
- **Dado** un extracto con 4 movimientos y ninguno guardado
- **Cuando** la persona abre la revisión
- **Entonces** el resumen dice «4 nuevos · 0 ya estaban»

### Escenario: periodo de un archivo de tabla
- **Dado** un archivo CSV con dos movimientos del 5 y del 6 de octubre
- **Cuando** la persona abre la revisión
- **Entonces** el resumen dice «Del 05/10 al 06/10 · 2 nuevos · 0 ya estaban»

### Escenario: los que ya estaban quedan plegados
- **Dado** un extracto con 3 movimientos nuevos y 5 que ya estaban
- **Cuando** la persona abre la revisión
- **Entonces** la lista muestra los 3 nuevos y el texto «Ver los 5 que ya estaban»
- **Y** los 5 no se ven hasta tocarlo

### Escenario: abrir los que ya estaban
- **Dado** la revisión con «Ver los 5 que ya estaban»
- **Cuando** la persona lo toca y marca uno de ellos
- **Entonces** ve los 5 con la marca «Ya está» y el botón pasa a «Guardar 4 movimientos»

### Escenario: sin repetidos no hay plegado
- **Dado** un extracto con 4 movimientos y ninguno guardado
- **Cuando** la persona abre la revisión
- **Entonces** no aparece «Ver los que ya estaban»
