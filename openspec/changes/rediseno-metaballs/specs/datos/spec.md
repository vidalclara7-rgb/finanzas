# Capacidad: datos

## Requisito: apariencia guardada antes del rediseño

Quien usaba una versión anterior no pierde nada: sin una apariencia elegida, la app se ve Clara. La apariencia
viaja en la copia de seguridad. Un valor que no es válido se trata como si no hubiera elegido.

### Escenario: datos de la versión anterior
- **Dado** datos guardados antes de poder elegir la apariencia, en un teléfono en modo claro
- **Cuando** la persona abre la app actualizada
- **Entonces** sus datos están intactos y la app se ve clara

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada», se ve clara y funciona con normalidad

### Escenario: la apariencia viaja en la copia
- **Dado** la apariencia «Oscura» elegida
- **Cuando** la persona copia los datos y los restaura
- **Entonces** la app se ve oscura

### Escenario: apariencia inválida
- **Dado** una copia con una apariencia que no es ninguna de las tres
- **Cuando** la persona la restaura
- **Entonces** la app funciona con normalidad y se ve clara
