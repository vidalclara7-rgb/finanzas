---
cambio: importar-extractos
estado: diseno-aprobado
datos: amplia
---
# Importar extractos del banco y adjuntar archivos

## Por qué

Cargar cada movimiento a mano es lento y es la razón por la que la conciliación no cierra: siempre
falta algo. Los bancos ya dan extractos en PDF con cada movimiento y el saldo. Además, el mismo
dinero aparece en varios extractos (una recarga a Revolut sale de Santander y entra en Revolut; el
pago de la tarjeta sale de la cuenta), y si se carga dos veces los gastos y los saldos quedan mal.

## Qué cambia

- **Importar un extracto en PDF** desde Movimientos o desde una cuenta. En esta versión la app lee:
  el extracto de cuenta de Revolut en euros, los movimientos de cuenta de Santander y el extracto de
  tarjeta de crédito de Santander. Reconoce de qué cuenta es; la primera vez la persona la elige y la
  app lo recuerda.
- **Borradores para revisar**: la app propone tipo, categoría y cuenta de cada movimiento, y nada se
  guarda hasta que la persona confirma. Se puede cambiar o desmarcar cada uno.
- **Consolidar**: marca lo que ya está cargado, las compras anuladas y las **transferencias entre tus
  cuentas**, para que el mismo dinero no cuente dos veces.
- **Aprender**: recuerda la categoría que elegiste para cada comercio.
- **Reembolsos**: una transferencia de la empresa por gastos se propone como Reembolso y ofrece
  vincular los gastos por cobrar.
- **Conciliar con el extracto**: si el extracto trae el saldo, ofrece conciliar la cuenta con él.
- **Adjuntos**: el PDF importado queda guardado con su cuenta y su mes, y se pueden adjuntar otros
  archivos (PDF o fotos) a mano. Todo queda en el teléfono.

## A quién afecta

A todas las personas que usan el link: aparece «Importar extracto». Sus datos no cambian; se agregan
la memoria de categorías por comercio y los adjuntos.

## Pantallas

Movimientos (botón «Importar extracto»), hoja de importación (elegir cuenta y revisar borradores),
hoja de cuenta (adjuntos e importar), Ajustes (aviso de que los adjuntos no entran en la copia).

## Fuera de alcance

- Revolut Trading y cualquier importe en otra moneda: van con el módulo de inversiones.
- Compras aplazadas en cuotas de la tarjeta y planes de pago de financiaciones.
- Extractos de otros bancos, CSV o Excel. Cada formato nuevo es un cambio chico.
- Leer fotos de tickets o recibos.
