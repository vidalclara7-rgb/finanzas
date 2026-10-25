# Capacidad: interfaz

## Requisito: fondo blanco con acentos

En modo claro el fondo es gris muy claro y las tarjetas llevan color: el disponible de cada cuenta y
los grupos de Cuentas, el de su tipo (bancos salvia, inversiones verde oliva, tarjetas cherry,
financiaciones fucsia, deudas compartidas rosa); «Por semana» rosa claro, «Ingresos y gastos»
salvia, la conciliación verde oliva y el checklist rosa. «Gasto del mes» es blanca, para que se lean
los colores de la torta. La paleta es viva: rojo anaranjado, cherry, frambuesa, rosa chicle, fucsia,
verde oliva oscuro y salvia. Cada categoría tiene su color, el mismo en la torta, en la lista y en su
tarjeta de movimiento; sobre los colores oscuros el texto es blanco y sobre los claros, oscuro. Los
importes principales son grandes, con los decimales en gris.

### Escenario: fondo gris claro con tarjetas de color
- **Dado** el teléfono en modo claro y una tarjeta de crédito con tope
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es gris muy claro, la tarjeta «Gasto del mes» es blanca y la del disponible de la tarjeta es cherry
- **Y** el resultado del mes se ve grande con los decimales en gris

### Escenario: mismo color por categoría
- **Dado** un gasto en Súper este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Súper y su tarjeta tienen el mismo color

### Escenario: texto legible sobre colores oscuros
- **Dado** un gasto en Compras este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el texto de su tarjeta cherry es blanco y se lee con contraste de al menos 4,5 a 1

### Escenario: reembolsos en frambuesa
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su tarjeta es frambuesa con texto blanco
