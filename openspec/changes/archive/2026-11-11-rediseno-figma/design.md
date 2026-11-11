# Diseño: rediseño con el estilo del Figma

Fecha: 2026-11-11. Fuente: archivo de Figma «Personal Finance – Account Balance App (Community)», página «Typography & Color» y las tres pantallas «Finance #1» a «#3».

## Decisiones tomadas con la persona

| Tema | Decisión | Descartado |
|---|---|---|
| Sistema actual (vidrio, lima, violeta, Archivo, fondo fluido) | Se reemplaza entero | Convivir o elegir estilo en Ajustes |
| Apariencia oscura | Se deriva de los azules oscuros del Figma | Sólo claro |
| Alcance | Estilo y disposición de Inicio, Cuentas y Movimientos | Sólo colores y letra |
| Colores de categoría | Se conservan los 19 (la paleta de gráficos de la persona) | Derivarlos del degradado; sólo verde y rosa |

## Colores

El Figma no tiene variables: los valores se midieron sobre la imagen de la página de colores y pueden variar un tono. Se confirman en el preview.

| Papel | Claro | Oscuro (derivado) |
|---|---|---|
| Fondo de pantalla | #F1F0F2 | #151C2A |
| Tarjeta | #FFFFFF | #1F3252 |
| Texto | #151C2A | #F1F0F2 |
| Texto secundario | a fijar con la prueba de contraste (parte de #7988A3, oscurecido hasta 4,5 a 1 sobre blanco) | #A1B6DB |
| Degradado | azul cielo #91CDFB, violeta #9A89F3, rosa violáceo #CF8BE8; para la tarjeta destacada y el botón se usan tonos más profundos de la misma familia, hasta que el texto blanco llegue a 4,5 a 1 en el peor punto | igual |
| Ingreso | relleno #41FF8B/#5BDA8C; texto más oscuro para llegar a 4,5 a 1 sobre blanco | relleno y texto #41FF8B |
| Gasto | relleno #FF5984/#EE6B8D; texto más oscuro para llegar a 4,5 a 1 sobre blanco | relleno y texto #FF5984 |

Regla heredada: todo texto da contraste 4,5 a 1 con lo que tiene detrás. Los colores del Figma son claros: el verde, el rosa y el texto azul grisáceo no llegan a 4,5 a 1 sobre blanco, así que se separan **relleno** (puntos, curvas, barras, círculos: color del Figma) y **texto** (versión más oscura en la clara). Es un desvío del Figma por contraste, igual que en el sistema anterior.

## Tipografía

Roboto, pesos 300, 400, 500, 600 y 700 (el Figma usa Light, Regular, Medium, SemiBold y Bold). Se obtiene del paquete de npm `@fontsource-variable/roboto` (Apache 2.0 / OFL según el paquete: se verifica la licencia antes de copiarla), variable, sólo latín, sin modificar, en `vendor/roboto/` con su licencia y a `FILES` de `sw.js`. Sin cargar nada de otros sitios. Se retira `vendor/archivo/` de la app y de `FILES`; las cifras usan números tabulares de Roboto en lugar de la letra monoespaciada.

## Implementación en `index.html`

- Variables en `:root` y `:root[data-apariencia="oscura"]`: se reemplazan las de vidrio (`--surface`, `--glass-tint`, `--line`), las del fondo fluido (`--fondo-*`, `--glow`) y la lima. Se conservan `--cat1`…`--cat19` y `--cat1t`…`--cat19t` y los cinco colores por tipo de cuenta (`--k1`…`--k5`).
- Se borran el bloque `.fondo` y su filtro, `pintarFondo()`, `bucleFondo()`, `arrancarFondo()`, `mqQuieto`, el borde cónico (`@property --ang`, `gira`), `.foco`, `moverFoco()`, el pulso del botón y `html.en-pausa`. Esto resuelve por construcción la observación del foco sobre el texto, el costo del desenfoque, el límite de cuadros y el escucha de movimiento del dedo.
- `.card`: fondo de tarjeta, sombra suave, esquinas de 24 px, sin desenfoque. `.card.destacada`: degradado y texto blanco. `.btn`: píldora con degradado y texto blanco; `.btn.sec`: tarjeta con borde fino.
- La etiqueta de color y el punto delante del título se acotan al título de la tarjeta (no a todo `.lbl`).
- `movHTML()`: fila blanca con círculo (color de la categoría, inicial de la categoría con `--catNt`), concepto, segunda línea con la categoría y las marcas, e importe (y moneda) a la derecha. Todo texto escrito por la persona sigue con `esc()`.
- Inicio: el resultado del mes pasa a la tarjeta destacada; «Gastado» e «Ingresado» salen de `totales`/`movsMes()` como hoy. `mesesIG()` dibuja dos curvas suaves en lugar de barras, con un globo al tocar un mes.
- Cuentas: el patrimonio con su fecha; nuevo gráfico de barras de los últimos cinco meses con el patrimonio de cierre de cada uno (`totales(hasta)` y `meses[mes].neto`, nada se guarda); las cuentas, en tarjetas numeradas con `scroll-snap` horizontal.
- `manifest.webmanifest`: `background_color` y `theme_color` #F1F0F2 (la barra del sistema sigue a la apariencia con `theme-color`).
- Se quitan las variables sin uso (`--on-c`, `--k1t`…`--k5t`, `--on-color`, `--neutro`, `--on-osc-muted`, `--lavender`, `--sky`, `--positive`, `--negative`) y `.card.color.osc`, `.ico.osc`.
- `sw.js`: `CACHE` pasa de `finanzas-v50` a `finanzas-v51`; `vendor/roboto/…` entra en `FILES` y `vendor/archivo/…` sale.

## Datos

`datos: sin-cambios`. No se toca `finanzas-v1` ni `norm()`. `settings.apariencia` sigue igual; `settings.paleta` sigue ignorándose.

## Preview y pruebas

El preview enseña Inicio, Movimientos y Cuentas en claro y en oscuro, con los mismos `data-pantalla` y `data-ui` que la app. Se reescriben `apariencia.test.cjs`, `sistema.test.cjs` e `interfaz.test.cjs` para los escenarios nuevos y se ajustan los tests de movimientos y gráficos que miraban la tarjeta de color, la lista de una línea y las barras de ingresos contra gastos. Contraste: la prueba existente mide el peor caso de cada color; para la tarjeta destacada y el botón, el peor punto del degradado.

## Riesgos

- Los colores del Figma son claros: el texto blanco sobre el degradado y el texto secundario obligan a oscurecer tonos. Se enseña en el preview.
- Cambia el aspecto de todas las pantallas a todas las personas a la vez: sólo se publica si la persona lo pide.
