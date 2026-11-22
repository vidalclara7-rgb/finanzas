---
cambio: forecast-tarjeta-prestamos
estado: aprobada
datos: amplia
---
# Forecast con ingreso guardado, el resumen de la tarjeta y préstamos

## Por qué

- El ingreso del Forecast vuelve al promedio cada vez que se abre la hoja: lo que la persona escribe no se guarda.
- El Forecast sólo cuenta gastos fijos y cuotas. El resumen de la tarjeta que cierra este mes y se paga a principio del siguiente no aparece, y es plata que ya está comprometida.
- No hay forma de anotar un préstamo que se va a recibir (por ejemplo, para mudarse) con su devolución, ni de verlo en la proyección.

## Qué cambia

- **Ingreso guardado:** el ingreso que la persona escribe en el Forecast queda guardado y se usa todos los meses hasta que lo cambie. «Usar el promedio» vuelve al cálculo automático.
- **Fecha de pago de la tarjeta:** en la hoja «A pagar de la tarjeta», además de la fecha de cierre, cada tarjeta tiene la fecha de pago del resumen de ese mes. Inicio la muestra en la fila de la tarjeta.
- **La tarjeta en el Forecast:** el resumen del mes en curso entra como gasto en el mes en que se paga (sin fecha de pago, el mes siguiente al cierre), sin los gastos fijos que ya tiene adentro, que siguen contando como fijos.
- **Préstamos:** al crear una cuenta de Financiaciones se puede marcar «Es un préstamo que voy a recibir», con el importe, el día que llega y la cuenta donde llega. La app anota la entrada de la plata ese día. Toda financiación puede tener el mes de su primera cuota. El Forecast muestra la plata que entra el mes que llega y las cuotas desde la primera.
- **Lo que todavía no pasó:** los saldos de hoy (Cuentas, patrimonio, disponible) no cuentan movimientos con fecha posterior a hoy. Así un préstamo que llega el mes que viene no aparece hoy como plata ni como deuda.

## A quién afecta

A todas las personas que usan el Forecast, tienen tarjetas de crédito o cargan financiaciones. Lo guardado se amplía (`datos: amplia`): el ingreso del Forecast y las fechas de pago de las tarjetas. Lo anterior sigue valiendo. Quien tenga movimientos con fecha futura va a ver que dejan de sumar en los saldos de hoy hasta que llegue su día.

## Pantallas

- Forecast: ingreso guardado con «Usar el promedio»; cada mes con su tarjeta y su préstamo.
- A pagar de la tarjeta: campo «Fecha de pago».
- Inicio: la fila de cada tarjeta dice cuándo se paga.
- Hoja de cuenta (Financiaciones): «Primera cuota» y la sección del préstamo.

## Fuera de alcance

- Estimar los resúmenes de la tarjeta de los meses que vienen: sólo entra el del mes en curso, que es el que se conoce.
- Intereses del préstamo: la devolución es la cuota por la cantidad de cuotas que carga la persona.
- Ingresos distintos por mes en el Forecast.
- Mostrar en el Forecast el resto del mes en curso.
