# Capacidad: movimientos

## Requisito: seleccionar gastos

En Movimientos, el botón «Seleccionar» activa un modo en el que cada gasto del mes tiene una casilla.
La persona marca los que quiera y ve cuántos marcó. Ingresos, transferencias y ajustes no se pueden
marcar. «Cancelar» sale del modo sin cambios. «Con documento» filtra los gastos que tienen documentos.

### Escenario: marcar gastos
- **Dado** tres gastos y un ingreso este mes
- **Cuando** la persona toca «Seleccionar» y marca dos gastos
- **Entonces** ve «2 seleccionados»
- **Y** el ingreso no tiene casilla

### Escenario: salir sin cambios
- **Dado** el modo seleccionar con dos gastos marcados
- **Cuando** la persona toca «Cancelar»
- **Entonces** desaparecen las casillas y no cambia ningún gasto

### Escenario: filtrar los gastos con documento
- **Dado** cuatro gastos este mes, dos con documento
- **Cuando** la persona toca el filtro «Con documento»
- **Entonces** ve sólo esos dos gastos

### Escenario: sin gastos con documento
- **Dado** que ningún gasto del mes tiene documento
- **Cuando** la persona toca el filtro «Con documento»
- **Entonces** ve «Ningún gasto de este mes tiene documento.»
