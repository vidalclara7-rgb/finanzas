# Capacidad: datos

## Requisito: reembolsables guardados antes de los estados

Los gastos de «Trabajo (reembolsable)» guardados antes de este cambio, o que vienen en una copia de
seguridad anterior, quedan como Pendientes. Nada más cambia.

### Escenario: reembolsables anteriores
- **Dado** datos guardados con dos gastos de Trabajo (reembolsable) sin estado
- **Cuando** la persona abre la app actualizada
- **Entonces** los dos aparecen como «Pendiente» y suman en «Por cobrar»

### Escenario: copia anterior con reembolsables
- **Dado** una copia de seguridad con un gasto de Trabajo (reembolsable) sin estado
- **Cuando** la persona la restaura
- **Entonces** el gasto aparece como «Pendiente»
