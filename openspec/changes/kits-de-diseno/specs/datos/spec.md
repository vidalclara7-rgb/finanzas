# Capacidad: datos

## Requisito: kit guardado antes de los kits de diseño

Quien usaba una versión anterior no pierde nada: sin un kit elegido, la app se ve con el kit Índigo, en la apariencia
que ya tenía. El kit viaja en la copia de seguridad. Un valor que no es ninguno de los cuatro kits se trata como si no
hubiera elegido.

### Escenario: datos de la versión anterior
- **Dado** datos guardados antes de poder elegir el kit, con la apariencia Clara
- **Cuando** la persona abre la app actualizada
- **Entonces** sus datos están intactos, la app se ve con el kit Índigo y sigue en la apariencia Clara

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada», se ve con el kit Índigo y funciona con normalidad

### Escenario: el kit viaja en la copia
- **Dado** el kit «Nieve» elegido
- **Cuando** la persona copia los datos y los restaura
- **Entonces** la app se ve con el kit Nieve

### Escenario: kit inválido
- **Dado** una copia con un kit que no es ninguno de los cuatro
- **Cuando** la persona la restaura
- **Entonces** la app funciona con normalidad y se ve con el kit Índigo
