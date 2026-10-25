# Capacidad: reembolsos

## Requisito: estado de un gasto reembolsable

Cada gasto de «Trabajo (reembolsable)» tiene un estado: Pendiente, Aprobado o Pagado. Nace Pendiente
y la persona lo cambia desde la hoja del gasto. El estado se ve en su tarjeta de Movimientos.

### Escenario: nuevo gasto reembolsable
- **Dado** «Banco A» con 1000 €
- **Cuando** la persona anota un gasto de 12,40 € en Trabajo (reembolsable) con la nota «parking»
- **Entonces** su tarjeta en Movimientos dice «Pendiente»

### Escenario: aprobar un reembolso
- **Dado** un gasto reembolsable pendiente
- **Cuando** la persona lo abre, elige Aprobado y guarda
- **Entonces** su tarjeta dice «Aprobado»

### Escenario: deja de ser reembolsable
- **Dado** un gasto reembolsable pendiente
- **Cuando** la persona le cambia la categoría a Comida fuera y guarda
- **Entonces** su tarjeta ya no muestra estado de reembolso

## Requisito: por cobrar en Inicio

Inicio muestra cuánto falta cobrar de los gastos reembolsables (los Pendientes y los Aprobados) y
cuántos hay en cada estado. Si no falta cobrar nada, no aparece.

### Escenario: gastos por cobrar
- **Dado** dos gastos reembolsables pendientes de 12,40 € y 15 €, y uno aprobado de 7 €
- **Cuando** la persona abre Inicio
- **Entonces** ve «Por cobrar 34,4 €» con «2 pendientes · 1 aprobado»

### Escenario: nada por cobrar
- **Dado** sólo gastos reembolsables pagados
- **Cuando** la persona abre Inicio
- **Entonces** no aparece la tarjeta «Por cobrar»

## Requisito: cobrar con un ingreso

Al anotar un ingreso de Reembolso, la hoja muestra los gastos reembolsables por cobrar para marcar
cuáles cubre. Al guardar, esos gastos quedan Pagados y vinculados al ingreso. Si la suma de lo
marcado no coincide con el ingreso, la app avisa la diferencia y guarda igual. Si después se borra el
ingreso, sus gastos vuelven a Aprobado.

### Escenario: transferencia que cubre dos gastos
- **Dado** gastos reembolsables pendientes de 12,40 € y 4,60 €
- **Cuando** la persona anota un ingreso de 17 € en Reembolso, marca los dos gastos y guarda
- **Entonces** los dos quedan «Pagado»
- **Y** Inicio ya no muestra «Por cobrar»

### Escenario: el importe no coincide
- **Dado** un gasto reembolsable pendiente de 12,40 €
- **Cuando** la persona anota un ingreso de 13 € en Reembolso y marca ese gasto
- **Entonces** la app avisa «El ingreso es 0,6 € más que los gastos marcados» y lo guarda

### Escenario: borrar el ingreso que pagó
- **Dado** un gasto reembolsable pagado con un ingreso de Reembolso
- **Cuando** la persona borra ese ingreso
- **Entonces** el gasto vuelve a «Aprobado»

## Requisito: filtrar reembolsos en Movimientos

Movimientos tiene un filtro de reembolsos con tres opciones, Pendiente, Aprobado y Pagado, cada una
con cuántos gastos tiene. Con un estado elegido, la lista muestra sólo esos gastos, de cualquier mes,
y debajo cuánto suman.

### Escenario: ver los pendientes
- **Dado** dos gastos reembolsables pendientes de 12,40 € y 15 €, uno de septiembre, y uno pagado
- **Cuando** la persona abre Movimientos y elige «Pendiente»
- **Entonces** el filtro dice «Pendiente 2» y la lista muestra esos dos gastos
- **Y** debajo dice «Suma 27,4 €»

### Escenario: quitar el filtro
- **Dado** el filtro «Pendiente» elegido
- **Cuando** la persona lo toca de nuevo
- **Entonces** vuelve la lista de movimientos del mes
