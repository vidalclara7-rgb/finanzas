# Capacidad: movimientos

## Requisito: gasto por categoría

Inicio muestra lo gastado en el mes por categoría, de mayor a menor, en la lista de «Gasto del mes», incluidos los gastos
reembolsables; la hoja «Gasto por categoría» las muestra todas, con «Trabajo (reembolsable)» al final porque no suma en
«Gastado». Ingresos, transferencias y ajustes no aparecen.

### Escenario: categorías ordenadas
- **Dado** 64,30 € en Supermercado, 42 € en Trabajo (reembolsable), 18 € en Comida fuera y un ingreso de 1500 € este mes
- **Cuando** la persona abre «Gasto por categoría» desde Inicio
- **Entonces** ve Supermercado y Comida fuera, en ese orden, y al final Trabajo (reembolsable) con «No suma en Gastado»

### Escenario: sin gastos por categoría
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Inicio
- **Entonces** «Gasto del mes» dice «Todavía no anotaste gastos este mes. Tocá + para empezar.»
