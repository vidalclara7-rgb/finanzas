# Capacidad: proyeccion

## Requisito: proyección a 12 meses

La hoja Forecast muestra los próximos 12 meses, desde el mes que viene. Para cada mes dice el ingreso, lo comprometido (gastos
fijos y cuotas) y lo que queda libre (ingreso menos lo comprometido). Si lo comprometido pasa del ingreso, el mes se marca
aparte. Arriba resume lo que entra por mes, lo comprometido y lo libre el mes que viene, y lo libre dentro de 12 meses.

### Escenario: cuotas que se liberan
- **Dado** que hoy es 2026-10-15, ingresos de 2.000 € en julio, agosto y septiembre de 2026, un gasto fijo de 600 € en septiembre, «Financiera Z» con cuota de 50 € y 4 cuotas que faltan cargadas en octubre de 2026, y una compra de 720 € en 3 cuotas de 240 € del 2026-10-05 en «Tarjeta Y»
- **Cuando** la persona abre Forecast
- **Entonces** noviembre de 2026 muestra comprometido 890 € y libre 1.110 €
- **Y** enero de 2027 muestra comprometido 650 € y libre 1.350 €
- **Y** febrero de 2027 muestra comprometido 600 € y libre 1.400 €

### Escenario: son doce meses desde el que viene
- **Dado** que hoy es 2026-10-15
- **Cuando** la persona abre Forecast
- **Entonces** la lista empieza en noviembre de 2026 y termina en octubre de 2027, con 12 meses

### Escenario: un mes en que se gasta más de lo que entra
- **Dado** un ingreso de 1.000 € y un gasto fijo de 800 € y cuotas de 300 € el mes que viene
- **Cuando** la persona abre Forecast
- **Entonces** ese mes muestra libre −100 € y está marcado como mes en rojo

## Requisito: el ingreso constante

La proyección mantiene el mismo ingreso todos los meses: el promedio de los últimos meses cerrados, hasta tres, en que entró algo.
Los reembolsos no cuentan. Un mes sin ingresos no entra al promedio. La persona puede escribir otro monto en la hoja para probar
otro escenario; no se guarda y, al cerrar la hoja, vuelve al promedio.

### Escenario: promedio de tres meses
- **Dado** que hoy es 2026-10-15 y ingresos de 1.800 € en julio, 2.100 € en agosto y 2.400 € en septiembre de 2026
- **Cuando** la persona abre Forecast
- **Entonces** el ingreso por mes es 2.100 €

### Escenario: los reembolsos no cuentan
- **Dado** ingresos de 2.000 € de Sueldo y de 300 € de Reembolso en septiembre de 2026
- **Cuando** la persona abre Forecast
- **Entonces** el ingreso por mes es 2.000 €

### Escenario: un mes sin ingresos no baja el promedio
- **Dado** ingresos de 2.000 € en agosto y septiembre de 2026 y ninguno en julio
- **Cuando** la persona abre Forecast
- **Entonces** el ingreso por mes es 2.000 €

### Escenario: probar otro ingreso
- **Dado** el ingreso por mes de 2.000 € y un comprometido de 890 € el mes que viene
- **Cuando** la persona escribe 1.500 € en el campo del ingreso
- **Entonces** el mes que viene muestra libre 610 €
- **Y** al cerrar y abrir otra vez Forecast el ingreso vuelve a 2.000 €

### Escenario: monto inválido
- **Dado** la hoja Forecast abierta
- **Cuando** la persona escribe «abc» en el campo del ingreso
- **Entonces** la app avisa «Poné un importe válido» y deja el ingreso como estaba

### Escenario: sin ingresos todavía
- **Dado** que la persona no tiene ningún ingreso en los meses anteriores
- **Cuando** abre Forecast
- **Entonces** ve «Todavía no hay ingresos para promediar. Escribí uno para ver la proyección.» y el ingreso por mes es 0 €

## Requisito: gastos fijos y cuotas en la proyección

Entran los gastos marcados como fijos del último mes cerrado, al mismo valor todos los meses, y las cuotas de las financiaciones y
de las compras en cuotas de tarjeta, mes por mes hasta que terminan. Una financiación sin fin cuenta todos los meses. No entran
los gastos variables, ni los gastos de «Trabajo (reembolsable)», ni las compras en cuotas como gasto fijo (ya están en las cuotas).

### Escenario: financiación sin fin
- **Dado** «Financiera Z» con cuota de 50 € y sin cuotas que faltan
- **Cuando** la persona abre Forecast
- **Entonces** los 12 meses incluyen 50 € de cuotas

### Escenario: lo variable no entra
- **Dado** un gasto de Supermercado de 300 € en septiembre de 2026 que no es fijo
- **Cuando** la persona abre Forecast
- **Entonces** el comprometido del mes que viene no incluye esos 300 €

### Escenario: la compra en cuotas no se cuenta dos veces
- **Dado** una compra en cuotas marcada como gasto fijo, de 240 € la cuota, del mes anterior
- **Cuando** la persona abre Forecast
- **Entonces** esa compra suma 240 € por sus cuotas y no suma otra vez como gasto fijo

### Escenario: sin cuotas ni gastos fijos
- **Dado** ingresos pero ninguna cuota ni gasto fijo
- **Cuando** la persona abre Forecast
- **Entonces** ve «No hay cuotas ni gastos fijos para proyectar.»
- **Y** cada mes muestra libre igual al ingreso

## Requisito: gráfico de lo comprometido

Arriba de la lista, un gráfico de barras por mes compara lo comprometido con el ingreso. Se dibuja sin librerías.

### Escenario: barras por mes
- **Dado** una proyección con cuotas que bajan en enero de 2027
- **Cuando** la persona abre Forecast
- **Entonces** el gráfico tiene 12 columnas, una por mes
- **Y** la de enero de 2027 es más baja que la de noviembre de 2026
