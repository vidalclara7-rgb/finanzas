---
cambio: bonificaciones-e-internacionales
estado: diseno-aprobado
preview: no
datos: sin-cambios
---
# Bonificaciones como ingreso y transferencias internacionales en inglés como gasto

## Por qué

Dos cosas que la importación propone mal, vistas con extractos reales (que no se suben al repo):

1. **«Liquidación por bonificación de campaña»** del banco (un abono pequeño del contrato de la tarjeta, 4,20 € / 5,86 € / 5,61 €) llega
   como transferencia a la tarjeta, porque el texto lleva el número del contrato de la tarjeta. Son ingresos reales: dinero que
   entra, no plata que pasa entre cuentas propias. Hoy dejan la tarjeta con deuda de menos.
2. **«International Transfer to …»** (el extracto de Revolut en inglés) llega como transferencia a otra cuenta propia. La app ya
   trata «Transferencia internacional» (en español) como un gasto en Regalos, porque sale a una cuenta fuera de la app, pero no
   reconoce el texto en inglés.

## Qué cambia

- Un abono del banco con «bonificación» en el concepto llega como **ingreso** (categoría «Intereses y rendimientos» si existe, si no «Otros»), aunque el
  texto lleve el número de una tarjeta propia. Sigue siendo editable en la revisión.
- «International Transfer» se trata igual que «Transferencia internacional»: llega como gasto en Regalos (o con la categoría que la
  persona eligió antes), no como transferencia entre sus cuentas.

## A quién afecta

A quien importe extractos del banco con bonificaciones y a quien importe Revolut en inglés. No cambia lo ya guardado.

## Pantallas

Ninguna cambia: la revisión del extracto muestra los mismos controles con otra propuesta de tipo y categoría.

## Fuera de alcance

- Otros textos de abonos del banco (devoluciones, intereses) que hoy ya llegan bien.
- Otros idiomas.
- Arreglar lo que ya está mal guardado (se borra el movimiento o se cambia su tipo desde su hoja).
