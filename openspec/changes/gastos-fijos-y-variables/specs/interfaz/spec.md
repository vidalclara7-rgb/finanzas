# Capacidad: interfaz

## Requisito: todas las paletas se leen

En cada paleta, en modo claro y en modo oscuro, los importes principales y el texto de las tarjetas
de color se leen con un contraste de al menos 4,5 a 1, las dos partes de la barra de fijos y
variables se distinguen de su tarjeta (al menos 1,5 a 1: el dato está en el texto que la acompaña), y cada categoría conserva el mismo color en la
torta y en su tarjeta de movimiento.

### Escenario: contraste en las cuatro paletas
- **Dado** gastos fijos y variables, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre las cuatro paletas en claro y en oscuro
- **Entonces** en todas el resultado, el disponible, el patrimonio y el texto de las tarjetas de movimiento tienen contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables, de al menos 1,5 a 1 contra su tarjeta

### Escenario: mismo color por categoría en otra paleta
- **Dado** un gasto en Súper y la paleta Lima y lavanda elegida
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Súper y su tarjeta tienen el mismo color
