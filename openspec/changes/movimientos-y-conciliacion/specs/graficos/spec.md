# Capacidad: graficos

## Requisito: anillo del tope

La tarjeta de disponible de cada cuenta con tope muestra un anillo con el porcentaje del tope mensual
ya usado, sin contar los gastos reembolsables, los ingresos, las transferencias ni los ajustes. Al
superar el tope, el anillo se completa y se marca como excedido.

### Escenario: tope usado en parte
- **Dado** «Tarjeta» con tope de 500 € y 64,30 € gastados con esa tarjeta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Tarjeta dice «13 %»

### Escenario: tope superado en el anillo
- **Dado** «Revolut» con tope de 300 € y 320 € gastados con esa cuenta este mes
- **Cuando** la persona abre Inicio
- **Entonces** el anillo de Revolut dice «107 %» y se marca como excedido

## Requisito: ingresos contra gastos por mes

Inicio muestra, para los últimos seis meses incluido el actual, una barra de ingresos y otra de
gastos por mes, y marca los meses que cerraron en negativo. Transferencias y ajustes no cuentan.

### Escenario: dos meses con datos
- **Dado** que hoy es 2026-10-15, en septiembre 1500 € de ingresos y 900 € de gastos, y en octubre 1700 € de ingresos y 82,30 € de gastos
- **Cuando** la persona abre Inicio
- **Entonces** el gráfico muestra seis meses, de mayo a octubre 2026
- **Y** septiembre y octubre tienen sus dos barras, y los demás meses están vacíos

### Escenario: mes que cerró en negativo
- **Dado** en septiembre 2026 ingresos de 800 € y gastos de 950 €
- **Cuando** la persona abre Inicio
- **Entonces** septiembre se marca en rojo en el gráfico

### Escenario: sin ingresos ni gastos
- **Dado** que no hay ingresos ni gastos en los últimos seis meses
- **Cuando** la persona abre Inicio
- **Entonces** no se dibuja el gráfico de ingresos contra gastos
