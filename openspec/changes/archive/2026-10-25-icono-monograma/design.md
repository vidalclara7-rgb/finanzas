# Diseño: icono-monograma

## Decisiones de la persona (2026-10-25)

- Opción D de cuatro (A torta viva, B barra fijos y variables, C monograma «mf.», D pila de
  tarjetas): tres tarjetas apiladas sobre verde oliva `#5F6B4E`: salvia `#B9BDA6`, rosa chicle
  `#F3A6DA` y rojo anaranjado `#F05A2C` con «€» en tinta `#121212`.

## Decisiones tomadas al escribir

- El «€» se agranda respecto de la propuesta para que se lea en el tamaño de la pantalla de inicio.
- Fondo a sangre (sin transparencia ni esquinas propias): iOS y Android redondean el ícono.

## Cómo se implementa

- Se dibuja en SVG y se exporta a PNG en 180, 192 y 512 px con el navegador de los tests
  (`scripts/icono.cjs`, para poder regenerarlo). Reemplaza `icon-180.png`, `icon-192.png` y
  `icon-512.png`, con los mismos nombres: el manifiesto y `index.html` no cambian.
- `theme_color`/`background_color` del manifiesto siguen como están.
- Sube la versión de la caché para que los teléfonos descarguen los íconos nuevos.

## Gate 3, primera ronda (2026-10-25)

- La persona: «me gusta la verde pero me gusta más el mf con el fondo rosa y el punto rojo». Pasa a
  la opción C: «mf» en tinta `#121212` sobre rosa chicle `#F3A6DA`, con el punto en rojo anaranjado
  `#F05A2C` (el que vio en la propuesta). El cambio se renombra de `icono-tarjetas` a
  `icono-monograma`. La pila de tarjetas queda descartada.
