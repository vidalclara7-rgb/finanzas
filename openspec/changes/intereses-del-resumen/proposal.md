---
cambio: intereses-del-resumen
estado: construida
preview: no
datos: sin-cambios
---
# Leer bien los intereses del resumen de la tarjeta

## Por qué

Al importar un resumen de tarjeta de Santander con compras fraccionadas, la app pierde el interés de una de ellas (su fila
se parte en dos líneas del PDF) y a otro le pega el pie de página, de modo que lo toma por una transferencia a otra cuenta
en vez de un gasto. El resumen nunca cuadra al céntimo y la cuenta del banco suma de más.

## Qué cambia

- Cada interés de financiación del resumen se lee entero, con su importe, aunque su fila se parta en dos líneas del PDF.
- El pie de página del resumen no se mezcla con la descripción de ningún interés.
- Los intereses entran como gasto de la tarjeta, con la descripción del comercio al que corresponden.

## A quién afecta

A quien importe resúmenes de tarjeta de Santander con compras fraccionadas. Lo ya importado no cambia: volver a importar
marca como «Ya está» lo que ya estaba y trae lo que faltaba.

## Pantallas

Ninguna: sólo cambia lo que lee el importador.

## Fuera de alcance

- Corregir los movimientos ya importados con el fallo (se corrigen a mano o borrando e importando de nuevo).
- Otros formatos de resumen.
