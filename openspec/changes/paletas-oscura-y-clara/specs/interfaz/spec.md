# Capacidad: interfaz

## Requisito: una sola letra en toda la app

Los títulos de las pantallas y de las hojas usan la misma letra que el resto del texto, en negrita: una sans del
sistema. Los números (importes, totales y el resultado del mes) usan una letra monoespaciada.

### Escenario: títulos con la letra del texto
- **Dado** la app abierta en Inicio
- **Cuando** la persona mira el título «Este mes» y abre la hoja de nuevo gasto
- **Entonces** el título y el de la hoja usan la misma letra que el resto del texto

### Escenario: los números en monoespaciada
- **Dado** la app con un gasto este mes
- **Cuando** la persona mira el resultado del mes en Inicio y el importe en Movimientos
- **Entonces** los importes usan una letra monoespaciada y los textos, la sans

### Escenario: sin letras de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio

## Requisito: el logo «mf.» dentro de la app

El encabezado de Inicio muestra el monograma «mf.» con la letra de la app: las letras en el color del texto y el punto
en el color de acento de la apariencia (naranja en la oscura, verde en la clara).

### Escenario: logo en Inicio
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el encabezado muestra «mf.» con el punto en el naranja de la paleta

### Escenario: el logo sigue a la apariencia
- **Dado** el logo en Inicio
- **Cuando** la persona cambia a la apariencia Clara
- **Entonces** las letras pasan al verde oscuro del texto y el punto, al verde de la paleta Jardín

## Requisito: tarjetas con degradado

El disponible de cada cuenta con tope, «Cuotas del mes» y el patrimonio son tarjetas con un degradado suave de los
colores de la paleta, que se funde con el fondo. Las demás tarjetas son de vidrio neutro. El texto de las tarjetas con
degradado se lee con un contraste de al menos 4,5 a 1 en todo su degradado.

### Escenario: tarjetas con degradado
- **Dado** una tarjeta de crédito con tope y una financiación con cuota
- **Cuando** la persona abre Inicio
- **Entonces** el disponible de la tarjeta y «Cuotas del mes» tienen un fondo con degradado
- **Y** «Gasto del mes» tiene el fondo neutro de siempre

### Escenario: el degradado se lee en las dos apariencias
- **Dado** esas mismas tarjetas y el patrimonio
- **Cuando** la persona los mira en las apariencias Clara y Oscura
- **Entonces** el texto de las tarjetas con degradado tiene contraste de al menos 4,5 a 1 con el peor punto de su degradado

## Requisito: color por categoría y por tipo de cuenta

Cada categoría tiene su color, el mismo en la torta, en la lista, en el icono y en el borde de su tarjeta de
movimiento. Cada tipo de cuenta tiene el suyo en la franja de su tarjeta. Son los mismos en las dos apariencias.

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y el icono de su tarjeta tienen el mismo color

### Escenario: texto legible en las tarjetas
- **Dado** un gasto en Compras este mes
- **Cuando** la persona abre Movimientos en las apariencias Oscura y Clara
- **Entonces** el texto de su tarjeta y la letra de su icono se leen con contraste de al menos 4,5 a 1

### Escenario: reembolsos distinguibles
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su tarjeta tiene el color propio de esa categoría y distinto del de Compras

## Requisito: todo se lee sobre el fondo

En las dos apariencias, con el fondo de manchas detrás, los importes principales y el texto de las tarjetas se leen con
un contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables se distinguen de su tarjeta (al
menos 1,5 a 1: el dato está en el texto que la acompaña).

### Escenario: contraste en las dos apariencias
- **Dado** gastos fijos y variables, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas y Cierre en las apariencias Clara y Oscura
- **Entonces** el resultado, el disponible, el patrimonio y el texto de las tarjetas tienen contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables, de al menos 1,5 a 1 contra su tarjeta

## Retirado: tarjetas neutras sobre el fondo de manchas
Lo sustituyen «tarjetas con degradado» y «color por categoría y por tipo de cuenta».
