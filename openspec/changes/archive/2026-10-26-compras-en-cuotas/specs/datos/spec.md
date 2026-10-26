# Capacidad: datos

## Requisito: gastos de tarjeta guardados antes de las cuotas

Los gastos guardados antes de poder fraccionar siguen valiendo sin cambios: no tienen cuotas y cuentan
entero en su mes, tanto al abrir la app como al restaurar una copia de seguridad vieja. Las cuotas
viajan en la copia.

### Escenario: datos de la versión anterior
- **Dado** datos con un gasto de 100 € en «Tarjeta Y» sin cuotas
- **Cuando** la persona abre la app actualizada
- **Entonces** el gasto cuenta 100 € en su mes y la deuda de Tarjeta Y es la de antes

### Escenario: la copia conserva las cuotas
- **Dado** una compra de 700 € en 3 cuotas de 240 €
- **Cuando** la persona copia los datos y los restaura
- **Entonces** la compra vuelve con «Cuota 1 de 3» y 240 € como gasto del mes
