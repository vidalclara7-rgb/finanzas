# Capacidad: interfaz

## Requisito: modo oscuro

La app se ve en la apariencia que la persona elige (Oscura, Clara o Automática). En la oscura, y en la automática con
el teléfono en modo oscuro, el fondo es oscuro y todos los textos principales se leen con buen contraste.

### Escenario: teléfono en modo oscuro
- **Dado** «Automática» elegida y el teléfono en modo oscuro
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es oscuro
- **Y** los importes de Inicio tienen un contraste de al menos 4,5 a 1 con su fondo

## Requisito: tarjetas neutras sobre el fondo de manchas

Una sola paleta con dos temas, tomados de dos moodboards: la clara en oliva, vino, azul polvo y naranja quemado sobre
crema rosado; la oscura en cereza, chartreuse, rosa y óxido sobre vino muy oscuro. Las tarjetas son neutras y
translúcidas, sin colores vivos: oscuras en la apariencia oscura y blancas, de vidrio esmerilado, en la clara. El color
queda para lo que lo necesita: cada categoría tiene su color, el mismo en la torta, en la lista, en el icono y en el
borde de su tarjeta de movimiento, y cada tipo de cuenta tiene el suyo en la franja de su tarjeta. Los importes
principales son grandes, con los decimales en gris. El texto de las tarjetas es claro en la oscura y oscuro en la clara.

### Escenario: tarjetas neutras sobre el fondo oscuro
- **Dado** la apariencia Oscura y una tarjeta de crédito con tope
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es oscuro, y las tarjetas «Gasto del mes» y el disponible de la tarjeta tienen un fondo neutro oscuro, sin color de categoría
- **Y** el resultado del mes se ve grande con los decimales en gris

### Escenario: tarjetas neutras sobre el fondo claro
- **Dado** la apariencia Clara y una tarjeta de crédito con tope
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es crema rosado y las tarjetas son blancas y translúcidas

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y el icono de su tarjeta tienen el mismo color

### Escenario: texto legible en las tarjetas
- **Dado** un gasto en Compras este mes
- **Cuando** la persona abre Movimientos, en la apariencia Oscura y en la Clara
- **Entonces** el texto de su tarjeta se lee con contraste de al menos 4,5 a 1 con lo que tiene detrás

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

## Requisito: las categorías nuevas tienen color propio

Cada categoría de gasto nueva tiene un color fijo, distinto del de las demás, que es el mismo en la torta, en la lista
de categorías y en las tarjetas de movimiento. En las dos apariencias, el texto de sus tarjetas se lee con contraste de
al menos 4,5 a 1.

### Escenario: color en la torta y en la tarjeta
- **Dado** un gasto de 30 € en Alquiler este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** el color de «Alquiler» es el mismo en la torta, la lista y el icono de la tarjeta
- **Y** no coincide con el de otra categoría

### Escenario: contraste con cada categoría nueva
- **Dado** un gasto en cada categoría nueva
- **Cuando** la persona recorre Movimientos en las apariencias Clara y Oscura
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1

## Retirado: fondo blanco con acentos
Lo sustituyen «tarjetas neutras sobre el fondo de manchas» y la apariencia oscura o clara con fondo de manchas.

## Retirado: elegir la paleta de colores
Hay una sola paleta con sus dos temas (clara y oscura): ya no se elige.

## Retirado: todas las paletas se leen
Lo sustituye «todo se lee sobre el fondo», en las dos apariencias.
