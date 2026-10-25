# Capacidad: interfaz

## Requisito: elegir la paleta de colores

En Ajustes, «Paleta de colores» ofrece cuatro paletas, cada una con su nombre y una muestra de sus
colores: Viva, Editorial, Lima y lavanda y Pastel crema. Al elegir una, toda la app cambia de colores
al instante, y la elección se recuerda al volver a abrir. Sin elección, la paleta es Viva.

### Escenario: cambiar a pastel crema
- **Dado** la app en la paleta Viva
- **Cuando** la persona elige «Pastel crema» en Ajustes
- **Entonces** el fondo de la pantalla pasa a crema y la opción queda marcada

### Escenario: la paleta se recuerda
- **Dado** la paleta Editorial elegida
- **Cuando** la persona vuelve a abrir la app
- **Entonces** la app se ve con la paleta Editorial

### Escenario: paleta por defecto
- **Dado** una app recién abierta, sin datos
- **Cuando** la persona abre Ajustes
- **Entonces** la paleta marcada es Viva

## Requisito: todas las paletas se leen

En cada paleta, en modo claro y en modo oscuro, los importes principales y el texto de las tarjetas
de color se leen con un contraste de al menos 4,5 a 1, la figura del gasto del mes se distingue del
fondo (al menos 1,5 a 1: es decorativa, el dato está en el texto que la acompaña), y cada categoría conserva el mismo color en la
torta y en su tarjeta de movimiento.

### Escenario: contraste en las cuatro paletas
- **Dado** gastos, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre las cuatro paletas en claro y en oscuro
- **Entonces** en todas el resultado, el disponible, el patrimonio y el texto de las tarjetas de movimiento tienen contraste de al menos 4,5 a 1, y la figura del mes, de al menos 1,5 a 1 contra el fondo

### Escenario: mismo color por categoría en otra paleta
- **Dado** un gasto en Súper y la paleta Lima y lavanda elegida
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Súper y su tarjeta tienen el mismo color
