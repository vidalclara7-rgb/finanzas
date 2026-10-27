# Capacidad: importacion

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
