# Capacidad: categorias

## Requisito: ver las categorías

Ajustes tiene la tarjeta «Categorías», que abre una hoja con dos listas: las de gasto, cada una con su
cuadradito de color con su ícono (o su inicial) y la marca «Siempre fija» si la tiene, y las de ingreso. Al empezar están las de siempre.

### Escenario: las categorías de siempre
- **Dado** la app sin ninguna categoría editada
- **Cuando** la persona abre Ajustes y toca «Categorías»
- **Entonces** ve las categorías de gasto de siempre, cada una con su ícono, con «Otros» al final
- **Y** ve las categorías de ingreso de siempre

## Requisito: ícono de la categoría

Cada categoría de gasto puede tener un ícono, elegido de una lista de unos 30 dibujados por la app (carrito, café, moto, colectivo,
entrada, bolsa, remera, brillo, casa, corazón, avión, regalo, copa, maleta, repetir, llave, teléfono, maletín, puntos, entre otros).
Las de siempre traen el suyo: Supermercado el carrito, Comida fuera el café, Delivery la moto, Transporte el colectivo, Ocio la
entrada, Compras la bolsa, Ropa la remera, Belleza el brillo, Casa/Splitwise la casa, Salud el corazón, Viajes el avión, Regalos el
regalo, Salidas bar/disco la copa, Plan Iberia la maleta, Servicios mensuales repetir, Alquiler la llave, Carga móvil el teléfono,
Trabajo (reembolsable) el maletín y Otros los puntos. En la hoja de una categoría, «Ícono» muestra la lista con el elegido marcado,
más «Sin ícono», que deja la inicial. Una categoría nueva empieza sin ícono. El ícono se ve en Movimientos, en «Gasto del mes», en
«Gasto por categoría» y en la lista de categorías. Renombrar una categoría no le cambia el ícono.

### Escenario: elegir un ícono
- **Dado** la categoría «Mascotas» sin ícono y un gasto en ella
- **Cuando** la persona abre «Mascotas», elige el ícono de la huella y guarda
- **Entonces** la app avisa «Categoría guardada»
- **Y** el gasto se ve en Movimientos con la huella en el cuadradito de Mascotas

### Escenario: las de siempre traen el suyo
- **Dado** la app sin ninguna categoría editada y un gasto en Comida fuera
- **Cuando** la persona abre Movimientos
- **Entonces** el gasto lleva el ícono del café

### Escenario: cambiar el ícono de una de siempre
- **Dado** la categoría «Ocio» con su ícono de siempre
- **Cuando** la persona elige el ícono de la copa y guarda
- **Entonces** «Ocio» se ve con la copa en Movimientos, en «Gasto del mes» y en la lista de categorías

### Escenario: sin ícono
- **Dado** la categoría «Ocio» con un ícono
- **Cuando** la persona elige «Sin ícono» y guarda
- **Entonces** «Ocio» se ve con la «O» en su cuadradito

### Escenario: renombrar conserva el ícono
- **Dado** la categoría «Ocio» con su ícono de siempre
- **Cuando** la persona la renombra a «Salidas»
- **Entonces** «Salidas» sigue con el ícono de la entrada

### Escenario: los íconos de las categorías propias
- **Dado** la hoja de la categoría «Otros», que no se puede cambiar
- **Cuando** la persona la abre
- **Entonces** ve su ícono y no puede cambiarlo

## Requisito: renombrar y cambiar el color

La persona cambia el nombre, el color y el ícono de una categoría. Los movimientos, lo que la app aprendió al importar y
lo marcado como fijo siguen con la categoría renombrada.

### Escenario: renombrar con movimientos
- **Dado** un gasto de 20 € en Ocio
- **Cuando** la persona renombra «Ocio» a «Salidas»
- **Entonces** el gasto aparece en Movimientos como «Salidas»
- **Y** «Gasto del mes» de Inicio y la hoja de la categoría lo cuentan en «Salidas»

### Escenario: lo aprendido sigue
- **Dado** una importación anterior en la que la persona guardó «Bar Ejemplo» como Ocio
- **Cuando** renombra «Ocio» a «Salidas» e importa un extracto con una compra en «Bar Ejemplo»
- **Entonces** esa compra llega con la categoría Salidas

### Escenario: cambiar el color
- **Dado** la categoría «Ocio» con su color
- **Cuando** la persona elige otro color y guarda
- **Entonces** «Ocio» se ve con el nuevo color en «Gasto del mes», la pila de «Gasto por categoría» y los cuadraditos de Movimientos
