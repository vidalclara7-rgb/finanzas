# Capacidad: interfaz

## Requisito: ícono de la app

El ícono de la pantalla de inicio es una pila de tres tarjetas de colores (salvia, rosa chicle y rojo
anaranjado, con «€» en la de adelante) sobre verde oliva, el mismo en todos los tamaños que usa la
app.

### Escenario: ícono en la pantalla de inicio
- **Dado** la app publicada
- **Cuando** la persona la agrega a la pantalla de inicio
- **Entonces** el ícono tiene fondo verde oliva y, adelante, una tarjeta rojo anaranjado con «€»

### Escenario: mismo ícono en todos los tamaños
- **Dado** los íconos de 180, 192 y 512 px
- **Cuando** se comparan
- **Entonces** los tres tienen los mismos colores en los mismos lugares
