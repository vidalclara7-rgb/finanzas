# Capacidad: interfaz

## Requisito: las categorías nuevas tienen color propio

Cada categoría de gasto nueva tiene un color fijo, distinto del de las demás, que es el mismo en la
torta, en la lista de categorías y en las tarjetas de movimiento. En cualquier paleta, claro u oscuro,
los importes y el texto de sus tarjetas se leen con contraste de al menos 4,5 a 1.

### Escenario: color en la torta y en la tarjeta
- **Dado** un gasto de 30 € en Alquiler este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** el color de «Alquiler» es el mismo en la torta, la lista y la tarjeta
- **Y** no coincide con el de otra categoría

### Escenario: contraste en las cuatro paletas
- **Dado** un gasto en cada categoría nueva
- **Cuando** la persona recorre las cuatro paletas en claro y en oscuro
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1
