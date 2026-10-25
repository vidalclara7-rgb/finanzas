# Capacidad: datos

## Requisito: datos anteriores a la importación

Lo guardado antes de este cambio, y las copias de seguridad anteriores, siguen igual: las cuentas no
tienen extractos asociados y no hay categorías aprendidas ni adjuntos.

### Escenario: datos sin importaciones
- **Dado** datos guardados con cuentas y movimientos, sin ninguna importación
- **Cuando** la persona abre la app actualizada
- **Entonces** ve sus cuentas y movimientos como antes
- **Y** al importar el primer extracto de una cuenta, la app le pide elegir a cuál corresponde

## Requisito: Súper pasa a llamarse Supermercado

La categoría de gasto «Súper» se llama ahora «Supermercado». Los gastos guardados con «Súper», las
categorías aprendidas al importar y los gastos fijos de esa categoría pasan a «Supermercado» al abrir
la app y al restaurar una copia, sin perder nada.

### Escenario: datos con Súper
- **Dado** datos guardados con dos gastos en Súper y un gasto fijo «verdulería» en Súper
- **Cuando** la persona abre la app actualizada
- **Entonces** los dos gastos están en Supermercado y un gasto nuevo en Supermercado con la nota «verdulería» viene marcado como fijo

### Escenario: copia vieja con Súper
- **Dado** una copia de seguridad con un gasto en Súper
- **Cuando** la persona la restaura
- **Entonces** el gasto aparece en Supermercado

