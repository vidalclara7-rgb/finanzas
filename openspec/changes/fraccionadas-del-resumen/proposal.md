---
cambio: fraccionadas-del-resumen
estado: propuesta
datos: amplia
---
# Leer las compras fraccionadas del resumen y explicar la deuda de la tarjeta

## Por qué

El resumen de la tarjeta de Santander trae una tabla de «Operaciones fraccionadas» con cada compra, su cuota («3 de 5») y lo que
queda por pagar. La app no la lee: sólo anota la cuota del mes como un gasto cualquiera, y lo que falta por pagar no cuenta en la
deuda de la tarjeta. Por eso la deuda que muestra la app no coincide con la del resumen, y al conciliar aparece un ajuste que no
se entiende.

## Qué cambia

- **Se leen las fraccionadas del resumen.** La revisión del resumen muestra un bloque «Compras fraccionadas» con las que siguen en
  curso (cuota, lo pendiente). Al guardar, cada una marcada se anota en la tarjeta como **compra en cuotas por lo que queda**
  (importe pendiente, repartido en las cuotas que faltan, desde el mes siguiente al del resumen); si sólo queda una cuota, es un
  gasto normal. La cuota que ya se cobró en el resumen sigue entrando como gasto del mes, como hasta ahora.
- **No se duplican:** al importar el resumen del mes siguiente, la compra que ya anotaste se reconoce y no se vuelve a crear.
- **La conciliación con el resumen cuenta lo pendiente:** la deuda del resumen es lo que hay que pagar más lo que queda de las
  fraccionadas, y la app compara con eso.
- **La hoja de la tarjeta explica la cuenta:** «Cómo se calcula la deuda», con lo que se anotó al empezar, las compras, los pagos,
  los ajustes y lo que queda por pagar en cuotas.

## A quién afecta

A quien importe resúmenes de tarjeta de Santander con compras fraccionadas. Los movimientos guardados siguen valiendo: los nuevos
llevan una marca interna para no duplicar.

## Pantallas

- Revisión del resumen: bloque «Compras fraccionadas».
- Hoja de la tarjeta: «Cómo se calcula la deuda».
- Conciliar con el resumen: deuda del resumen con lo pendiente.

## Fuera de alcance

- Otros bancos u otros formatos de fraccionadas (sólo la tabla del resumen de tarjeta de Santander).
- Anotar con retraso las cuotas ya cobradas en meses anteriores a este resumen.
- Calcular intereses futuros: las cuotas pendientes se reparten en partes iguales.
- Distinguir la tarjeta por el número del contrato y por el de la tarjeta (el resumen y la exportación de movimientos traen
  números distintos: hoy se elige la cuenta cada vez que cambia).
