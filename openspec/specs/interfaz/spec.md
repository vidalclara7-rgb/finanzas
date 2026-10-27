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

La app se ve en la apariencia que la persona elige (Oscura, Clara o Automática). En la oscura, y en la automática con
el teléfono en modo oscuro, el fondo es oscuro y todos los textos principales se leen con buen contraste.

### Escenario: teléfono en modo oscuro
- **Dado** «Automática» elegida y el teléfono en modo oscuro
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

Cada categoría de gasto nueva tiene un color fijo, distinto del de las demás, que es el mismo en la torta, en la lista
de categorías y en las tarjetas de movimiento. En las dos apariencias, el texto de sus tarjetas se lee con contraste de
al menos 4,5 a 1.

### Escenario: color en la torta y en la tarjeta
- **Dado** un gasto de 30 € en Alquiler este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** el color de «Alquiler» es el mismo en la torta, la lista y el icono de la tarjeta
- **Y** no coincide con el de otra categoría

### Escenario: contraste con cada categoría nueva
- **Dado** un gasto en cada categoría nueva
- **Cuando** la persona recorre Movimientos en las apariencias Clara y Oscura
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1

## Requisito: los campos de fecha caben en el ancho

Los campos de fecha y de mes de las hojas ocupan el ancho de la hoja, sin salirse por ningún lado, en ancho de
iPhone.

### Escenario: fecha de un movimiento
- **Dado** la hoja «Nuevo movimiento» abierta a 390 px
- **Cuando** la persona mira el campo «Fecha»
- **Entonces** su borde derecho no supera el borde derecho de la hoja
- **Y** no hay desplazamiento horizontal

### Escenario: fecha de una operación de inversión
- **Dado** la hoja «Nueva operación» abierta a 390 px
- **Cuando** la persona mira el campo «Fecha»
- **Entonces** su borde derecho no supera el borde derecho de la hoja

### Escenario: mes en Ajustes
- **Dado** Ajustes abierto a 390 px
- **Cuando** la persona mira «Mes del primer aporte»
- **Entonces** el campo cabe en su tarjeta

## Requisito: tarjetas neutras sobre el fondo de manchas

Una sola paleta con dos temas, tomados de dos moodboards: la clara en oliva, vino, azul polvo y naranja quemado sobre
crema rosado; la oscura en cereza, chartreuse, rosa y óxido sobre vino muy oscuro. Las tarjetas son neutras y
translúcidas, sin colores vivos: oscuras en la apariencia oscura y blancas, de vidrio esmerilado, en la clara. El color
queda para lo que lo necesita: cada categoría tiene su color, el mismo en la torta, en la lista, en el icono y en el
borde de su tarjeta de movimiento, y cada tipo de cuenta tiene el suyo en la franja de su tarjeta. Los importes
principales son grandes, con los decimales en gris. El texto de las tarjetas es claro en la oscura y oscuro en la clara.

### Escenario: tarjetas neutras sobre el fondo oscuro
- **Dado** la apariencia Oscura y una tarjeta de crédito con tope
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es oscuro, y las tarjetas «Gasto del mes» y el disponible de la tarjeta tienen un fondo neutro oscuro, sin color de categoría
- **Y** el resultado del mes se ve grande con los decimales en gris

### Escenario: tarjetas neutras sobre el fondo claro
- **Dado** la apariencia Clara y una tarjeta de crédito con tope
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es crema rosado y las tarjetas son blancas y translúcidas

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y el icono de su tarjeta tienen el mismo color

### Escenario: texto legible en las tarjetas
- **Dado** un gasto en Compras este mes
- **Cuando** la persona abre Movimientos, en la apariencia Oscura y en la Clara
- **Entonces** el texto de su tarjeta se lee con contraste de al menos 4,5 a 1 con lo que tiene detrás

### Escenario: reembolsos distinguibles
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su tarjeta tiene el color propio de esa categoría y distinto del de Compras

## Requisito: todo se lee sobre el fondo

En las dos apariencias, con el fondo de manchas detrás, los importes principales y el texto de las tarjetas se leen con
un contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables se distinguen de su tarjeta (al
menos 1,5 a 1: el dato está en el texto que la acompaña).

### Escenario: contraste en las dos apariencias
- **Dado** gastos fijos y variables, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas y Cierre en las apariencias Clara y Oscura
- **Entonces** el resultado, el disponible, el patrimonio y el texto de las tarjetas tienen contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables, de al menos 1,5 a 1 contra su tarjeta
