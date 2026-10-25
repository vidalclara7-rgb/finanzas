# Diseño: paleta-viva

## Decisiones de la persona (2026-10-25)

- Paleta de la referencia, con más rosas, cherry y verde oscuro.
- Más vivo y con contraste (no más sobrio).
- Fondo gris muy claro con tarjetas blancas.
- Cambio aparte, antes de reembolsos; el preview de reembolsos se rehace con estos colores.

## Paleta (modo claro)

- Fondo `#ECECEA`, tarjetas `#FFFFFF`, líneas `#DEDEDA`.
- Categorías, en el orden de `CATS`: Súper salvia `#B9BDA6`, Comida fuera rojo anaranjado
  `#F05A2C`, Delivery rosa chicle `#F3A6DA`, Transporte verde oliva `#5F6B4E` (texto blanco), Ocio
  fucsia `#E8559B`, Compras cherry `#A3243B` (texto blanco), Belleza rosa claro `#F8CDE6`,
  Casa/Splitwise arena `#D9C9A8`, Salud menta apagado `#9FC2A4`, Viajes naranja claro `#F6A36B`,
  Trabajo (reembolsable) gris `#C9C9C4`, Otros piedra `#E2DED3`.
- Ingresos verde claro `#C8DDA6`; transferencias y ajustes en blanco.
- Tarjetas de acento: patrimonio en cherry con texto blanco; «primer paso» y cuentas vacía en rosa
  chicle.

## Cómo se implementa

- Sólo variables de color en `:root` y su versión oscura, más una marca `osc` en las tarjetas cuyo
  color es oscuro (texto blanco). Las categorías oscuras se listan en `CATS_OSC`.
- Sube la versión de la caché.

## Descartado

- Números enormes con etiqueta chica y bloques de distinto tamaño, como la referencia: la persona
  eligió cambiar sólo los colores.
