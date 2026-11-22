---
cambio: a-pagar-tarjeta
estado: aprobada
datos: amplia
---
# Lo que hay que pagar de la tarjeta al cierre

## Por qué

La app muestra la deuda de cada tarjeta de crédito, pero no lo que va a venir en el resumen: la deuda incluye las cuotas que todavía no vencen y no tiene en cuenta en qué día cierra el banco el resumen de ese mes. La persona quiere saber cuánto va a tener que pagar al cierre del mes en curso.

## Qué cambia

- **Fecha de cierre de cada mes:** cada tarjeta de crédito guarda, mes por mes, la fecha de cierre que dice el banco. La persona la carga a principio de mes. Si un mes no la tiene, se toma el último día del mes.
- **Tarjeta «A pagar de la tarjeta» en Inicio:** para el mes que se ve, cuánto toca pagar de cada tarjeta de crédito y el total. Lo que toca pagar es la deuda de la tarjeta a la fecha de cierre menos las cuotas de las compras en cuotas que vencen en los meses siguientes. Antes del cierre dice «Hasta hoy» (puede subir hasta el cierre); después, «Cerró el …».
- **Hoja «A pagar de la tarjeta»:** al tocar la tarjeta, por cada tarjeta de crédito: el campo de la fecha de cierre del mes, la deuda al cierre, las cuotas que vienen después y lo que toca pagar.

## A quién afecta

A quien tiene una cuenta de Tarjetas de crédito. Lo guardado se amplía (`datos: amplia`): las tarjetas ganan sus fechas de cierre; lo anterior sigue valiendo y, sin fecha, cuenta el fin de mes.

## Pantallas

- Inicio: tarjeta nueva «A pagar de la tarjeta» (sólo si hay alguna tarjeta de crédito).
- Hoja nueva «A pagar de la tarjeta».

## Fuera de alcance

- La fecha de vencimiento del pago y avisos o recordatorios.
- Intereses, pago mínimo y pagos parciales: se muestra el total del resumen.
- Repetir la fecha de cierre sola cada mes: se carga mes a mes.
- Mostrarlo en Cuentas o en Cierre.
