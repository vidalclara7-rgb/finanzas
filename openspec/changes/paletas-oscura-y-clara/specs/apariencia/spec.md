# Capacidad: apariencia

## Requisito: colores de las dos paletas

La apariencia oscura usa la paleta Jardín: fondo verde azulado oscuro, con verde, rosa, amarillo, malva y blanco hueso
para las tarjetas y el texto. La clara usa la paleta Brûlée: fondo crema, con naranja, púrpura, granate, chocolate y
tomate para las tarjetas, el texto y los acentos. El fondo es liso, sin manchas ni degradados.

### Escenario: los colores de la oscura
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es el verde azulado oscuro #113C42 y es liso, sin manchas, estrellas ni degradados

### Escenario: los colores de la clara
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es el crema #F5E9CE y es liso, sin manchas, estrellas ni degradados

### Escenario: el texto se lee sobre el fondo
- **Dado** el resultado del mes y los totales de Inicio en las dos apariencias
- **Cuando** la persona abre Inicio
- **Entonces** los importes tienen contraste de al menos 4,5 a 1 con lo que tienen detrás

## Retirado: fondo de manchas
Lo sustituye «colores de las dos paletas»: el fondo es liso.

## Retirado: movimiento del fondo
Ya no hay manchas ni estrellas que se muevan.
