# Capacidad: interfaz

## Requisito: se usa cómodo en un iPhone

Todas las pantallas entran en 390 px de ancho sin desplazamiento horizontal, y los textos están en
castellano rioplatense.

### Escenario: ninguna pantalla se desborda
- **Dado** la app con los datos de ejemplo en un teléfono de 390 px de ancho
- **Cuando** la persona recorre Inicio, Gastos, Cuentas, Mes y Ajustes
- **Entonces** ninguna pantalla tiene desplazamiento horizontal

## Requisito: navegación

Una barra inferior lleva a Inicio, Movimientos, Cuentas y Cierre, con el botón «+» en el centro.
Ajustes se abre con el engranaje del encabezado. El «+» abre «Nuevo movimiento», salvo en Cuentas,
donde abre «Nueva cuenta». El título del encabezado cambia con la pantalla.

### Escenario: el más según la pantalla
- **Dado** la app abierta en Inicio con al menos una cuenta
- **Cuando** la persona toca «+», cierra, va a Cuentas y vuelve a tocar «+»
- **Entonces** primero se abre «Nuevo movimiento» y después «Nueva cuenta»

### Escenario: ajustes desde el engranaje
- **Dado** la app abierta en Inicio
- **Cuando** la persona toca el engranaje
- **Entonces** el título dice «Ajustes» y se ve el plan del fondo

### Escenario: nombres de las pestañas
- **Dado** la app abierta
- **Cuando** la persona mira la barra inferior
- **Entonces** ve «Inicio», «Movimientos», «Cuentas» y «Cierre»

## Requisito: modo oscuro

La app sigue el modo claro u oscuro del teléfono. En oscuro el fondo es oscuro y todos los textos
principales se leen con buen contraste.

### Escenario: teléfono en modo oscuro
- **Dado** el teléfono en modo oscuro
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es oscuro
- **Y** los importes de Inicio tienen un contraste de al menos 4,5 a 1 con su fondo

## Requisito: funciona sin conexión

Después de abrirla una vez con conexión, la app abre y funciona sin conexión.

### Escenario: abrir sin conexión
- **Dado** la app abierta una vez con conexión
- **Cuando** el teléfono se queda sin conexión y la persona vuelve a abrir la app
- **Entonces** la app abre y muestra Inicio con sus datos

## Requisito: una sola letra en toda la app

Los títulos de las pantallas y de las hojas usan la misma letra que el resto del texto, en negrita.

### Escenario: títulos con la letra del texto
- **Dado** la app abierta en Inicio
- **Cuando** la persona mira el título «Este mes» y abre la hoja de nuevo gasto
- **Entonces** el título y el de la hoja usan la misma letra que el resto del texto

## Requisito: fondo blanco con acentos

En modo claro el fondo es gris muy claro y las tarjetas llevan color: el disponible de cada cuenta y
los grupos de Cuentas, el de su tipo (bancos salvia, inversiones verde oliva, tarjetas cherry,
financiaciones fucsia, deudas compartidas rosa); «Por semana» rosa claro, «Ingresos y gastos»
salvia, la conciliación verde oliva y el checklist rosa. «Gasto del mes» es blanca, para que se lean
los colores de la torta. La paleta es viva: rojo anaranjado, cherry, frambuesa, rosa chicle, fucsia,
verde oliva oscuro y salvia. Cada categoría tiene su color, el mismo en la torta, en la lista y en su
tarjeta de movimiento; sobre los colores oscuros el texto es blanco y sobre los claros, oscuro. Los
importes principales son grandes, con los decimales en gris.

### Escenario: fondo gris claro con tarjetas de color
- **Dado** el teléfono en modo claro y una tarjeta de crédito con tope
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es gris muy claro, la tarjeta «Gasto del mes» es blanca y la del disponible de la tarjeta es cherry
- **Y** el resultado del mes se ve grande con los decimales en gris

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y su tarjeta tienen el mismo color

### Escenario: texto legible sobre colores oscuros
- **Dado** un gasto en Compras este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el texto de su tarjeta cherry es blanco y se lee con contraste de al menos 4,5 a 1

### Escenario: reembolsos en frambuesa
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su tarjeta es frambuesa con texto blanco

## Requisito: elegir la paleta de colores

En Ajustes, «Paleta de colores» ofrece cuatro paletas, cada una con su nombre y una muestra de sus
colores: Viva, Editorial, Lima y lavanda y Pastel crema. Al elegir una, toda la app cambia de colores
al instante, y la elección se recuerda al volver a abrir. Sin elección, la paleta es Viva.

### Escenario: cambiar a pastel crema
- **Dado** la app en la paleta Viva
- **Cuando** la persona elige «Pastel crema» en Ajustes
- **Entonces** el fondo de la pantalla pasa a crema y la opción queda marcada

### Escenario: la paleta se recuerda
- **Dado** la paleta Editorial elegida
- **Cuando** la persona vuelve a abrir la app
- **Entonces** la app se ve con la paleta Editorial

### Escenario: paleta por defecto
- **Dado** una app recién abierta, sin datos
- **Cuando** la persona abre Ajustes
- **Entonces** la paleta marcada es Viva

## Requisito: todas las paletas se leen

En cada paleta, en modo claro y en modo oscuro, los importes principales y el texto de las tarjetas
de color se leen con un contraste de al menos 4,5 a 1, las dos partes de la barra de fijos y
variables se distinguen de su tarjeta (al menos 1,5 a 1: el dato está en el texto que la acompaña), y cada categoría conserva el mismo color en la
torta y en su tarjeta de movimiento.

### Escenario: contraste en las cuatro paletas
- **Dado** gastos fijos y variables, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre las cuatro paletas en claro y en oscuro
- **Entonces** en todas el resultado, el disponible, el patrimonio y el texto de las tarjetas de movimiento tienen contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables, de al menos 1,5 a 1 contra su tarjeta

### Escenario: mismo color por categoría en otra paleta
- **Dado** un gasto en Supermercado y la paleta Lima y lavanda elegida
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y su tarjeta tienen el mismo color

## Requisito: los avisos no tapan botones

Con una hoja abierta, los avisos de la app («Gasto guardado», «4 movimientos importados»…) aparecen
arriba de la pantalla, sin tapar ningún botón de la hoja. Sin hoja abierta, aparecen sobre la barra de
navegación.

### Escenario: aviso con la hoja abierta
- **Dado** un extracto recién importado, con la hoja «Extracto importado» abierta
- **Cuando** aparece el aviso «2 movimientos importados»
- **Entonces** el aviso no se superpone con ningún botón de la hoja

## Requisito: importes con coma decimal

Todos los campos de importe (movimientos, cuentas, conciliación y ajustes) se escriben con coma
decimal, como en el teclado del iPhone («12,50»). También se acepta el punto. Al editar, el importe
guardado se muestra con coma.

### Escenario: gasto con coma
- **Dado** la hoja de gasto abierta
- **Cuando** la persona escribe «12,50» en el importe y guarda
- **Entonces** el gasto queda en 12,5 €

### Escenario: saldo de una cuenta con coma
- **Dado** la hoja «Nueva cuenta» abierta
- **Cuando** la persona crea «Banco B» con saldo «1.234,56»
- **Entonces** Banco B tiene 1234,56 €

### Escenario: importe guardado al editar
- **Dado** un gasto de 12,50 €
- **Cuando** la persona lo abre para editarlo
- **Entonces** el importe dice «12,5»

## Requisito: ícono de la app

El ícono de la pantalla de inicio es el monograma «mf.»: las letras en negro sobre rosa chicle y el
punto en rojo anaranjado, el mismo en todos los tamaños que usa la app.

### Escenario: ícono en la pantalla de inicio
- **Dado** la app publicada
- **Cuando** la persona la agrega a la pantalla de inicio
- **Entonces** el ícono tiene fondo rosa chicle, las letras «mf» en negro y el punto en rojo anaranjado

### Escenario: mismo ícono en todos los tamaños
- **Dado** los íconos de 180, 192 y 512 px
- **Cuando** se comparan
- **Entonces** los tres tienen los mismos colores en los mismos lugares

## Requisito: las categorías nuevas tienen color propio

Cada categoría de gasto nueva tiene un color fijo, distinto del de las demás, que es el mismo en la
torta, en la lista de categorías y en las tarjetas de movimiento. En cualquier paleta, claro u oscuro,
los importes y el texto de sus tarjetas se leen con contraste de al menos 4,5 a 1.

### Escenario: color en la torta y en la tarjeta
- **Dado** un gasto de 30 € en Alquiler este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** el color de «Alquiler» es el mismo en la torta, la lista y la tarjeta
- **Y** no coincide con el de otra categoría

### Escenario: contraste en las cuatro paletas
- **Dado** un gasto en cada categoría nueva
- **Cuando** la persona recorre las cuatro paletas en claro y en oscuro
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1
