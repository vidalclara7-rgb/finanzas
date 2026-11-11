# Capacidad: graficos

## Requisito: ingresos contra gastos por mes

Inicio muestra, para los últimos seis meses incluido el actual, dos curvas suaves, una verde de ingresos y otra rosa de gastos, con un punto por mes. Al tocar un mes, un globo dice sus ingresos y sus gastos. Los meses que cerraron en negativo se marcan. Transferencias y ajustes no cuentan.

### Escenario: dos meses con datos
- **Dado** que hoy es 2026-10-15, en septiembre 1500 € de ingresos y 900 € de gastos, y en octubre 1700 € de ingresos y 82,30 € de gastos
- **Cuando** la persona abre Inicio
- **Entonces** el gráfico muestra seis meses, de mayo a octubre 2026
- **Y** septiembre y octubre tienen su punto verde y su punto rosa, y los demás meses están en cero

### Escenario: globo con el mes tocado
- **Dado** el gráfico con datos de septiembre y octubre
- **Cuando** la persona toca octubre
- **Entonces** un globo dice «Ingresos 1700 €» y «Gastos 82,3 €»

### Escenario: mes que cerró en negativo
- **Dado** en septiembre 2026 ingresos de 800 € y gastos de 950 €
- **Cuando** la persona abre Inicio
- **Entonces** septiembre se marca en rosa en el gráfico

### Escenario: sin ingresos ni gastos
- **Dado** que no hay ingresos ni gastos en los últimos seis meses
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja el gráfico de ingresos contra gastos
