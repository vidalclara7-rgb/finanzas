# Capacidad: importacion

## Requisito: transferencia internacional a tu nombre

Una transferencia internacional a nombre de la persona sale a una cuenta que no está en la app (por
ejemplo, para pagar algo en otro país): llega como gasto en Regalos, no como transferencia entre sus
cuentas. Vale igual para el extracto en español («Transferencia internacional») y en inglés («International Transfer»). Si para ese mismo destinatario la persona eligió antes otra categoría, llega con esa.

### Escenario: transferencia internacional
- **Dado** «Banco A» y «Revolut», y un extracto de Revolut con «Transferencia internacional a Ana Ejemplo» por 20 €
- **Cuando** la persona lo importa
- **Entonces** ese movimiento llega como «Gasto · Regalos»

### Escenario: transferencia internacional en inglés
- **Dado** «Banco A» y «Revolut», y un extracto de Revolut en inglés con «International Transfer to Ana Ejemplo» por 20 €
- **Cuando** la persona lo importa
- **Entonces** ese movimiento llega como «Gasto · Regalos»

### Escenario: otra categoría recordada
- **Dado** una importación anterior en la que la persona guardó esa transferencia internacional como Casa/Splitwise
- **Cuando** importa otro extracto con otra transferencia internacional al mismo destinatario
- **Entonces** llega como «Gasto · Casa/Splitwise»

## Requisito: una bonificación es un ingreso

Un abono del banco cuyo concepto dice «bonificación» es dinero que entra, no plata que pasa entre cuentas propias: llega como ingreso, aunque el texto lleve el número de contrato de una tarjeta de la persona. Su categoría es «Intereses y rendimientos» si existe, y si no «Otros». La persona puede cambiarla en la revisión.

### Escenario: bonificación con el contrato de la tarjeta
- **Dado** «Banco A» y «Tarjeta A» terminada en 7146, y un extracto de Banco A con «Liquidación por bonificación de campaña del contrato 0049 0755 50 21947146» por 5,86 €
- **Cuando** la persona lo importa
- **Entonces** ese movimiento llega como ingreso, no como transferencia a «Tarjeta A»

### Escenario: la liquidación de la tarjeta sigue siendo transferencia
- **Dado** esas mismas cuentas y un extracto de Banco A con «Liquidación de las tarjetas de crédito del contrato 0049 0755 502 1947146» por 700 €
- **Cuando** la persona lo importa
- **Entonces** ese movimiento llega como transferencia a «Tarjeta A»

### Escenario: bonificación sin tarjeta
- **Dado** «Banco A» sin ninguna tarjeta
- **Cuando** la persona importa un extracto con una bonificación de 4,20 €
- **Entonces** llega como ingreso
