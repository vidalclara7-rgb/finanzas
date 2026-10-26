# Capacidad: datos

## Requisito: apariencia guardada antes del rediseño

Quien usaba una versión anterior no pierde nada: sin una apariencia elegida, la app se ve Oscura. La apariencia viaja
en la copia de seguridad. Un valor que no es válido se trata como si no hubiera elegido. La paleta que se hubiera
elegido antes se ignora: la app tiene una sola paleta, y las copias que la traen siguen restaurándose sin error.

### Escenario: datos de la versión anterior
- **Dado** datos guardados antes de poder elegir la apariencia, en un teléfono en modo claro
- **Cuando** la persona abre la app actualizada
- **Entonces** sus datos están intactos y la app se ve oscura

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada», se ve oscura y funciona con normalidad

### Escenario: la apariencia viaja en la copia
- **Dado** la apariencia «Clara» elegida
- **Cuando** la persona copia los datos y los restaura
- **Entonces** la app se ve clara

### Escenario: apariencia inválida
- **Dado** una copia con una apariencia que no es ninguna de las tres
- **Cuando** la persona la restaura
- **Entonces** la app funciona con normalidad y se ve oscura

### Escenario: datos con una paleta elegida
- **Dado** datos o una copia hechos cuando se podía elegir paleta (por ejemplo Pastel crema)
- **Cuando** la persona abre la app o restaura la copia
- **Entonces** los datos están intactos, la app usa su paleta única y Ajustes no ofrece elegir paleta

## Retirado: la paleta viaja con los datos
Ya no hay paleta que elegir: lo sustituye «apariencia guardada antes del rediseño».
