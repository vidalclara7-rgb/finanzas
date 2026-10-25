# Diseño: paletas

## Decisiones de la persona (2026-10-25)

- Cuatro paletas prearmadas: Viva (la actual), Editorial, Lima y lavanda y Pastel crema.
- Sin paleta propia: cada paleta viene probada para que el texto se lea en claro y en oscuro.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- La paleta se guarda con los datos (`settings.paleta`), así viaja en la copia de seguridad. Sin
  valor, es Viva.
- En todas las paletas se mantienen los mismos papeles de color (tarjeta de tipo de cuenta, de
  categoría, de acento); cambia qué color ocupa cada papel. Las tarjetas con texto blanco (`osc`)
  usan en cada paleta un color oscuro, o, si la paleta es clara (Pastel crema), llevan texto oscuro.

## Cómo se implementa en index.html

- `html[data-paleta="…"]` redefine las variables de color de `:root`, con su bloque para modo
  oscuro. Viva sigue siendo la base de `:root`, así que sin `data-paleta` nada cambia.
- `--on-osc` es el color del texto de las tarjetas `osc` en cada paleta (blanco, salvo Pastel crema).
- Los tests de contraste recorren las cuatro paletas en claro y en oscuro.
- Sube la versión de la caché.

## Al preparar el preview (2026-10-25)

- Un control de contraste de las cuatro paletas mostró que el frambuesa de Viva (Trabajo
  reembolsable) con texto blanco daba 4,39 a 1. Pasa a `#D03876` (4,66), casi igual a la vista.
