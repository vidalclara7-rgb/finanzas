# Capacidad: apariencia

## Requisito: colores de las dos paletas

La apariencia oscura usa la paleta Jardín sobre un fondo casi negro: verde azulado oscuro, verde, rosa, amarillo,
malva y blanco hueso para las tarjetas y el texto. La clara usa la paleta Brûlée sobre un fondo blanco: crema, naranja,
púrpura, granate, chocolate y tomate para las tarjetas, el texto y los acentos. El fondo de cada una es el de
«fondo de manchas».

### Escenario: los colores de la oscura
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es casi negro (#070B0C) y las manchas del fondo son de la paleta Jardín

### Escenario: los colores de la clara
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es blanco (#FFFFFF) y las manchas del fondo son de la paleta Brûlée

### Escenario: el texto se lee sobre el fondo
- **Dado** el resultado del mes y los totales de Inicio en las dos apariencias
- **Cuando** la persona abre Inicio
- **Entonces** los importes tienen contraste de al menos 4,5 a 1 con lo que tienen detrás

## Requisito: fondo de manchas

Detrás de todas las pantallas hay un fondo dinámico: cinco manchas de color de la paleta de la apariencia, muy
difuminadas, sobre el color de fondo (casi negro en la oscura, blanco en la clara), con un velo suave para que el texto
se lea. Ya no hay estrellas. Las tarjetas de color son sólidas y quedan encima; su texto se lee con contraste de al
menos 4,5 a 1.

### Escenario: el fondo está en todas las pantallas
- **Dado** la app con datos de ejemplo
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre y Ajustes
- **Entonces** en todas se ve el fondo de manchas detrás de las tarjetas

### Escenario: manchas de la paleta, sin estrellas
- **Dado** el fondo de manchas visible
- **Cuando** la persona lo mira en la apariencia Clara y en la Oscura
- **Entonces** las manchas son de los colores de Brûlée (naranja, tomate, púrpura, granate y crema) en la clara y de los de Jardín (verde, rosa, amarillo, malva y verde azulado) en la oscura
- **Y** no hay estrellas en ninguna

### Escenario: el texto se lee sobre el fondo
- **Dado** el resultado del mes y los totales de Inicio en las dos apariencias
- **Cuando** la persona abre Inicio y Movimientos
- **Entonces** los importes y el texto suelto tienen contraste de al menos 4,5 a 1 con lo que tienen detrás, aun con dos manchas superpuestas

## Requisito: movimiento del fondo

Las manchas se mueven despacio. No se mueven si el teléfono tiene activado «Reducir movimiento», y se detienen cuando
la app no está visible.

### Escenario: se mueve despacio
- **Dado** el teléfono sin «Reducir movimiento»
- **Cuando** la persona abre la app
- **Entonces** las manchas están en movimiento lento

### Escenario: reducir movimiento
- **Dado** el teléfono con «Reducir movimiento» activado
- **Cuando** la persona abre la app
- **Entonces** las manchas se ven quietas

### Escenario: la app no está visible
- **Dado** las manchas en movimiento
- **Cuando** la app pasa a segundo plano
- **Entonces** el movimiento se pausa

### Escenario: sin cargar nada de otros sitios
- **Dado** el fondo de manchas visible
- **Cuando** la persona abre la app
- **Entonces** el fondo no hace ninguna petición a otro sitio
