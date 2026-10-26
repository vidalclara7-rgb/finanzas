---
cambio: rediseno-metaballs
estado: archivado
datos: amplia
archivado: 2026-10-26
---
# Rediseño oscuro con fondo de manchas («metaballs»)

## Por qué

La persona quiere cambiar el aspecto de la app por el de los «metaballs» de Paper Design: manchas de color que
se funden con un degradado suave sobre un fondo oscuro. Hoy la app es clara, con tarjetas de color sobre un gris
muy claro, y el modo oscuro sólo sigue al teléfono.

## Qué cambia

Replanteo (2026-10-26, Gate 3): con el fondo de manchas sobre las cuatro paletas, las tarjetas de color y las manchas
se mezclaban demasiado. Ahora la app usa **una sola paleta, con dos temas tomados de dos moodboards de la persona**.

- **Una sola paleta, dos temas:** la clara en oliva, vino, azul polvo y naranja quemado; la oscura en cereza, chartreuse, rosa y óxido. Se retiran Viva, Editorial, Lima y
  lavanda y Pastel crema, y «Paleta de colores» desaparece de Ajustes.
- **Apariencia:** nueva opción en Ajustes: **Oscura** (por defecto, aunque el teléfono esté en claro), **Clara**
  (crema rosado con tarjetas de vidrio) o **Automática** (sigue al teléfono).
- **Fondo de manchas con estrellas** detrás de toda la app, con los colores de cada tema, que se mueve despacio y se detiene con «Reducir
  movimiento» y cuando la app no está visible.
- **Tarjetas neutras y algo translúcidas**, sin colores vivos. El color queda para lo que lo necesita: la categoría
  (torta, lista, icono y borde de su tarjeta de movimiento) y el tipo de cuenta (su icono).
- El efecto se dibuja con la propia app, sin librerías, sin gráficos 3D y sin cargar nada de otros sitios.

## A quién afecta

A todas las personas, en todas las pantallas: quien no haya elegido apariencia la ve oscura, aunque su teléfono esté
en modo claro; puede cambiarla en Ajustes. Quien había elegido una paleta deja de verla (se ignora, sin error). Lo
guardado sigue valiendo.

## Pantallas

Todas: Inicio, Movimientos, Cuentas, Cierre y Ajustes, y sus hojas. Ajustes suma «Apariencia».

## Fuera de alcance

- Un shader en gráficos 3D o la librería de Paper (se descartaron: dependencia nueva o peso y batería).
- Elegir entre varias paletas, o una paleta propia.
- Que la persona regule cantidad, tamaño o velocidad de las manchas.
- Cambiar el ícono, el nombre o la pantalla de arranque de la app instalada.
- Rediseñar la estructura de las pantallas: cambia el aspecto, no lo que hace cada una.

## Orden de construcción

Ya está construido el mecanismo (apariencia, fondo de manchas, movimiento); falta la paleta única. Se termina
**antes** de `cuotas-a-la-vista`, `destinos-al-importar` y `categorias-propias`, que ya se verán con este diseño.
