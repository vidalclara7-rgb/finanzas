# Capacidad: apariencia

## Requisito: colores de las dos paletas

La apariencia oscura usa la paleta Jardín sobre un fondo casi negro: verde azulado oscuro, verde, rosa, amarillo,
malva y blanco hueso para las tarjetas y el texto. La clara usa la paleta Brûlée sobre un fondo blanco: crema, naranja,
púrpura, granate, chocolate y tomate para las tarjetas, el texto y los acentos. El fondo es liso, sin manchas ni
degradados.

### Escenario: los colores de la oscura
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es casi negro (#070B0C) y es liso, sin manchas, estrellas ni degradados

### Escenario: los colores de la clara
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es blanco (#FFFFFF) y es liso, sin manchas, estrellas ni degradados

### Escenario: el texto se lee sobre el fondo
- **Dado** el resultado del mes y los totales de Inicio en las dos apariencias
- **Cuando** la persona abre Inicio
- **Entonces** los importes tienen contraste de al menos 4,5 a 1 con lo que tienen detrás

## Retirado: fondo de manchas
Lo sustituye «colores de las dos paletas»: el fondo es liso.

## Retirado: movimiento del fondo
Ya no hay manchas ni estrellas que se muevan.
