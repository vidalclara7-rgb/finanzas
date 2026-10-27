---
cambio: destinos-al-importar
estado: diseno-aprobado
datos: amplia
---
# Mandar plata a otra cuenta al importar, sin que cuente como gasto

## Por qué

Al revisar un extracto, la plata que la persona mandó a una inversión, o la que dejó «a cuenta» (como una
garantía), llega como gasto en «Otros» porque la otra cuenta no existe en la app o el importador no la
reconoce. La lista sólo ofrece «Transferencia a <cuenta>» para las cuentas que ya están creadas, y no recuerda
a cuál cuenta mandó la persona cada descripción.

## Qué cambia

- En la revisión de un extracto, la lista de cada movimiento suma **«Nueva cuenta…»**: se crea la cuenta (tipo,
  nombre y saldo) sin perder la revisión, y ese movimiento queda como transferencia a ella.
- La app **recuerda el destino**: si la persona guardó una descripción como transferencia a una cuenta, la
  próxima vez que aparezca esa descripción se propone la misma transferencia.
- Queda explícito que la plata «a cuenta» (una garantía, un depósito) se maneja como una cuenta propia de tipo
  «Deudas compartidas» (me deben): no baja el resultado del mes y el patrimonio no cambia.

## A quién afecta

A quienes importan extractos. Lo guardado sigue valiendo: lo aprendido hasta ahora (categorías) no cambia.

## Pantallas

- Revisión del extracto: «Nueva cuenta…» en la lista de cada movimiento.
- Hoja «Nueva cuenta», abierta desde la revisión (vuelve a ella al guardar o cerrar).

## Fuera de alcance

- Reconocer solas las cuentas de inversión por el texto del extracto (se aprende de lo que la persona elige).
- «Nueva cuenta…» en el formulario de transferencia manual: se siguen creando en Cuentas.
- Un tipo de cuenta nuevo para garantías: se usa «Deudas compartidas».
