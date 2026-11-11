# Capacidad: apariencia

## Retirado: movimiento del fondo

Ya no hay fondo animado.

## Retirado: fondo fluido

Lo sustituye el fondo liso de cada apariencia.

## Requisito: fondo liso y tarjetas blancas

Detrás de todas las pantallas hay un fondo liso, sin formas ni animación: gris claro #F1F0F2 en la apariencia Clara y azul oscuro #151C2A en la Oscura. Las tarjetas quedan encima: blancas (#FFFFFF) en la clara y azul #1F3252 en la oscura. Nada en el fondo ni en las tarjetas se mueve por sí solo, así que «Reducir movimiento» no cambia nada.

### Escenario: fondo de cada apariencia
- **Dado** la app abierta
- **Cuando** la persona cambia entre Clara y Oscura
- **Entonces** el fondo de la pantalla es #F1F0F2 en la clara y #151C2A en la oscura

### Escenario: tarjetas de cada apariencia
- **Dado** una tarjeta de Inicio
- **Cuando** la persona la mira en la clara y en la oscura
- **Entonces** su fondo es #FFFFFF en la clara y #1F3252 en la oscura

### Escenario: nada se mueve solo
- **Dado** el teléfono sin «Reducir movimiento»
- **Cuando** la persona abre Inicio y espera dos segundos
- **Entonces** el fondo, las tarjetas y los botones no tienen ninguna animación en marcha

### Escenario: sin cargar nada de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio

## Requisito: colores del sistema

La app tiene una sola paleta, la del diseño de Figma, con versión clara y oscura. Clara: fondo #F1F0F2, tarjeta #FFFFFF, texto #151C2A. Oscura, derivada de los azules oscuros del diseño: fondo #151C2A, tarjeta #1F3252, texto #F1F0F2, texto secundario #A1B6DB. El degradado principal va del azul cielo (#91CDFB) al violeta (#9A89F3) y al rosa violáceo (#CF8BE8). Lo que entra es verde y lo que sale es rosa: en rellenos, puntos y curvas, el verde #41FF8B y el rosa #FF5984; en los importes escritos, una versión más oscura en la clara (que llegue a 4,5 a 1 sobre la tarjeta) y los mismos colores en la oscura.

### Escenario: los colores de la clara
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es #F1F0F2 y el texto principal es #151C2A

### Escenario: los colores de la oscura
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es #151C2A y el texto principal es #F1F0F2

### Escenario: verde para lo que entra y rosa para lo que sale
- **Dado** un gasto y un ingreso este mes
- **Cuando** la persona abre Movimientos en las dos apariencias
- **Entonces** el importe del ingreso es verde y el del gasto, rosa
- **Y** cada importe tiene contraste de al menos 4,5 a 1 con su tarjeta

### Escenario: texto secundario legible
- **Dado** Inicio, Movimientos y Cuentas con datos
- **Cuando** la persona los mira en las dos apariencias
- **Entonces** el texto secundario (fechas, detalles, etiquetas) tiene contraste de al menos 4,5 a 1 con su tarjeta

### Escenario: una paleta vieja guardada
- **Dado** datos guardados que elegían otra paleta cuando se podía elegir
- **Cuando** la persona abre la app
- **Entonces** la app se ve con la paleta del sistema, sin error
