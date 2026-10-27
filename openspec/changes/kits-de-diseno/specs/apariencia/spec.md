# Capacidad: apariencia

## Requisito: fondo de manchas

Detrás de todas las pantallas hay un fondo de manchas de color que se funden con un degradado suave, con estrellas
pequeñas que titilan. Sus colores son los del kit elegido: en la apariencia oscura se ven sobre el fondo oscuro del kit,
con estrellas claras; en la clara, sobre el fondo claro del kit, con tarjetas de vidrio esmerilado (blancas y
translúcidas) y estrellas del color del kit. Las tarjetas quedan encima y su texto se lee con contraste de al menos
4,5 a 1.

### Escenario: el fondo está en todas las pantallas
- **Dado** la app con datos de ejemplo
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre y Ajustes
- **Entonces** en todas se ve el fondo de manchas detrás de las tarjetas

### Escenario: los colores del fondo siguen al kit
- **Dado** el fondo de manchas visible en el kit Índigo
- **Cuando** la persona elige «Nieve»
- **Entonces** las manchas pasan a los colores de Nieve (aqua, naranja y granate) y dejan de ser los de Índigo

### Escenario: estrellas en las dos apariencias
- **Dado** la apariencia Oscura
- **Cuando** la persona abre la app
- **Entonces** se ven estrellas pequeñas sobre el fondo, que titilan
- **Y** al pasar a Clara se siguen viendo, del color del kit

### Escenario: el texto se lee sobre el fondo
- **Dado** una tarjeta de gasto y el resultado del mes en cada kit y en las dos apariencias
- **Cuando** la persona abre Inicio y Movimientos
- **Entonces** los importes y el texto de las tarjetas tienen contraste de al menos 4,5 a 1 con lo que tienen detrás
