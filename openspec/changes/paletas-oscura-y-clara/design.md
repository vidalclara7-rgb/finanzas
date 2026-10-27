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

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Oscura (Jardín):** fondo verde azulado #113C42; manchas Martian Green #136C51, Pink Drink #E9B8DE, Dull Yellow
  #EEDC5B y Romanov Mauve #B97DA8; texto Arcade White #EDEBE2; botones Arcade White con texto #113C42; acento (logo)
  Dull Yellow; degradados Martian Green y Romanov Mauve. Las superficies son tonos del verde, translúcidos.
- **Clara (Brûlée):** fondo Yoghurt Brûlée #F5E9CE; manchas Vivid Orange Peel #FFA102, Frozen Tomato #DD5533, Her
  Highness #432E6F y Ginshu #BC2D29; texto y botones Rum Chocolate #450E15; acento (logo) Frozen Tomato; degradados
  Vivid Orange Peel y Frozen Tomato.
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
