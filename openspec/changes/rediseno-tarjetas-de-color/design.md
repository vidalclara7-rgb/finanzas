# Diseño: rediseño con tarjetas de color

Fecha: 2026-11-22. Origen: dos referencias que mandó la persona (una lista «My collections» de tarjetas de color apiladas y una tarjeta «Cards» en carrusel; más una pantalla «Analytics» con tarjetas de degradado profundo sobre negro) y once rondas de previews en un artifact privado. El archivo de esas previews no está en el repo (vivía en el scratchpad de la sesión). Lo que importa de él está copiado abajo.

## Decisiones tomadas con la persona

| Tema | Decisión | Descartado |
|---|---|---|
| Fondo oscuro | Negro puro #000000 | El azul #151C2A de ahora; casi negro #0B0B0D |
| Fondo claro | Blanco #FFFFFF con tarjetas gris claro | El gris #F1F0F2 de ahora con tarjetas blancas |
| Estilo | «Como una app de Apple»: letra del sistema, esquinas muy redondeadas, títulos grandes, barra flotante | — |
| Color de las tarjetas de categoría | Degradado en las dos apariencias | Planos (se probó y se volvió al degradado); sombreado sólo en el oscuro |
| Paleta | La de la primera preview: claro lila, lima, azul, naranja, rosa; oscuro azul, verde agua suave, magenta, verde salvia, bordó | Pasteles iridiscentes (lavanda, durazno, menta…); verdes, amarillos y rosas fuertes; amarillo y verde neón en el oscuro («mucho impacto») |
| Color por categoría | Cada categoría conserva el suyo (19 colores rehechos con la paleta) | Color por puesto (la más grande lila, la segunda lima…), que cambiaría de un mes a otro |
| Resultado del mes | «Te sobraron X €» con destino del sobrante (opción R1) | El número suelto en grande («muy impactante, no me dice nada»); flujo entró-gastaste-invertiste-libre (R2); píldoras compactas (R3) |
| Torta | Mosaico proporcional (C2) | Barra de almacenamiento (C1); sacar el gráfico y dejar sólo la pila (C3) |
| Pila de tarjetas (A) | En una hoja aparte, «Gasto por categoría», al tocar «Gasto del mes» o «Resto» | Mosaico y pila juntos en Inicio (repiten lo mismo); sólo el mosaico |
| Cuentas | Carrusel de tarjetas grandes con el saldo debajo (opción B) | Tarjetas numeradas 01, 02… de ahora |
| Destacados (patrimonio, botón principal) | Negro en claro, lima en oscuro | Degradado lila-azul |
| Íconos | Por categoría de gasto; las de siempre traen el suyo, la persona elige de una lista | Sólo las de siempre; emojis (dependen del teléfono) |
| Gastos | En el color del texto; el rosa queda para avisos | Rosa para todo gasto |
| Inicio | Conserva todos sus bloques y su orden | Reordenar o quitar tarjetas |

## Colores

Fichas de la paleta (variables en `:root` y `:root[data-apariencia="oscura"]`):

| Papel | Claro | Oscuro |
|---|---|---|
| `--bg` fondo | #FFFFFF | #000000 |
| `--card` tarjeta | #F4F4F6 | #141416 |
| `--ink` texto | #0B0B0F | #F5F5F7 |
| `--muted` secundario | #66666E (5,3 a 1 sobre #F4F4F6) | #9A9AA2 |
| `--sep` líneas | #E7E7EB | #26262A |
| `--chip` píldora gris | rgba(0,0,0,.07) | rgba(255,255,255,.12) |
| `--acc` acento | #E8F94B (relleno; no se usa como texto sobre blanco) | #E8F94B |
| `--dest` / `--dest-t` destacada y botón | #0B0B0F / #FFFFFF | #E8F94B / #0B0B0F |
| `--logo-punto` | #4C5BD8 | #E8F94B |
| `--verde` relleno / `--verde-t` texto | #34C759 / #1F8A4C | #34C759 / #4ADE80 |
| `--aviso-t` rosa de aviso | #C81E4A | #FF8AA6 |
| barra flotante | #1C1C1E con íconos #8E8E93; activa blanca con ícono #0B0B0F | igual; activa #E8F94B con ícono #0B0B0F |

### Los 19 colores de categoría

Cada color es un degradado. Claro: `linear-gradient` o `radial-gradient(120% 140% at 50% 120%, A 0%, B 40%, C 100%)` con la parte más intensa abajo y la más clara arriba, donde va el texto. Oscuro: igual pero la parte más oscura arriba. Los cinco primeros se fijaron en las previews:

| n | Categoría por defecto | Claro (A → B → C) | Texto | Oscuro (A → B → C) | Texto |
|---|---|---|---|---|---|
| 1 | Supermercado | #9F7FF0 → #C6B0F7 → #EEE7FE (lila) | #16121F | #3E8BFF → #1446D8 → #081A5C (azul) | #FFF |
| 2 | Comida fuera | #B9DE1F → #DDF26B → #F7FCD6 (lima) | #171A06 | #A8DDC0 → #7BBF9E → #4F8F72 (verde agua suave) | #0B1A13 |
| 3 | Delivery | #7C8CFF → #4C5BD8 → #2C37A8 (azul) | #FFF | #FF3D7F → #D10A55 → #560424 (magenta) | #FFF |
| 4 | Transporte | #F2662F → #F58C5E → #FCD8C5 (naranja) | #1A0B05 | #3E9A62 → #1F6E44 → #0A2617 (verde salvia) | #FFF |
| 5 | Ocio | #EE6FA8 → #F5A6C8 → #FDE4EF (rosa) | #1F0A14 | #E0204F → #94082F → #33030F (bordó) | #FFF |

Los colores 6 a 19 se derivan en el preview (Gate 2) de la misma familia, distintos entre sí y de los cinco primeros: cielo, menta, durazno, lavanda, verde agua, índigo, oliva, fucsia, verde, turquesa, mandarina, violeta, gris perla y grafito (en el oscuro, sus versiones profundas). «Resto» del mosaico usa un gris (#BDBDC4 → #D9D9DE → #F1F1F3 / #6A6A72 → #3A3A3E → #1A1A1C). Cada uno lleva su texto blanco u oscuro según el contraste medido **en el peor punto del degradado** (las pruebas lo miden). Se conserva el número de color 1..19 que guarda cada categoría, así que nadie pierde su elección: sólo cambia cómo se pinta cada número.

Variables: `--catN` (color plano medio, para puntos, barras y la fila), `--catNg` (degradado) y `--catNt` (texto), N = 1..19. `colorCat()` sigue devolviendo el número.

Los cinco tipos de cuenta (`COLOR`/`cTipo()`): bancos 1, deudas compartidas 2, inversiones 3, tarjetas 4, financiaciones 5 (`--k1`…`--k5` pasan a apuntar a esos colores y sus degradados).

## Letra

`--font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Roboto", system-ui, sans-serif`. En el iPhone sale SF Pro (no se descarga ni se guarda: es del sistema). Roboto sigue en `vendor/roboto/` y en `FILES` como respaldo. Cifras con `font-variant-numeric: tabular-nums`. Títulos de pantalla de 32 px en negrita con `letter-spacing:-.025em`.

## Íconos

Unos 30 íconos de línea propios (trazo 2, `viewBox 0 0 24 24`), en un `<svg>` de símbolos dentro de `index.html`, sin librerías ni nada de otros sitios. Lista: carrito, cafe, moto, colectivo, entrada, bolsa, remera, brillo, casa, corazon, avion, regalo, copa, maleta, repetir, llave, telefono, maletin, puntos, huella, libro, pesa, nota-musical, gamepad, bebe, auto, nafta, wifi, rayo, gota, pizza, planta. Ingresos (flecha de entrada), transferencias (flechas) y ajuste (cruz) tienen su ícono fijo.

- Modelo: `categorias.gasto[i].icono?: string` (un id de la lista). Opcional: ausente es «el de siempre o ninguno».
- `ICONO_BASE = {"Supermercado":"carrito", …}` por nombre. `iconoDe(nombre)` = el `icono` guardado si es válido; si no, `ICONO_BASE[nombre]`; si no, `null` (se pinta la inicial con `inicial()`).
- `categoriasDatosNorm()` en `norm()`: conserva `icono` sólo si es un string de la lista; si no, lo quita. **No escribe** el ícono por defecto (lo guardado no cambia).
- «Sin ícono» guarda `icono: ""` (vacío = elegido ninguno, para que una de siempre pueda quedar con la inicial); `iconoDe` trata `""` como sin ícono y no cae en `ICONO_BASE`.
- `renombrarCat()`: si la categoría no tenía `icono` guardado y su nombre viejo tenía uno en `ICONO_BASE`, guarda ese id antes de renombrar, para que «Salidas» siga con la entrada.
- Hoja de categoría (`sheetCatEd`): nuevo bloque «Ícono» con una cuadrícula de botones (`data-ui="elegir-icono"`). En las categorías propias (`PROPIAS`) se ve el ícono y no se cambia.

`datos: amplia`: un campo opcional, sin cambio de versión (`v` sigue en 2).

## Inicio

Mismo orden que hoy (avisos, «Fijos y variables», sugerencia de fijo, resultado, gastado/ingresado, por cobrar, disponibles, cuotas, gasto del mes, por semana, ingresos y gastos, patrimonio). Cambian:

- **Resultado** (`data-ui="resultado-mes"`, deja de ser `.card.destacada`): título según tendencia («Te sobraron X €», «Te faltaron X €» con `--aviso-t`, «Sin resultado este mes»), «de X € que entraron», la línea del porcentaje (`porcentajeIng()` sin cambios de cálculo), barra partida y filas (`data-ui="destino-sobrante"`). Se retira `#tendMarca`; `data-tendencia` en `<html>` se mantiene.
- `destinoSobrante(mes)`: recorre las transferencias del mes (`movsMes()`), con `esInv(c)` = tipo inversión y `esAhorro(c)` = destino de algún objetivo o `fondo:true`, y no de inversión. Por transferencia de A a B: si `!esInv(A) && esInv(B)` suma a invertido[B]; si `esInv(A) && !esInv(B)` resta de invertido[A]. Igual con ahorro (con `!esAhorro(A)`, `esAhorro(B)` y a la inversa). Netos por cuenta; filas con total > 0. `sinMover = sobrante − max(0,inv) − max(0,aho)`. Si < 0 → «Moviste X € más de lo que sobró este mes». Colores de la barra y de los cuadraditos de las filas, como en la preview aprobada: invertido con el color 1 (lila en claro, azul en oscuro), ahorrado con el color 4 (naranja en claro, verde salvia en oscuro) y «Sin mover» gris. Íconos de las filas: flecha hacia arriba (invertir), corazón (ahorrar), tarjeta (sin mover).
- «Mover» abre `abrirMov("transferencia", {importe})` con el importe escrito y las cuentas a elegir.
- **Mosaico** (`data-ui="mosaico-categorias"`, reemplaza a `torta()` y a la lista `#cats`): treemap partido en dos columnas de forma recursiva (la mayor categoría en una columna si supera el 40 %; el resto se reparte en filas proporcionales). Hasta 5 categorías + «Resto». El área se comprueba en la prueba con ±3 puntos. Texto que no cabe se oculta (primero porcentaje, luego nombre: queda el ícono).
- «Gastado» lleva punto `--ink`; «Ingresado», punto verde.

## Gasto por categoría

Hoja nueva `#sheetCats2` (`data-pantalla="gasto-categorias"`, `abrirPila(mes)`). Tarjetas `.sc` con `--catNg`, margen negativo para apilar (asoma ~40 px de cada una, la última entera), ícono, nombre, total, chips («60 %», «3 gastos», «Fijo», «+25 % vs sep.») y botón flecha. Tocar → `abrirCat(cat, mes)`; `cerrar()` vuelve a la pila (como `volverCta`).

## Cuentas

`renderCuentas()`: patrimonio (destacada negra/lima), barras (`pintarPatrimonio()`, barra del mes con `--dest`), carrusel `#carCtas` (`data-ui="carrusel-cuentas"`) con `scroll-snap-type:x mandatory`, tarjetas de ~240×230 px con el degradado del tipo, nombre, tipo, tope o límite; puntos `.dots`; debajo, saldo de la centrada, chip de conciliación, «Ver movimientos» (`abrirMovsCta`) y, en inversión, «Ver rendimiento». La centrada se detecta con `IntersectionObserver` o con el `scrollLeft` al terminar el desplazamiento (sin animaciones propias). La lista «Por tipo» reemplaza a los grupos con carrusel numerado.

## Movimientos

`movHTML()`: cuadradito `.tile` de 36 px, radio 11 px, fondo `--catNg`, ícono `<use href="#i-…">` en `--catNt` (o la inicial). Ingreso: tile verde con flecha; transferencia: tile gris con flechas; ajuste: tile gris con cruz. Los días se pintan como grupos `.grp` (radio 22 px) con separadores de 1 px que empiezan después del cuadradito. Importe del gasto en `--ink`.

## Barra y encabezado

Barra inferior: píldora `#1C1C1E` flotante a 16 px de los bordes y del área segura inferior, con las cuatro pestañas (ícono + nombre de 10 px) y el «+» central en `--acc`. El contenido deja espacio al final para que la barra no tape la última tarjeta. Encabezado: «≡» a la izquierda, selector de mes y botones a la derecha en una fila; debajo, el título grande (en Inicio, «mf.» con el punto en `--logo-punto`).

## Se retira

`--grad`, `--grad-suave`, `--grad-t`, `--rosa` como color de gasto (queda como `--aviso-t`), `.card.destacada` en Inicio, `#tendMarca`, `torta()`, la lista `#cats`, las tarjetas numeradas `.cta`, la sombra `--sombra`.

## Lo que se mantiene

Los `data-pantalla` y `data-ui` existentes que no se retiran arriba. `esc()` en todo texto de la persona (nombres de cuenta, categoría, objetivo y notas en el mosaico, la pila, el destino del sobrante y el carrusel). La apariencia guardada y su resolución en el `<head>`. `theme-color` toma el `--bg`.

## Versión de la caché

`sw.js`: `CACHE` de `finanzas-v52` a `finanzas-v53` (o el siguiente libre al construir). No hay ficheros nuevos: los íconos van dentro de `index.html`.

## Riesgos

- Contraste en degradados: el texto oscuro sobre la parte intensa del claro y el blanco sobre la parte clara del oscuro. Las pruebas miden el peor punto; si algún color no llega, se oscurece/aclara ese extremo del degradado en el preview.
- El mosaico con muchas categorías chicas: bloques muy finos. Por eso tope de 5 + «Resto».
- Tests existentes que buscan la torta, `.cta`, la destacada de Inicio o el rosa en los gastos: se actualizan con el cambio (sus requisitos se sustituyen en el delta).
