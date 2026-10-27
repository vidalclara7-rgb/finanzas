# Diseño: paletas-oscura-y-clara

## Decisiones de la persona (2026-10-27)

- **Se acaban los cuatro kits** que se propusieron antes: quedan dos paletas atadas a la apariencia.
- **Oscura = todos los colores de la referencia Jardín**; **Clara = todos los de la referencia Brûlée** (la primera
  propuesta las tenía al revés; la persona pidió intercambiarlas al verlas). No se
  usa nada de la paleta nieve/aqua/naranja.
- **Letra de la referencia 1 y números de la referencia 2** (monoespaciada).
- **Tarjetas con degradado, más suave** que en la primera prueba.
- **Logo «mf.» dentro de la app**, alineado con la letra y los colores.
- **Fondo de manchas y estrellas** se quedan.

## Cambio de rumbo (2026-10-27, Gate 2)

Tras ver las paletas con manchas y degradado, la persona dijo que no le convencían las manchas ni el degradado y mandó
dos referencias de bloques de color sólido y plano. Decidido: **bloques sólidos en casi todas las tarjetas** (descartado:
sólo en las destacadas) y **fondo liso del color de cada paleta** (descartado: negro y blanco). Se quitan el fondo de
manchas, las estrellas, su movimiento y los degradados.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Oscura (Jardín):** fondo casi negro #070B0C (por pedido de la persona, como en las referencias); las tarjetas
  neutras llevan el verde azulado #113C42; colores de tarjeta: verde #136C51 (texto blanco hueso), amarillo #EEDC5B, rosa
  #E9B8DE, malva #B97DA8 y blanco hueso #EDEBE2 (texto verde muy oscuro #0B2A2E). Acento del logo: amarillo.
- **Clara (Brûlée):** fondo blanco #FFFFFF; las tarjetas neutras llevan el crema #F5E9CE; colores de tarjeta: naranja #FFA102 (texto chocolate #450E15), púrpura #432E6F,
  granate #BC2D29 y chocolate #450E15 (texto crema #F5E9CE) y blanco crema #FFFBF0 (sobre el fondo blanco se distinguen por su borde). El tomate #DD5533 (3,9 a 1 con
  texto) sólo se usa de acento (logo, aros y barras), no de fondo de tarjeta con texto.
- **Qué color lleva cada tarjeta:** cinco ranuras (k1 a k5) por paleta. Bancos k1, inversiones k2, tarjetas k3,
  financiaciones k4 y deudas compartidas k5; «Cuotas del mes» como las financiaciones; patrimonio k1; «Por semana» k5;
  «Ingresos y gastos» k1; «Por cobrar» k3; conciliación k2; checklist k5.
- **Gastos:** cada tarjeta del color de su categoría (los 19 de siempre, con texto blanco, ≥ 4,5 a 1), como en la
  primera versión de la app; el icono sobre un círculo translúcido.
- **Neutras:** «Gasto del mes» (la torta necesita fondo neutro), las hojas, formularios, avisos y Ajustes.
- **Letra:** `system-ui` sans (SF Pro) en textos y títulos, peso 600 a 700 en títulos; números en `ui-monospace` (SF
  Mono). Una alternativa más parecida a la geométrica de la referencia es SF Rounded (`ui-rounded`), con una variable.
- **Números:** importes, totales y resultado del mes (`.num`, `.monto`, `.big`) en monoespaciada.
- **Sin cambios de datos:** se conservan `apariencia` y el resto; `settings.paleta` sigue ignorándose.

## Cómo se implementa en index.html

- Variables de color en `:root` (Clara) y `:root[data-apariencia="oscura"]` (Oscura), con las ranuras `--k1` a `--k5` y su
  texto `--k1t` a `--k5t`. Se quitan la capa `.fondo` (HTML, CSS y JS de pausa y movimiento) y `.card.grad`.
- `.card.color` toma `--c` y `--on-c` (de las ranuras o de la categoría); `.mov` vuelve a ser sólida del color de su categoría.
- Logo `.logo` y letra de números. Sube la versión de `CACHE`.
