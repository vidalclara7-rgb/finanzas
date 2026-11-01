---
cambio: cuotas-ya-anotadas
estado: archivado
preview: no
datos: sin-cambios
archivado: 2026-11-01
---
# No contar dos veces las cuotas de compras fraccionadas ya anotadas

## Por qué

Al importar resúmenes de tarjeta seguidos, la compra fraccionada que se anotó con el resumen anterior (por lo que quedaba) ya
incluye las cuotas de los meses siguientes. Pero cada resumen nuevo trae esas cuotas como líneas «CUOTA FRACCIONAR COMPRA …»,
que se anotan otra vez como gastos: la deuda de la tarjeta sube dos veces y no cuadra con el resumen (con tus tres resúmenes,
115,42 € de más tras el segundo y 248,06 € tras el tercero).

## Qué cambia

- La línea «CUOTA FRACCIONAR COMPRA …» de una compra que ya está anotada desde un resumen anterior sale **desmarcada**, con la
  marca «Cuota ya anotada»: su gasto y su deuda ya cuentan en la compra en cuotas.
- Vale también para la última cuota de la compra.
- Los intereses de cada mes se siguen anotando (no estaban en lo pendiente).
- Si el resumen es anterior a lo anotado (se importó en otro orden), la cuota entra como siempre.

## A quién afecta

A quien importe resúmenes de tarjeta de Santander con compras fraccionadas en meses seguidos.

## Pantallas

Ninguna nueva: una marca más en la revisión del resumen.

## Fuera de alcance

- Corregir lo ya importado con el fallo: se borra la cuenta entera y se vuelve a importar, del más antiguo al más nuevo.
- Compras fraccionadas de otros bancos.
