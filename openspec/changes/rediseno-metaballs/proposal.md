---
cambio: rediseno-metaballs
estado: diseno-aprobado
datos: amplia
---
# Rediseño oscuro con fondo de manchas («metaballs»)

## Por qué

La persona quiere cambiar el aspecto de la app por el de los «metaballs» de Paper Design: manchas de color que
se funden con un degradado suave sobre un fondo oscuro. Hoy la app es clara, con tarjetas de color sobre un gris
muy claro, y el modo oscuro sólo sigue al teléfono.

## Qué cambia

- **Apariencia:** nueva opción en Ajustes, «Apariencia»: **Clara** (por defecto), **Oscura** o
  **Automática** (sigue al teléfono). La oscura no es negra: su fondo es un tono muy oscuro del color de la paleta. Es independiente de la paleta de colores.
- **Fondo de manchas** detrás de toda la app, con los colores de la paleta elegida. Las tarjetas quedan encima, con
  contraste suficiente para leer.
- **Se mueve despacio**, y se detiene con «Reducir movimiento» del teléfono y cuando la app no está visible.
- Las **cuatro paletas** (Viva, Editorial, Lima y lavanda, Pastel crema) siguen existiendo: ahora también colorean
  las manchas.
- El efecto se dibuja con la propia app, sin librerías, sin gráficos 3D y sin cargar nada de otros sitios.

## A quién afecta

A todas las personas, en todas las pantallas: quien no haya elegido apariencia la ve clara, aunque su
teléfono esté en modo oscuro; puede cambiarla en Ajustes. Lo guardado sigue valiendo.

## Pantallas

Todas: Inicio, Movimientos, Cuentas, Cierre y Ajustes, y sus hojas. Ajustes suma «Apariencia».

## Fuera de alcance

- Un shader en gráficos 3D o la librería de Paper (se descartaron: dependencia nueva o peso y batería).
- Que la persona regule cantidad, tamaño o velocidad de las manchas.
- Cambiar el ícono, el nombre o la pantalla de arranque de la app instalada.
- Rediseñar la estructura de las pantallas: cambia el aspecto, no lo que hace cada una.

## Orden de construcción

Se escribe ahora, pero se construye **después** de `fecha-sin-desborde`, `cuotas-a-la-vista`, `destinos-al-importar`
y `categorias-propias`: toca todas las pantallas y rehacer sus previews dos veces no tiene sentido.
