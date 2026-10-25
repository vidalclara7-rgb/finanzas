# Capacidad: datos

## Requisito: gastos fijos en datos anteriores

Los gastos guardados antes de este cambio no tienen la marca de fijo: cuentan como variables y entran
en las sugerencias. La marca de cada gasto y las sugerencias respondidas viajan en la copia de
seguridad.

### Escenario: datos sin marca de fijo
- **Dado** datos guardados antes de este cambio con gastos de 300 € este mes
- **Cuando** la persona abre la app actualizada
- **Entonces** Inicio muestra «Variables 300 € · 100 %» y los movimientos siguen iguales

### Escenario: copia anterior sin fijos
- **Dado** una copia de seguridad hecha antes de este cambio
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada» y sus gastos cuentan como variables

### Escenario: copia con fijos y una sugerencia rechazada
- **Dado** una copia con un gasto fijo «alquiler» y la sugerencia de «gimnasio» respondida con «No»
- **Cuando** la persona la restaura
- **Entonces** el gasto «alquiler» dice «Fijo» y no aparece la sugerencia de «gimnasio»
