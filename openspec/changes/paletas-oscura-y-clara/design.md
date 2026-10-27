# Diseño: paletas-oscura-y-clara

## Decisiones de la persona (2026-10-27)

- **Se acaban los cuatro kits** que se propusieron antes: quedan dos paletas atadas a la apariencia.
- **Oscura = todos los colores de la referencia 1** (Brûlée); **Clara = todos los de la referencia 2** (Jardín). No se
  usa nada de la paleta nieve/aqua/naranja.
- **Letra de la referencia 1 y números de la referencia 2** (monoespaciada).
- **Tarjetas con degradado, más suave** que en la primera prueba.
- **Logo «mf.» dentro de la app**, alineado con la letra y los colores.
- **Fondo de manchas y estrellas** se quedan.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Oscura (Brûlée):** fondo Rum Chocolate #450E15; manchas Her Highness #432E6F, Vivid Orange Peel #FFA102, Frozen
  Tomato #DD5533, Ginshu #BC2D29 y, muy tenue, Yoghurt Brûlée #F5E9CE; texto Yoghurt Brûlée; botones Yoghurt con
  texto Rum Chocolate; acento (puntos, enlaces, logo) Vivid Orange Peel; degradados Frozen Tomato/Ginshu y Her Highness.
- **Clara (Jardín):** fondo Arcade White #EDEBE2; manchas Pink Drink #E9B8DE, Martian Green #136C51, Dull Yellow
  #EEDC5B, Romanov Mauve #B97DA8; texto y botones #113C42; acento (logo) Martian Green; degradados Pink Drink y Dull Yellow.
  Las superficies son tonos de esos colores (translúcidos), no colores nuevos.
- **Letra:** `system-ui` sans (SF Pro) en textos y títulos, con peso 600 a 700 en títulos; números en `ui-monospace`
  (SF Mono). Una alternativa más parecida a la geométrica de la referencia es SF Rounded (`ui-rounded`); se cambia con una
  variable si no convence en el iPhone.
- **Números:** los importes, totales y el resultado del mes (clases `.num`, `.monto`, `.big`) van en monoespaciada.
- **Degradado:** dos manchas radiales (esquina superior izquierda e inferior derecha) al 55 % de opacidad sobre la
  superficie; el texto de esas tarjetas cumple 4,5 a 1 en el peor punto, en las dos apariencias.
- **Colores de categorías y de tipos de cuenta:** los de ahora, para que cada categoría siga teniendo el mismo color.
- **Sin cambios de datos:** se conservan `apariencia` y el resto; `settings.paleta` sigue ignorándose.

## Cómo se implementa en index.html

- Las variables de color salen de `:root` (Clara) y de `:root[data-apariencia="oscura"]` (Oscura), como hasta ahora,
  con nuevos valores. Variables nuevas: `--grad1`, `--grad2`, `--on-grad`, `--on-grad-muted`, `--acento`, `--font-num`.
- `.card.grad` (disponibles, cuotas, patrimonio), `.logo` y la letra de números; el encabezado de Inicio suma el logo.
- Sube la versión de `CACHE` en `sw.js`.
