# Diseño: gastos-fijos-y-variables

## Decisiones de la persona (2026-10-25)

- Los círculos («forma del gasto del mes») se reemplazan: no se entendían.
- Fijo = estable por 12 meses o más; el resto, variable.
- La persona lo marca al anotar y además la app sugiere. Descartado: deducirlo sola a los 12 meses
  (hasta tener un año de datos todo saldría variable).
- Gráfico: barra partida fijos | variables con importe y %, y ranking de categorías dentro de cada
  grupo. Descartadas: torta doble (reemplazaba la torta actual) y dos tortas (mucho alto).
- «Trabajo (reembolsable)» queda fuera del gráfico, como en los topes.
- «Gastaste el X % de lo que entró» se mantiene como texto.
- La sugerencia salta con 3 meses seguidos, importe ±10 %, en una tarjeta de Inicio con «Sí, es
  fijo» / «No». Aceptar marca los gastos ya anotados y los siguientes.
  Descartados: 6 o 12 meses (tarda), importe exacto (deja fuera luz, teléfono), cualquier importe
  (sugeriría el súper), etiqueta en Movimientos (poco visible).

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- «El mismo gasto» = misma categoría y misma nota, sin distinguir mayúsculas ni espacios de más.
  Los gastos sin nota no se sugieren ni arrastran la marca a los siguientes.
- «Importe parecido»: lo de ese gasto en cada uno de los tres meses no se aparta más de un 10 % del
  promedio de esos tres meses. Tres meses de calendario seguidos, el actual incluido.
- Una sugerencia a la vez: la de mayor importe mensual.
- Desmarcar «Gasto fijo» en un gasto lo vuelve variable a él y hace que los siguientes con esa nota
  ya no vengan marcados; los anteriores no cambian.
- La casilla no aparece en gastos de «Trabajo (reembolsable)».

## Cómo se implementa en index.html

- `movs[i].fijo?: true` en gastos. `fijos: {"<cat>|<nota normalizada>": true|false}` en la raíz de los
  datos: `true` = los siguientes vienen marcados; `false` = sugerencia rechazada. Normalizar nota:
  `trim`, espacios internos a uno, minúsculas.
- `norm()`: `fijos` vacío si no existe (también al restaurar copias); sin cambiar `v` ni la clave.
- Sale el `<svg class="forma">` y su CSS; entra una tarjeta `data-ui="fijos-variables"` con la barra y
  el ranking en SVG/HTML propio (sin librerías). `#formaTxt` pasa a línea de texto sobre el resultado.
- Tarjeta `data-ui="sugerencia-fijo"` en Inicio; casilla `data-ui="casilla-fijo"` en la hoja de
  gasto; etiqueta `data-ui="chip-fijo"` en la tarjeta del movimiento. La nota se pinta con `esc()`.
- Colores: fijos y variables con variables de la paleta, para que funcione en las cuatro paletas y en
  oscuro (contraste 4,5 a 1 en los importes).
- La importación de extractos (cambio aprobado, aún sin construir) creará gastos que pasan por la
  misma regla: si su categoría y nota coinciden con un fijo, vienen marcados.
- Sube la versión de la caché.
