---
cambio: revolut-ingles-y-pagos-de-tarjeta
estado: archivado
datos: sin-cambios
archivado: 2026-11-02
---
# Leer Revolut en inglés y no duplicar los pagos de la tarjeta

## Por qué

Dos fallos al importar extractos, vistos con extractos reales (que no se suben al repo):

1. **Revolut en inglés no se lee.** El extracto de Revolut también se descarga en inglés («EUR Statement», «Account transactions
   from Oct 1, 2026 to Oct 31, 2026», columnas «Money out» / «Money in» / «Balance», fechas «Oct 5, 2026», importes «€10.00»). La
   app sólo reconoce la versión en español. El archivo cae al lector genérico, que no entiende ese formato de fecha ni de importe, y
   no se importa nada.
2. **El pago de la tarjeta se cuenta dos veces.** El resumen de la tarjeta anota cada pago como un ingreso «Pago» en la tarjeta.
   Después, el extracto del banco trae el mismo pago («Liquidación de las tarjetas de crédito») y la app lo anota otra vez, como
   transferencia del banco a la tarjeta. Con tres resúmenes y un extracto del banco, la tarjeta pasó de −1070,35 € a +1209,46 €:
   1512,34 € de pagos contados dos veces más un pago nuevo de 767,47 €, que ese sí es nuevo.

## Qué cambia

- Los extractos de Revolut en euros en inglés se leen igual que los de español: movimientos con su signo, saldo final para
  conciliar y número de cuenta. El español sigue como hasta ahora.
- Al importar el extracto de una cuenta, una línea que es un pago a una tarjeta propia y que coincide con un ingreso «Pago» ya
  anotado en esa tarjeta (mismo importe, fecha a ±3 días, sin cuenta de origen) **reemplaza** ese ingreso: queda una sola
  transferencia, de la cuenta del extracto a la tarjeta. La línea lleva la marca «Reemplaza el pago anotado» para que se vea.
  Si no hay ingreso que coincida, se anota como transferencia nueva, como hasta ahora.
- En el orden contrario (primero el banco, después la tarjeta) no cambia nada: el pago de la tarjeta ya sale «Ya está».

## A quién afecta

A cualquier persona que importe extractos de Revolut descargados en inglés, y a quien importe a la vez el extracto de un banco
y el resumen de su tarjeta. Los movimientos que ya están guardados no se tocan hasta que importe otro extracto.

## Pantallas

Revisión del extracto: la marca nueva «Reemplaza el pago anotado» en la línea de un pago a la tarjeta. Nada más cambia de lugar.

## Fuera de alcance

- Extractos de Revolut en otras monedas (el «USD Statement» del mismo PDF no se lee) y en otros idiomas.
- Corregir lo que ya está mal guardado en la tarjeta (se rehace con «Borrar todos sus movimientos» y volviendo a importar).
- Cuentas de ahorro o «bolsillos» de Revolut: sólo la cuenta corriente.
