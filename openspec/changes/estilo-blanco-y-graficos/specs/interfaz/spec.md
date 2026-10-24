# Capacidad: interfaz

## Requisito: una sola letra en toda la app

Los títulos de las pantallas y de las hojas usan la misma letra que el resto del texto, en negrita.

### Escenario: títulos con la letra del texto
- **Dado** la app abierta en Inicio
- **Cuando** la persona mira el título «Este mes» y abre la hoja de nuevo gasto
- **Entonces** el título y el de la hoja usan la misma letra que el resto del texto

## Requisito: fondo blanco con acentos

En modo claro el fondo es blanco, la tarjeta principal de Inicio es negra y los acentos son verde
lima y lavanda.

### Escenario: fondo blanco
- **Dado** el teléfono en modo claro
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es blanco y la tarjeta de Tarjeta es negra con texto claro

## Requisito: modo oscuro

La app sigue el modo claro u oscuro del teléfono. En oscuro el fondo es oscuro y todos los textos
principales se leen con buen contraste.

### Escenario: teléfono en modo oscuro
- **Dado** el teléfono en modo oscuro
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es oscuro
- **Y** los importes de Inicio tienen un contraste de al menos 4,5 a 1 con su fondo
