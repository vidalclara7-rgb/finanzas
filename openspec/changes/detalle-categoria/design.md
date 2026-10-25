# Diseño: detalle-categoria

## Decisiones de la persona (2026-10-25)

- Se abre tocando la torta o la lista de «Gasto del mes». Descartado: una pestaña en Movimientos.
- El total de la categoría se reparte por cuenta. Descartados: por comercio y por semana. Para ver
  «en qué se concentra», debajo van los gastos de mayor a menor.
- Barras ordenadas de mayor a menor, 5 + «Resto» que se abre. Descartados: torta y todas las barras.
- El mes con flechas, comparando con el mes anterior. Descartado: sólo el mes en curso.
- «Todo se trata del orden»: nada aparece sin ordenar; poca información por pantalla.

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- La comparación dice «20 € más que en septiembre (+25 %)», «20 € menos…», «Igual que en
  septiembre» o, si el mes anterior no hubo gasto en la categoría, «En septiembre no gastaste en
  Supermercado».
- Cuenta lo mismo que la torta: gastos de la categoría, también Trabajo (reembolsable); no ingresos,
  transferencias ni ajustes.
- La flecha › no pasa del mes en curso. En un mes sin gastos de la categoría, la hoja lo dice y no
  dibuja barras.
- Al editar un gasto desde el detalle y guardar, se vuelve a Inicio como hoy (la hoja de movimiento
  cierra las hojas); si cambió de categoría, el detalle ya no lo muestra.

## Cómo se implementa en index.html

- `data-cat` ya está en las porciones de la torta; las filas de `#cats` suman `data-cat`. Un clic en
  cualquiera abre `abrirCat(cat, mes)`.
- Hoja nueva `sheetCat` (en `HOJAS`) con el título, el total (`monto()`), la comparación, las barras
  (`.rank`/`.bar.cat` ya existentes, en el color de la categoría) y la lista con `movHTML()`.
- Sin datos nuevos ni migración. Sube la versión de la caché.

## Segunda ronda del Gate 1 (2026-10-25)

- La persona: «no me gusta que el panel de inicio tenga tanto detalle… pondría algo más visual y
  luego iría a más detalle». Arriba de Inicio queda la barra fijo/variable con los dos importes; el
  ranking por grupo pasa a la hoja «Fijos y variables». Descartados: la torta arriba y un número grande
  con anillo. Lo demás de Inicio (torta, disponibles y por cobrar, por semana, ingresos y gastos,
  patrimonio) sigue: lo eligió así.
- Decidido al escribir: en la hoja «Fijos y variables», tocar una categoría abre su hoja de categoría
  (con todos sus gastos del mes, fijos y variables).
- Otros (`--cat12`) se veía igual que la pista de la barra: Otros pasa a un tono más oscuro en las
  cuatro paletas y la pista de las barras de categoría, a una más clara.
- Este cambio sustituye «fijos y variables del mes», que `importar-extractos` también sustituye (para
  decir Supermercado): se archiva después de él y su texto ya dice Supermercado.
