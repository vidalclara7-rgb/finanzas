# Capacidad: cuentas

## Requisito: cuotas de este mes en la tarjeta

La hoja de una tarjeta muestra «Cuotas de este mes»: lo que suman las cuotas de las compras
fraccionadas que caen en el mes en curso, y cuántas compras siguen en cuotas. Si no hay ninguna, no
aparece.

### Escenario: cuotas del mes
- **Dado** que hoy es 2026-10-15 y «Tarjeta Y» con una compra de 700 € en 3 cuotas de 240 € y otra de 300 € en 2 cuotas de 150 €
- **Cuando** la persona abre la hoja de Tarjeta Y
- **Entonces** ve «Cuotas de este mes: 390 € · 2 compras en cuotas»

### Escenario: sin compras en cuotas
- **Dado** «Tarjeta Y» sin compras fraccionadas
- **Cuando** la persona abre su hoja
- **Entonces** no ve «Cuotas de este mes»
