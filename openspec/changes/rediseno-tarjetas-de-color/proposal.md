---
cambio: rediseno-tarjetas-de-color
estado: diseno-aprobado
datos: amplia
---
# Rediseño: blanco y negro, tarjetas de color y qué hiciste con lo que sobró

## Por qué

La persona no está conforme con el aspecto actual (fondo azul en el oscuro, degradado azul y violeta) y lo revisó con previews a partir de dos referencias: una lista de tarjetas de color apiladas y un carrusel de tarjetas grandes. Quiere una app con aire de app de Apple: fondo blanco en el claro y **negro** en el oscuro, esquinas muy redondeadas, tarjetas de color con degradado y un ícono por gasto para reconocerlo de un vistazo.

Además, el resultado del mes en grande («+916 €») no le dice nada. Le importa saber **qué hizo con lo que sobró**: cuánto mandó a inversiones, cuánto a ahorro y cuánto quedó sin mover. Y la torta queda apretada.

## Qué cambia

- **Paleta nueva.** Claro: fondo blanco, tarjetas gris muy claro, texto casi negro. Oscuro: fondo negro, tarjetas gris muy oscuro, texto casi blanco. Sin sombras. Acento lima.
- **Colores de categoría con degradado.** Los 19 colores se rehacen: en el claro, pasteles y vivos (lila, lima, azul, naranja, rosa…); en el oscuro, tonos profundos sobre negro (azul, verde agua suave, magenta, verde salvia, bordó…). Cada categoría conserva su color todos los meses.
- **Ícono por categoría.** Cada categoría de gasto lleva un ícono dibujado por la app (café, carrito, colectivo…). Las de siempre traen el suyo, y la persona puede elegir otro de una lista para cualquier categoría. Sin ícono elegido, se ve la inicial.
- **Letra del sistema.** En el iPhone, la del sistema (SF Pro); en otros teléfonos, Roboto, que sigue dentro de la app.
- **Títulos grandes, barra flotante.** El título de cada pantalla es grande y está alineado a la izquierda. La barra inferior es una píldora oscura flotante, con «+» en el centro.
- **Destacados en negro y lima.** El patrimonio de Cuentas y el botón principal van negros en el claro y lima en el oscuro. Se retira el degradado azul y violeta.
- **Gastos en el color del texto.** Los gastos dejan de ser rosa: se escriben en el color del texto. Los ingresos siguen en verde. El rosa queda sólo para avisos: un tope excedido o un mes en negativo.
- **Inicio** conserva todos sus bloques y su orden, salvo dos:
  - El resultado del mes pasa a **«Te sobraron X €»**, con una barra partida y una fila por destino: **Invertiste** (lo transferido a cuentas de inversión, con el detalle por cuenta), **Ahorraste** (lo transferido a las cuentas de los objetivos y al fondo de emergencia) y **Sin mover**, con un botón «Mover» que abre una transferencia. Se calcula con los movimientos que ya se anotan.
  - La torta pasa a un **mosaico**: un bloque por categoría, de tamaño proporcional a lo gastado, con las cinco más grandes y «Resto».
- **Gasto por categoría** (nueva hoja). Al tocar «Gasto del mes» o «Resto» se abre una hoja con todas las categorías del mes en **tarjetas de color apiladas**, de mayor a menor: ícono, nombre, total, porcentaje del mes, cantidad de gastos y cambio frente al mes anterior. Tocar una abre su hoja, como hoy.
- **Cuentas**: un carrusel de tarjetas grandes, una por cuenta y del color de su tipo. Debajo de la tarjeta centrada se ve su saldo en grande, su estado de conciliación y «Ver movimientos». Arriba siguen el patrimonio y sus barras.
- **Movimientos**: lista agrupada estilo iOS. Cada fila lleva un cuadradito redondeado del color de su categoría con su ícono.

## A quién afecta

A todas las personas que usan la app: cambia el aspecto de todas las pantallas. La apariencia elegida (Oscura, Clara o Automática) se conserva.

Lo guardado sigue valiendo (`datos: amplia`). Las categorías de gasto pueden guardar un ícono elegido. Quien no elige ninguno ve el de siempre o la inicial, sin que la app reescriba nada. El ícono viaja en la copia de seguridad, y uno inválido se ignora.

## Pantallas

- **Cambian de disposición:** Inicio (resultado y mosaico), Cuentas (carrusel) y Movimientos (filas con ícono).
- **Nueva:** la hoja «Gasto por categoría».
- **Se amplía:** la hoja de una categoría en Ajustes, que suma la elección de «Ícono».
- **Cambian de aspecto:** todas las demás (Cierre, Ajustes, panel «≡», hojas de movimiento, cuenta, objetivos, forecast, importación…).

## Fuera de alcance

- El ícono de la app en la pantalla de inicio del teléfono no cambia.
- Íconos para las categorías de ingreso: los ingresos llevan un ícono fijo de entrada, en verde.
- Logos o fotos de comercios: la app no carga nada de otros sitios.
- Cambiar qué se calcula en las demás tarjetas, el forecast, los objetivos o la importación.
- Animaciones: el carrusel se desliza con el dedo y nada se mueve solo.
