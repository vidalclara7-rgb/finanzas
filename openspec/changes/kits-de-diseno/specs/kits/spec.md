# Capacidad: kits

## Requisito: elegir el kit de diseño

En Ajustes, «Diseño» ofrece cuatro kits (Índigo, Nieve, Jardín y Brûlée). Cada uno trae junto su paleta, su letra y su
logo «mf.», y cada kit se ve en la apariencia clara y en la oscura. Cada opción muestra su logo, sus colores y una línea
de texto con su letra. Al elegir uno, toda la app cambia al instante y la elección se recuerda al volver a abrir. Sin
elección, el kit es Índigo. Elegir un kit no cambia la apariencia.

### Escenario: Índigo por defecto
- **Dado** una app recién abierta, sin datos
- **Cuando** la persona abre Ajustes
- **Entonces** la tarjeta «Diseño» tiene marcado «Índigo»

### Escenario: elegir otro kit
- **Dado** la app en el kit Índigo y la apariencia Oscura
- **Cuando** la persona elige «Nieve» en Ajustes
- **Entonces** los colores del fondo, la letra y el logo pasan a los de Nieve y la opción queda marcada
- **Y** la apariencia sigue siendo Oscura

### Escenario: el kit se recuerda
- **Dado** el kit «Jardín» elegido
- **Cuando** la persona vuelve a abrir la app
- **Entonces** la app se ve con el kit Jardín

### Escenario: cada kit en las dos apariencias
- **Dado** el kit «Brûlée»
- **Cuando** la persona pasa de la apariencia Oscura a la Clara
- **Entonces** el fondo pasa de un chocolate oscuro a un crema claro, y el kit sigue siendo Brûlée

## Requisito: la letra del kit

Cada kit tiene su letra, una de las que ya trae el teléfono (sin cargar nada de otros sitios): Índigo, sans con los
números en monoespaciada; Nieve, serif; Jardín, redondeada; Brûlée, serif en los textos y sans en los números. Los
títulos de las pantallas y de las hojas usan la letra del texto, en negrita.

### Escenario: la letra cambia con el kit
- **Dado** la app en el kit Índigo
- **Cuando** la persona elige «Nieve»
- **Entonces** los textos pasan a una letra serif
- **Y** el título «Este mes» y el de una hoja usan la misma letra que el texto

### Escenario: los números del kit
- **Dado** el resultado del mes en Inicio
- **Cuando** la persona recorre los cuatro kits
- **Entonces** el importe usa la letra de números de cada kit: monoespaciada en Índigo, serif en Nieve, redondeada en Jardín y sans en Brûlée

### Escenario: sin letras de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre los cuatro kits
- **Entonces** la app no hace ninguna petición a otro sitio

## Requisito: el logo «mf.» dentro de la app

El monograma «mf.» se ve en el encabezado de Inicio y en la tarjeta «Diseño» de Ajustes, dibujado con la letra del kit:
las letras en el color del texto y el punto en el color de acento del kit.

### Escenario: logo en Inicio
- **Dado** la app en el kit Índigo
- **Cuando** la persona abre Inicio
- **Entonces** el encabezado muestra «mf.» con el punto en el rojo anaranjado de Índigo

### Escenario: el logo sigue al kit
- **Dado** el logo en Inicio
- **Cuando** la persona elige «Jardín»
- **Entonces** el logo cambia a la letra redondeada de Jardín y su punto al color de acento de Jardín

## Requisito: tarjetas con degradado del kit

El disponible de cada cuenta con tope, «Cuotas del mes» y el patrimonio son tarjetas con un degradado difuso del color
de acento del kit, que se funde con el fondo. Las demás tarjetas son de vidrio neutro. El texto de las tarjetas con
degradado se lee con un contraste de al menos 4,5 a 1 en todo su degradado.

### Escenario: tarjetas con degradado
- **Dado** una tarjeta de crédito con tope y una financiación con cuota
- **Cuando** la persona abre Inicio
- **Entonces** el disponible de la tarjeta y «Cuotas del mes» tienen un fondo con degradado
- **Y** «Gasto del mes» tiene el fondo neutro de siempre

### Escenario: el degradado se lee en todos los kits
- **Dado** esas mismas tarjetas, el patrimonio y los cuatro kits
- **Cuando** la persona los recorre en las apariencias Clara y Oscura
- **Entonces** el texto de las tarjetas con degradado tiene contraste de al menos 4,5 a 1 con el peor punto de su degradado

## Requisito: color por categoría y por tipo de cuenta

Cada categoría tiene su color, el mismo en la torta, en la lista, en el icono y en el borde de su tarjeta de
movimiento, y el mismo en los cuatro kits. Cada tipo de cuenta tiene el suyo en la franja de su tarjeta.

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y el icono de su tarjeta tienen el mismo color

### Escenario: el color no cambia con el kit
- **Dado** un gasto en Supermercado
- **Cuando** la persona cambia de kit
- **Entonces** el color de Supermercado en la torta es el mismo

### Escenario: texto legible en las tarjetas
- **Dado** un gasto en Compras este mes
- **Cuando** la persona abre Movimientos en cada kit y en las dos apariencias
- **Entonces** el texto de su tarjeta y la letra de su icono se leen con contraste de al menos 4,5 a 1

### Escenario: reembolsos distinguibles
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su tarjeta tiene el color propio de esa categoría y distinto del de Compras
