# Capacidad: apariencia

## Requisito: fondo de manchas

Detrás de todas las pantallas hay un fondo de manchas de color que se funden con un degradado suave, con estrellas
pequeñas que titilan. En la apariencia oscura los colores son los de la paleta Brûlée (chocolate oscuro, púrpura,
naranja, tomate y granate, con texto crema); en la clara, los de la paleta Jardín (blanco hueso, rosa, verde, amarillo
y malva, con texto verde oscuro). En la clara las tarjetas son de vidrio esmerilado (blancas y translúcidas). Las
tarjetas quedan encima y su texto se lee con contraste de al menos 4,5 a 1.

### Escenario: el fondo está en todas las pantallas
- **Dado** la app con datos de ejemplo
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre y Ajustes
- **Entonces** en todas se ve el fondo de manchas detrás de las tarjetas

### Escenario: los colores de la oscura
- **Dado** la apariencia Oscura
- **Cuando** la persona mira el fondo
- **Entonces** el fondo de la pantalla es el chocolate oscuro #450E15 y las manchas son el púrpura #432E6F, el naranja #FFA102, el tomate #DD5533 y el granate #BC2D29

### Escenario: los colores de la clara
- **Dado** la apariencia Clara
- **Cuando** la persona mira el fondo
- **Entonces** el fondo de la pantalla es el blanco hueso #EDEBE2 y las manchas son el rosa #E9B8DE, el verde #136C51, el amarillo #EEDC5B y el malva #B97DA8

### Escenario: estrellas en las dos apariencias
- **Dado** la apariencia Oscura
- **Cuando** la persona abre la app
- **Entonces** se ven estrellas pequeñas sobre el fondo, que titilan
- **Y** al pasar a Clara se siguen viendo, del color de esa paleta

### Escenario: el texto se lee sobre el fondo
- **Dado** una tarjeta de gasto y el resultado del mes en las dos apariencias
- **Cuando** la persona abre Inicio y Movimientos
- **Entonces** los importes y el texto de las tarjetas tienen contraste de al menos 4,5 a 1 con lo que tienen detrás
