# Capacidad: importacion

## Requisito: intereses del resumen de tarjeta

Los intereses de financiación que trae el resumen de la tarjeta de Santander entran como gastos de la tarjeta, uno por cada
compra fraccionada, con su importe y con el comercio al que corresponden. Se leen aunque su fila esté partida en dos líneas
del PDF, y el pie de página del resumen no forma parte de ninguna descripción.

### Escenario: cada interés con su importe
- **Dado** un resumen de tarjeta con tres intereses de financiación de 0,15 €, 1,70 € y 1,95 €
- **Cuando** la persona lo importa
- **Entonces** la revisión muestra los tres intereses como gastos con esos importes

### Escenario: interés con la fila partida en dos líneas
- **Dado** un resumen donde la fecha y el concepto de un interés están en una línea del PDF y sus importes en la siguiente
- **Cuando** la persona lo importa
- **Entonces** el interés aparece en la revisión con su importe

### Escenario: el pie de página no es parte del interés
- **Dado** un resumen donde el pie de página «BANCO SANTANDER, S.A.» va justo después del último interés
- **Cuando** la persona lo importa
- **Entonces** la descripción de ese interés no contiene «Santander»
- **Y** se propone como gasto y no como transferencia a otra cuenta
