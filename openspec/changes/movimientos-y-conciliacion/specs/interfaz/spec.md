# Capacidad: interfaz

## Requisito: navegación

Una barra inferior lleva a Inicio, Movimientos, Cuentas y Cierre, con el botón «+» en el centro.
Ajustes se abre con el engranaje del encabezado. El «+» abre «Nuevo movimiento», salvo en Cuentas,
donde abre «Nueva cuenta». El título del encabezado cambia con la pantalla.

### Escenario: el más según la pantalla
- **Dado** la app abierta en Inicio con al menos una cuenta
- **Cuando** la persona toca «+», cierra, va a Cuentas y vuelve a tocar «+»
- **Entonces** primero se abre «Nuevo movimiento» y después «Nueva cuenta»

### Escenario: ajustes desde el engranaje
- **Dado** la app abierta en Inicio
- **Cuando** la persona toca el engranaje
- **Entonces** el título dice «Ajustes» y se ve el plan del fondo

### Escenario: nombres de las pestañas
- **Dado** la app abierta
- **Cuando** la persona mira la barra inferior
- **Entonces** ve «Inicio», «Movimientos», «Cuentas» y «Cierre»

## Requisito: fondo blanco con acentos

En modo claro el fondo es blanco y la app usa una paleta editorial: tarjetas de colores apagados
(salvia, arena, amarillo pálido, gris) y acentos fuertes en rojo y naranja. Cada categoría tiene su
color, el mismo en la torta, en la lista y en su tarjeta de movimiento. Los importes principales son
grandes, con los decimales en gris.

### Escenario: fondo blanco
- **Dado** el teléfono en modo claro
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es blanco
- **Y** el resultado del mes se ve grande con los decimales en gris

### Escenario: mismo color por categoría
- **Dado** un gasto en Súper este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Súper y su tarjeta tienen el mismo color
