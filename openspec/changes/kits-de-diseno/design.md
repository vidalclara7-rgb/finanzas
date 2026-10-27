# Diseño: kits-de-diseno

## Decisiones de la persona (2026-10-27)

- **Un kit = paleta + letra + logo**, elegible en Ajustes (descartadas: dejar sólo una paleta fija y mantener paletas
  que sólo cambian colores).
- **Cuatro kits** de las referencias: Índigo, Nieve, Jardín y Brûlée. Todos con versión clara y oscura (la oscura y la
  clara de cada kit las deriva la app de los colores de la referencia).
- **Letras del sistema**, sin cargar fuentes (descartado: incluir fuentes en el repo, que es una dependencia nueva).
- **Logo = el monograma «mf.» dentro de la app** (descartado: cambiar el ícono de la pantalla de inicio, que es un archivo fijo).
- **Tarjetas con degradado difuso** (como la app oscura de la referencia).
- **El fondo de manchas y estrellas se queda**, con los colores del kit.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **Kit por defecto: Índigo**, la primera referencia. Quien ya usa la app ve ese kit en la apariencia que tenía
  (Oscura salvo que haya elegido otra). El aspecto de los moodboards desaparece.
- **Colores base** (los definitivos se fijan al construir y se prueban con contraste 4,5 a 1):
  - Índigo: oscura sobre #1A002C con superficie #23003F, acentos #F94500, #BCACCE y #FFFDB4; clara sobre lila muy claro
    (#F4F0FA), texto #23003F, acento #F94500.
  - Nieve: clara sobre #F5F4ED y #ECECDC con aqua #A0C9CB, naranja #FF6037 y texto granate #351E1C; oscura sobre #351E1C
    con granate #733635.
  - Jardín: clara sobre #EDEBE2 con rosa #E9B8DE, verde #136C51, mostaza #EEDC5B y malva #B97DA8, texto #113C42; oscura
    sobre #113C42 con el verde.
  - Brûlée: clara sobre #F5E9CE con naranja #FFA102, tomate #DD5533 y púrpura #432E6F; oscura sobre #450E15 con el púrpura.
- **Letra por kit** (familias del sistema, con respaldo a la sans si el teléfono no la tiene): Índigo, sans (SF) con
  los números en monoespaciada; Nieve, serif (New York); Jardín, redondeada (SF Rounded); Brûlée, serif en los textos
  y sans en los números. Los títulos usan la letra del texto, en negrita.
- **Tarjetas con degradado:** el disponible de cada cuenta, «Cuotas del mes» y el patrimonio. El degradado es radial
  y difuso, del color de acento del kit hacia el fondo de la tarjeta; el texto de esas tarjetas tiene contraste ≥ 4,5 a 1
  en el peor punto del degradado, en las 8 combinaciones (4 kits × 2 apariencias).
- **Colores de categorías y de tipos de cuenta:** los de ahora, iguales en todos los kits.
- **Logo:** «mf.» dibujado con la letra del kit (las letras en el color del texto y el punto en el acento), 28 px en el
  encabezado de Inicio y grande en la tarjeta «Diseño» de Ajustes, donde cada kit muestra su logo, cuatro puntos de
  color y una línea de texto con su letra.
- **Cambio al instante**, sin recargar, y recordado al volver a abrir. La barra del sistema (`theme-color`) sigue al
  fondo del kit y la apariencia.

## Cómo se implementa en index.html

- `settings.kit?: "indigo"|"nieve"|"jardin"|"brulee"`; ausente o inválido = `"indigo"`. Sin tocar `norm()` (se interpreta
  al usarlo, como `apariencia`) y sin cambiar `v` ni la clave de `localStorage`. Un valor viejo `settings.paleta` se sigue ignorando.
- `<html data-kit="…" data-apariencia="…">`: el script del `<head>` los pone antes de pintar (con `try/catch`). Las
  variables de color salen de `:root[data-kit="x"]` y `:root[data-kit="x"][data-apariencia="oscura"]` (la base `:root`
  pasa a ser Índigo claro); la letra, de `--font` y `--font-num` por kit.
- `.card.grad` (disponibles, cuotas, patrimonio): `background` con `radial-gradient` en variables `--grad1` y `--grad2`
  del kit; texto con `--on-grad`.
- Logo `<span class="logo">mf<i>.</i></span>`, con CSS (sin imagen).
- Tarjeta «Diseño» en Ajustes: `#segKit` con una opción por kit (`data-kit-op`).
- Sube la versión de `CACHE`. El ícono de la pantalla de inicio no cambia.
