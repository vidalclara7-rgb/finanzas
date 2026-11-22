# Capacidad: proyeccion

## Requisito: proyección a 12 meses

La hoja Forecast muestra los próximos 12 meses, desde el mes que viene. Para cada mes dice el ingreso, lo comprometido (gastos
fijos, cuotas y el resumen de la tarjeta que se paga ese mes), la plata de un préstamo que llega ese mes y lo que queda libre (ingreso más el préstamo, menos lo comprometido). Si lo comprometido pasa del ingreso, el mes se marca
aparte. Arriba resume lo que entra por mes, lo comprometido y lo libre el mes que viene, y lo libre dentro de 12 meses.

### Escenario: cuotas que se liberan
- **Dado** que hoy es 2026-10-15, ingresos de 2000 € en julio, agosto y septiembre de 2026, un gasto fijo de 600 € en septiembre, «Financiera Z» con cuota de 50 € y 4 cuotas que faltan cargadas en octubre de 2026, y una compra de 720 € en 3 cuotas de 240 € del 2026-10-05 en «Tarjeta Y»
- **Cuando** la persona abre Forecast
- **Entonces** noviembre de 2026 muestra comprometido 890 € y libre 1110 €
- **Y** enero de 2027 muestra comprometido 650 € y libre 1350 €
- **Y** febrero de 2027 muestra comprometido 600 € y libre 1400 €

### Escenario: son doce meses desde el que viene
- **Dado** que hoy es 2026-10-15
- **Cuando** la persona abre Forecast
- **Entonces** la lista empieza en noviembre de 2026 y termina en octubre de 2027, con 12 meses

### Escenario: un mes en que se gasta más de lo que entra
- **Dado** un ingreso de 1000 € y un gasto fijo de 800 € y cuotas de 300 € el mes que viene
- **Cuando** la persona abre Forecast
- **Entonces** ese mes muestra libre −100 € y está marcado como mes en rojo

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

## Requisito: el ingreso por mes

La proyección usa el mismo ingreso todos los meses. Si la persona escribió un ingreso en la hoja, ese queda guardado y se usa cada vez que abre Forecast, hasta que lo cambie. Si no, es el promedio de los últimos meses cerrados, hasta tres, en que entró algo; los reembolsos no cuentan y un mes sin ingresos no entra al promedio. Con un ingreso guardado, «Usar el promedio» lo borra y vuelve al promedio. Borrar el campo también vuelve al promedio.

### Escenario: promedio de tres meses
- **Dado** que hoy es 2026-10-15, ningún ingreso guardado e ingresos de 1800 € en julio, 2100 € en agosto y 2400 € en septiembre de 2026
- **Cuando** la persona abre Forecast
- **Entonces** el ingreso por mes es 2100 €

### Escenario: los reembolsos no cuentan
- **Dado** ningún ingreso guardado e ingresos de 2000 € de Sueldo y de 300 € de Reembolso en septiembre de 2026
- **Cuando** la persona abre Forecast
- **Entonces** el ingreso por mes es 2000 €

### Escenario: un mes sin ingresos no baja el promedio
- **Dado** ningún ingreso guardado e ingresos de 2000 € en agosto y septiembre de 2026 y ninguno en julio
- **Cuando** la persona abre Forecast
- **Entonces** el ingreso por mes es 2000 €

### Escenario: guardar el ingreso
- **Dado** el ingreso por mes de 740 € (promedio) y un comprometido de 300 € el mes que viene
- **Cuando** la persona escribe 1500 € en el campo del ingreso
- **Entonces** ve «Ingreso guardado» y el mes que viene muestra libre 1200 €
- **Y** al cerrar y abrir otra vez Forecast el ingreso sigue en 1500 € y dice «Ingreso guardado: se usa todos los meses.»

### Escenario: volver al promedio
- **Dado** un ingreso guardado de 1500 € y un promedio de 740 €
- **Cuando** la persona toca «Usar el promedio (740 €)»
- **Entonces** el ingreso por mes es 740 € y al volver a abrir Forecast sigue en 740 €

### Escenario: monto inválido
- **Dado** la hoja Forecast abierta con un ingreso guardado de 1500 €
- **Cuando** la persona escribe «abc» en el campo del ingreso
- **Entonces** la app avisa «Poné un importe válido» y el ingreso sigue en 1500 €

### Escenario: sin ingresos todavía
- **Dado** que la persona no tiene ningún ingreso en los meses anteriores ni un ingreso guardado
- **Cuando** abre Forecast
- **Entonces** ve «Todavía no hay ingresos para promediar. Escribí uno para ver la proyección.» y el ingreso por mes es 0 €

## Requisito: el resumen de la tarjeta en la proyección

El resumen de cada tarjeta de crédito del mes en curso entra como gasto comprometido en el mes en que se paga: el de su fecha de pago o, sin fecha de pago, el mes siguiente al cierre. Es lo que hay que pagar de esa tarjeta al cierre menos los gastos fijos de esa tarjeta del periodo del resumen, que ya cuentan como gastos fijos, y menos las cuotas de ese mes de sus compras en cuotas, que ya cuentan como cuotas; nunca es menos de 0 €. Los resúmenes de los meses que vienen no se estiman. Si el pago cae fuera de los 12 meses, no entra.

### Escenario: el resumen se paga el mes que viene
- **Dado** que hoy es 2026-11-22, «Tarjeta Y» con cierre de noviembre el 2026-11-20, pago el 2026-12-05 y 400 € de gastos variables antes del cierre
- **Cuando** la persona abre Forecast
- **Entonces** diciembre de 2026 dice «tarjeta 400 €» y suma 400 € al comprometido
- **Y** enero de 2027 no suma nada de tarjeta

### Escenario: sin fecha de pago
- **Dado** que hoy es 2026-11-22 y «Tarjeta Y» con 400 € a pagar de noviembre y sin fecha de pago
- **Cuando** la persona abre Forecast
- **Entonces** diciembre de 2026 suma 400 € de tarjeta

### Escenario: los fijos de la tarjeta no se cuentan dos veces
- **Dado** que hoy es 2026-11-22, «Tarjeta Y» con 400 € a pagar de noviembre, de los que 50 € son un gasto fijo del 2026-11-03 (y otro igual en octubre)
- **Cuando** la persona abre Forecast
- **Entonces** diciembre de 2026 dice «tarjeta 350 €» y los fijos siguen sumando 50 €

### Escenario: las cuotas de la tarjeta no se cuentan dos veces
- **Dado** que hoy es 2026-10-15 y «Tarjeta Y» con sólo una compra de 720 € en 3 cuotas de 240 € del 2026-10-05
- **Cuando** la persona abre Forecast
- **Entonces** noviembre de 2026 suma 240 € de cuotas y nada de tarjeta

### Escenario: tarjeta sin nada a pagar
- **Dado** «Tarjeta Y» sin gastos este mes
- **Cuando** la persona abre Forecast
- **Entonces** ningún mes suma tarjeta

## Requisito: préstamos en la proyección

Si llega un préstamo en uno de los 12 meses (una transferencia de una cuenta de Financiaciones a una cuenta que no es de Financiaciones con fecha en ese mes), su importe suma a lo libre de ese mes, y la fila dice «Entra un préstamo de <importe>». Sus cuotas entran como cualquier financiación, desde el mes de la primera cuota hasta la última.

### Escenario: préstamo con devolución
- **Dado** que hoy es 2026-11-22, ingreso guardado de 2000 €, sin fijos, y «Préstamo piso» de 6000 € que llega el 2027-01-10 a Banco A, con cuota de 300 € y 20 cuotas desde febrero de 2027
- **Cuando** la persona abre Forecast
- **Entonces** enero de 2027 dice «Entra un préstamo de 6.000 €» y libre 8.000 €
- **Y** febrero de 2027 suma 300 € de cuotas y libre 1.700 €
- **Y** diciembre de 2026 no suma cuotas de ese préstamo
