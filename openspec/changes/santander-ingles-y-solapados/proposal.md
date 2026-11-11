---
cambio: santander-ingles-y-solapados
estado: diseno-aprobado
datos: sin-cambios
---
# Leer el extracto de Santander en inglés y no repetir movimientos entre extractos solapados

## Por qué

1. **El extracto de noviembre no se lee.** La app de Santander del teléfono descarga los movimientos de la cuenta en otro formato, en inglés («Your account activity», «Transaction date», «Value date», fechas «05 nov 2026», importes «−400,00€» con el signo menos aparte). La app sólo reconoce el formato en español, y el lector genérico tampoco entiende esas fechas: no se importa nada.
2. **Los extractos se solapan.** Cada extracto que se descarga repite días del anterior (el de noviembre empieza el 23 de octubre). Hoy un movimiento repetido sale «Ya está» si coincide en cuenta, fecha e importe, pero:
   - el formato nuevo muestra primero la fecha de operación y el viejo se guardó con la fecha valor, así que el mismo movimiento puede no coincidir;
   - si hay dos movimientos iguales el mismo día y ya estaba guardado uno solo, los dos salen «Ya está» y el segundo se pierde;
   - la revisión no dice cuántos movimientos son nuevos y cuántos ya estaban.

## Qué cambia

- Se lee el extracto de cuenta de Santander en inglés: movimientos con su signo, la fecha valor (como en el formato en español), el saldo para conciliar y el número de cuenta.
- «Ya está» cuenta: si hay un movimiento guardado, cubre uno solo de los iguales del extracto; los demás entran como nuevos.
- La revisión del extracto dice arriba el periodo que cubre y cuántos movimientos son nuevos y cuántos ya estaban.

## A quién afecta

A quien importe extractos de Santander descargados en inglés, y a cualquiera que importe extractos con días en común. No cambia lo ya guardado.

## Pantallas

Revisión del extracto: una línea de resumen arriba de la lista.

## Fuera de alcance

- Borrar o juntar duplicados que ya estén guardados de importaciones anteriores (se arreglan borrando el movimiento, o con «Borrar todos sus movimientos» y volviendo a importar).
- Empezar una tarjeta con el saldo anterior de un resumen cuando la cuenta ya tiene movimientos: ahí el orden sigue importando (primero el resumen más viejo).
- Ordenar los adjuntos de la hoja de la cuenta.
- Otros bancos u otros idiomas.
