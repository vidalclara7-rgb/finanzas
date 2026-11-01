# Capacidad: datos

## Requisito: movimientos guardados antes de las fraccionadas

Los movimientos y las copias de seguridad de versiones anteriores siguen valiendo: no tienen la marca de compra fraccionada y se
ven y se suman igual que antes. Una marca que no sea válida se ignora.

### Escenario: movimientos anteriores intactos
- **Dado** movimientos guardados antes de este cambio, sin la marca de fraccionada
- **Cuando** la persona abre la app actualizada
- **Entonces** los ve y los suma igual que antes

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad hecha antes de este cambio
- **Cuando** la persona la restaura
- **Entonces** la app funciona con normalidad y los movimientos no tienen marca

### Escenario: marca inválida
- **Dado** un movimiento guardado con una marca de fraccionada que no es un texto
- **Cuando** la persona abre la app
- **Entonces** el movimiento se ve normal y la app no da error

### Escenario: inicio de cuotas inválido
- **Dado** una compra en cuotas guardada con un mes de inicio de cuotas que no es válido
- **Cuando** la persona abre la app
- **Entonces** las cuotas cuentan desde el mes de la compra y la app no da error
