# Capacidad: datos

## Requisito: la paleta viaja con los datos

La paleta elegida se guarda con los datos y viaja en la copia de seguridad. Los datos y las copias de
antes de este cambio, que no tienen paleta, se ven con Viva.

### Escenario: datos sin paleta
- **Dado** datos guardados antes de poder elegir paleta
- **Cuando** la persona abre la app actualizada
- **Entonces** la app se ve con la paleta Viva y sus datos siguen iguales

### Escenario: copia con paleta
- **Dado** una copia de seguridad hecha con la paleta Pastel crema
- **Cuando** la persona la restaura
- **Entonces** la app pasa a la paleta Pastel crema
