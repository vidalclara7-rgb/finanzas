# Capacidad: apariencia

## Requisito: colores del sistema

La app tiene una sola paleta, con versión clara y oscura. Clara: fondo #FFFFFF, tarjeta #F4F4F6, texto #0B0B0F, texto secundario #66666E. Oscura: fondo #000000, tarjeta #141416, texto #F5F5F7, texto secundario #9A9AA2. El acento es lima (#E8F94B). Lo que entra es verde: relleno #34C759 y, en los importes escritos, #17773F en la clara y #4ADE80 en la oscura. Lo que sale se escribe en el color del texto. El rosa queda para los avisos (un tope excedido, un mes en negativo): #C81E4A en la clara y #FF8AA6 en la oscura. Ya no hay degradado azul y violeta.

### Escenario: los colores de la clara
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es #FFFFFF y el texto principal es #0B0B0F

### Escenario: los colores de la oscura
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es #000000 y el texto principal es #F5F5F7

### Escenario: verde para lo que entra y texto para lo que sale
- **Dado** un gasto y un ingreso este mes
- **Cuando** la persona abre Movimientos en las dos apariencias
- **Entonces** el importe del ingreso es verde y el del gasto tiene el color del texto
- **Y** cada importe tiene contraste de al menos 4,5 a 1 con su fondo

### Escenario: rosa sólo para avisos
- **Dado** «Tarjeta» con tope de 300 € y 320 € gastados este mes, y un mes con gastos mayores que los ingresos
- **Cuando** la persona abre Inicio en las dos apariencias
- **Entonces** el anillo excedido y el título del resultado van en rosa, con contraste de al menos 4,5 a 1

### Escenario: texto secundario legible
- **Dado** Inicio, Movimientos y Cuentas con datos
- **Cuando** la persona los mira en las dos apariencias
- **Entonces** el texto secundario (fechas, detalles, etiquetas) tiene contraste de al menos 4,5 a 1 con su tarjeta

### Escenario: una paleta vieja guardada
- **Dado** datos guardados que elegían otra paleta cuando se podía elegir
- **Cuando** la persona abre la app
- **Entonces** la app se ve con la paleta del sistema, sin error

## Retirado: fondo liso y tarjetas blancas
Lo sustituye «fondo liso y tarjetas sin sombra»: fondo blanco o negro y tarjetas grises.

## Requisito: fondo liso y tarjetas sin sombra

Detrás de todas las pantallas hay un fondo liso, sin formas ni animación: blanco #FFFFFF en la apariencia Clara y negro #000000 en la Oscura. Las tarjetas quedan encima, sin sombra ni borde, con esquinas muy redondeadas (al menos 22 px): gris #F4F4F6 en la clara y #141416 en la oscura. Nada en el fondo ni en las tarjetas se mueve por sí solo, así que «Reducir movimiento» no cambia nada.

### Escenario: fondo de cada apariencia
- **Dado** la app abierta
- **Cuando** la persona cambia entre Clara y Oscura
- **Entonces** el fondo de la pantalla es #FFFFFF en la clara y #000000 en la oscura

### Escenario: tarjetas de cada apariencia
- **Dado** una tarjeta de Inicio
- **Cuando** la persona la mira en la clara y en la oscura
- **Entonces** su fondo es #F4F4F6 en la clara y #141416 en la oscura, sin sombra y con esquinas de al menos 22 px

### Escenario: nada se mueve solo
- **Dado** el teléfono sin «Reducir movimiento»
- **Cuando** la persona abre Inicio y espera dos segundos
- **Entonces** el fondo, las tarjetas y los botones no tienen ninguna animación en marcha

### Escenario: sin cargar nada de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio
