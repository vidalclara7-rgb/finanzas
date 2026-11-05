# Capacidad: apariencia

## Requisito: elegir la apariencia

En Ajustes, «Apariencia» ofrece Oscura, Clara y Automática (sigue al teléfono). Sin elección, la apariencia es
Oscura, aunque el teléfono esté en modo claro. Al elegir otra, toda la app cambia al instante y la elección se
recuerda al volver a abrir.

### Escenario: oscura por defecto
- **Dado** una app recién abierta, sin datos, en un teléfono en modo claro
- **Cuando** la persona abre la app y luego Ajustes
- **Entonces** la app se ve oscura
- **Y** «Apariencia» tiene marcada «Oscura»

### Escenario: elegir clara
- **Dado** la app oscura
- **Cuando** la persona elige «Clara» en Ajustes
- **Entonces** el fondo de la pantalla pasa a claro y la opción queda marcada

### Escenario: automática sigue al teléfono
- **Dado** «Automática» elegida y el teléfono en modo claro
- **Cuando** la persona abre la app
- **Entonces** la app se ve clara
- **Y** al pasar el teléfono a modo oscuro, la app pasa a oscura

### Escenario: la apariencia se recuerda
- **Dado** «Clara» elegida
- **Cuando** la persona vuelve a abrir la app
- **Entonces** la app se ve clara

## Requisito: movimiento del fondo

La forma se mueve despacio. No se mueve si el teléfono tiene activado «Reducir movimiento» y se detiene cuando la app no está visible.

### Escenario: se mueve despacio
- **Dado** el teléfono sin «Reducir movimiento»
- **Cuando** la persona abre la app
- **Entonces** la forma está en movimiento lento

### Escenario: reducir movimiento
- **Dado** el teléfono con «Reducir movimiento» activado
- **Cuando** la persona abre la app
- **Entonces** la forma se ve quieta

### Escenario: la app no está visible
- **Dado** la forma en movimiento
- **Cuando** la app pasa a segundo plano
- **Entonces** el movimiento se pausa

### Escenario: sin cargar nada de otros sitios
- **Dado** el fondo visible
- **Cuando** la persona abre la app
- **Entonces** el fondo no hace ninguna petición a otro sitio

## Requisito: la barra del sistema acompaña

En la app instalada, el color de la barra superior del sistema acompaña a la apariencia que se está viendo.

### Escenario: barra oscura y clara
- **Dado** la apariencia Oscura
- **Cuando** la persona cambia a Clara
- **Entonces** el color de la barra del sistema pasa de oscuro a claro

## Requisito: fondo fluido

Detrás de todas las pantallas hay una sola forma fluida: tres lóbulos que se mueven y se funden en una masa, de color plata con un tinte violeta y el brillo de la tendencia del mes, sobre el color de fondo de la apariencia (#F3F3F8 en la clara, #0B0B10 en la oscura). Las tarjetas quedan encima y su texto se lee con contraste de al menos 4,5 a 1. No hay manchas separadas ni estrellas.

### Escenario: el fondo está en todas las pantallas
- **Dado** la app con datos de ejemplo
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre y Ajustes
- **Entonces** en todas se ve la forma fluida detrás de las tarjetas

### Escenario: una sola forma de tres lóbulos
- **Dado** el fondo visible
- **Cuando** la persona lo mira en la apariencia Clara y en la Oscura
- **Entonces** hay una sola forma hecha de tres lóbulos
- **Y** no quedan las cinco manchas de antes

### Escenario: color de fondo de cada apariencia
- **Dado** la app abierta
- **Cuando** la persona cambia entre Clara y Oscura
- **Entonces** el fondo de la pantalla es #F3F3F8 en la clara y #0B0B10 en la oscura

### Escenario: el texto se lee sobre el fondo
- **Dado** el resultado del mes y los totales de Inicio en las dos apariencias
- **Cuando** la persona abre Inicio y Movimientos
- **Entonces** los importes y el texto suelto tienen contraste de al menos 4,5 a 1 con lo que tienen detrás, aun con la forma justo debajo

## Requisito: colores del sistema

La app tiene una sola paleta, con versión clara y oscura. Oscura: fondo #0B0B10, texto #F4F4F6, acento lima #B2FF00, etiquetas en lavanda #C4A5F7. Clara: fondo #F3F3F8, texto #13131A, acento lima #B2FF00 con texto #13131A, etiquetas en violeta #5B2BD1. El resto (violeta, lavanda, cielo, positivo y negativo) sigue el sistema de diseño de la persona.

### Escenario: los colores de la oscura
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es #0B0B10 y el texto principal es #F4F4F6

### Escenario: los colores de la clara
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es #F3F3F8 y el texto principal es #13131A

### Escenario: positivo y negativo
- **Dado** un gasto y un ingreso este mes
- **Cuando** la persona abre Movimientos en las dos apariencias
- **Entonces** lo positivo usa el verde lima del sistema (#367300 en la clara, #B2FF00 en la oscura) y lo negativo el rojo (#C72543 en la clara, #F2546A en la oscura)

### Escenario: una paleta vieja guardada
- **Dado** datos guardados que elegían otra paleta cuando se podía elegir
- **Cuando** la persona abre la app
- **Entonces** la app se ve con la paleta del sistema, sin error
