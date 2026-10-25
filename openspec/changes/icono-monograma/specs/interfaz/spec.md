# Capacidad: interfaz

## Requisito: ícono de la app

El ícono de la pantalla de inicio es el monograma «mf.»: las letras en negro sobre rosa chicle y el
punto en rojo anaranjado, el mismo en todos los tamaños que usa la app.

### Escenario: ícono en la pantalla de inicio
- **Dado** la app publicada
- **Cuando** la persona la agrega a la pantalla de inicio
- **Entonces** el ícono tiene fondo rosa chicle, las letras «mf» en negro y el punto en rojo anaranjado

### Escenario: mismo ícono en todos los tamaños
- **Dado** los íconos de 180, 192 y 512 px
- **Cuando** se comparan
- **Entonces** los tres tienen los mismos colores en los mismos lugares
