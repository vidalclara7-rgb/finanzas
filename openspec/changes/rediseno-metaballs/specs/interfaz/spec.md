# Capacidad: interfaz

## Requisito: modo oscuro

La app se ve en la apariencia que la persona elige (Oscura, Clara o Automática). En la oscura, y en la automática con
el teléfono en modo oscuro, el fondo es oscuro y todos los textos principales se leen con buen contraste.

### Escenario: teléfono en modo oscuro
- **Dado** «Automática» elegida y el teléfono en modo oscuro
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es oscuro
- **Y** los importes de Inicio tienen un contraste de al menos 4,5 a 1 con su fondo

## Requisito: tarjetas de color sobre el fondo

Las tarjetas llevan color según su contenido: el disponible de cada cuenta y los grupos de Cuentas, el de su tipo
(bancos salvia, inversiones verde oliva, tarjetas cherry, financiaciones fucsia, deudas compartidas rosa); «Por
semana» rosa claro, «Ingresos y gastos» salvia, la conciliación verde oliva y el checklist rosa. «Gasto del mes»
tiene un fondo que deja leer la torta. Cada categoría tiene su color, el mismo en la torta, en la lista y en su
tarjeta de movimiento; sobre los colores oscuros el texto es blanco y sobre los claros, oscuro. Los importes
principales son grandes, con los decimales en gris.

### Escenario: tarjetas de color sobre el fondo oscuro
- **Dado** la apariencia Oscura y una tarjeta de crédito con tope
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es oscuro, «Gasto del mes» deja leer su torta y la tarjeta del disponible de la tarjeta es cherry
- **Y** el resultado del mes se ve grande con los decimales en gris

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y su tarjeta tienen el mismo color

### Escenario: texto legible sobre colores oscuros
- **Dado** un gasto en Compras este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el texto de su tarjeta cherry es blanco y se lee con contraste de al menos 4,5 a 1

### Escenario: reembolsos en frambuesa
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su tarjeta es frambuesa con texto blanco

## Requisito: elegir la paleta de colores

En Ajustes, «Paleta de colores» ofrece cuatro paletas, cada una con su nombre y una muestra de sus
colores: Viva, Editorial, Lima y lavanda y Pastel crema. Al elegir una, toda la app cambia de colores
(las tarjetas, los acentos y las manchas del fondo) al instante, y la elección se recuerda al volver a abrir. Sin elección, la paleta es Viva.

### Escenario: cambiar a pastel crema
- **Dado** la app en la paleta Viva
- **Cuando** la persona elige «Pastel crema» en Ajustes
- **Entonces** las manchas del fondo y los acentos pasan a los colores de Pastel crema y la opción queda marcada

### Escenario: la paleta se recuerda
- **Dado** la paleta Editorial elegida
- **Cuando** la persona vuelve a abrir la app
- **Entonces** la app se ve con la paleta Editorial

### Escenario: paleta por defecto
- **Dado** una app recién abierta, sin datos
- **Cuando** la persona abre Ajustes
- **Entonces** la paleta marcada es Viva

## Requisito: todas las paletas se leen

En cada paleta, en la apariencia clara y en la oscura, con el fondo de manchas detrás, los importes principales y el texto de las tarjetas
de color se leen con un contraste de al menos 4,5 a 1, las dos partes de la barra de fijos y
variables se distinguen de su tarjeta (al menos 1,5 a 1: el dato está en el texto que la acompaña), y cada categoría conserva el mismo color en la
torta y en su tarjeta de movimiento.

### Escenario: contraste en las cuatro paletas
- **Dado** gastos fijos y variables, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre las cuatro paletas en las apariencias Clara y Oscura
- **Entonces** en todas el resultado, el disponible, el patrimonio y el texto de las tarjetas de movimiento tienen contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables, de al menos 1,5 a 1 contra su tarjeta

### Escenario: mismo color por categoría en otra paleta
- **Dado** un gasto en Supermercado y la paleta Lima y lavanda elegida
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y su tarjeta tienen el mismo color

## Retirado: fondo blanco con acentos
Lo sustituye «tarjetas de color sobre el fondo»: el fondo ya no es gris claro, sino el de manchas.
