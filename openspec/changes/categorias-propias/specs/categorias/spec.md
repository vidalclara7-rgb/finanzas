# Capacidad: categorias

## Requisito: ver las categorías

Ajustes tiene la tarjeta «Categorías», que abre una hoja con dos listas: las de gasto, cada una con su
color y la marca «Siempre fija» si la tiene, y las de ingreso. Al empezar están las de siempre.

### Escenario: las categorías de siempre
- **Dado** la app sin ninguna categoría editada
- **Cuando** la persona abre Ajustes y toca «Categorías»
- **Entonces** ve las categorías de gasto de siempre, con «Otros» al final
- **Y** ve las categorías de ingreso de siempre

## Requisito: crear una categoría

La persona crea una categoría de gasto o de ingreso con un nombre. En las de gasto elige también el color y
si es «Siempre fija». El nombre no puede estar vacío, repetirse ni llevar el signo «|». Las nuevas van antes
de «Otros».

### Escenario: crear una categoría de gasto
- **Dado** la hoja «Categorías» abierta
- **Cuando** la persona toca «Nueva categoría» en gastos, escribe «Mascotas», elige un color y guarda
- **Entonces** la app avisa «Categoría guardada»
- **Y** «Mascotas» aparece en la lista, antes de «Otros», con ese color

### Escenario: crear una categoría de ingreso
- **Dado** la hoja «Categorías» abierta
- **Cuando** la persona toca «Nueva categoría» en ingresos, escribe «Alquiler cobrado» y guarda
- **Entonces** «Alquiler cobrado» aparece en las categorías de ingreso

### Escenario: nombre vacío
- **Dado** la hoja de una categoría nueva abierta
- **Cuando** la persona guarda sin nombre
- **Entonces** la app avisa «Poné un nombre para la categoría» y no guarda nada

### Escenario: nombre repetido
- **Dado** que ya existe la categoría «Ocio»
- **Cuando** la persona crea una categoría llamada «  ocio »
- **Entonces** la app avisa «Ya tenés una categoría con ese nombre» y no guarda nada

### Escenario: nombre con barra
- **Dado** la hoja de una categoría nueva abierta
- **Cuando** la persona escribe «Luz|Gas» y guarda
- **Entonces** la app avisa «El nombre no puede llevar el signo |» y no guarda nada

## Requisito: renombrar y cambiar el color

La persona cambia el nombre y el color de una categoría. Los movimientos, lo que la app aprendió al importar y
lo marcado como fijo siguen con la categoría renombrada.

### Escenario: renombrar con movimientos
- **Dado** un gasto de 20 € en Ocio
- **Cuando** la persona renombra «Ocio» a «Salidas»
- **Entonces** el gasto aparece en Movimientos como «Salidas»
- **Y** la torta de Inicio y la hoja de la categoría lo cuentan en «Salidas»

### Escenario: lo aprendido sigue
- **Dado** una importación anterior en la que la persona guardó «Bar Ejemplo» como Ocio
- **Cuando** renombra «Ocio» a «Salidas» e importa un extracto con una compra en «Bar Ejemplo»
- **Entonces** esa compra llega con la categoría Salidas

### Escenario: cambiar el color
- **Dado** la categoría «Ocio» con su color
- **Cuando** la persona elige otro color y guarda
- **Entonces** «Ocio» se ve con el nuevo color en la torta, la lista y las tarjetas de Movimientos

## Requisito: borrar una categoría

Borrar una categoría pide un segundo toque y avisa cuántos movimientos pasan a «Otros». Esos movimientos
quedan en «Otros» y lo aprendido para la categoría se descarta.

### Escenario: borrar con movimientos
- **Dado** dos gastos en Ocio
- **Cuando** la persona toca «Borrar categoría» en «Ocio»
- **Entonces** el botón dice «Tocá de nuevo: sus 2 movimientos pasan a Otros»
- **Y** al tocarlo otra vez, los dos gastos aparecen como «Otros» y «Ocio» ya no está en la lista

### Escenario: un solo toque no borra
- **Dado** la hoja de la categoría «Ocio»
- **Cuando** la persona toca «Borrar categoría» una vez
- **Entonces** la categoría sigue en la lista

## Requisito: categorías con comportamiento propio

«Otros», «Trabajo (reembolsable)» y, en ingresos, «Otros» y «Reembolso» no se pueden renombrar ni borrar,
porque la app las usa para otras cosas.

### Escenario: no se puede borrar Otros
- **Dado** la hoja de la categoría «Otros»
- **Cuando** la persona la abre
- **Entonces** ve «Esta categoría tiene un comportamiento propio y no se puede cambiar»
- **Y** no hay botón para borrarla ni para renombrarla

## Requisito: categoría siempre fija

En una categoría de gasto, el interruptor «Siempre fija» hace que todo gasto de esa categoría cuente como
fijo, sin importar el importe ni la nota. Desmarcarlo en un gasto concreto lo deja variable.

### Escenario: activar siempre fija
- **Dado** gastos de 40 €, 80 € y 45 € en Servicios mensuales en tres meses distintos, sin marcar
- **Cuando** la persona activa «Siempre fija» en Servicios mensuales
- **Entonces** los tres dicen «Fijo» en Movimientos
- **Y** Inicio los cuenta en fijos

### Escenario: la categoría con interruptor viene marcada
- **Dado** «Siempre fija» activada en Alquiler
- **Cuando** la persona abre un gasto nuevo y elige Alquiler
- **Entonces** la casilla «Gasto fijo» aparece marcada

### Escenario: excepción en un gasto
- **Dado** «Siempre fija» activada en Servicios mensuales y un gasto en esa categoría
- **Cuando** la persona edita el gasto y desmarca «Gasto fijo»
- **Entonces** ese gasto no dice «Fijo» y los demás de la categoría sí

## Requisito: nueva categoría desde los selectores

Al anotar un movimiento, la categoría se elige en un desplegable que termina con «Nueva categoría…»; al revisar
un extracto, la lista de cada movimiento también la tiene. Al elegirla se abre la hoja para crearla y, al guardar,
vuelve a lo que se estaba haciendo con la categoría nueva ya elegida.

### Escenario: crear al anotar un gasto
- **Dado** la hoja de gasto abierta con el importe escrito
- **Cuando** la persona toca «Nueva categoría…», escribe «Mascotas» y guarda
- **Entonces** vuelve al gasto, con el importe y «Mascotas» elegida

### Escenario: crear al revisar un extracto
- **Dado** la revisión de un extracto con un gasto en «Otros»
- **Cuando** la persona elige «Nueva categoría…» en ese gasto, escribe «Mascotas» y guarda
- **Entonces** vuelve a la revisión con ese gasto en «Mascotas» y el resto de la revisión intacta

### Escenario: cancelar la creación
- **Dado** la hoja de gasto abierta
- **Cuando** la persona toca «Nueva categoría…» y cierra la hoja sin guardar
- **Entonces** vuelve al gasto con la categoría que tenía
