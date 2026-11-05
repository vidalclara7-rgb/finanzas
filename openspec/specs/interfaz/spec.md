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
- **Entonces** el título dice «Ajustes» y se ve la apariencia
- **Y** no se ve el plan del fondo, que ahora está en los objetivos

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

Los títulos de las pantallas y de las hojas y las cifras grandes (el resultado del mes, el patrimonio y los totales) usan la letra Archivo en negrita fuerte, que va guardada dentro de la app. El texto usa la letra del sistema, y los importes de las listas, los porcentajes y los datos pequeños, una monoespaciada.

### Escenario: títulos en Archivo
- **Dado** la app abierta en Inicio
- **Cuando** la persona mira el título «Este mes» y abre la hoja de nuevo gasto
- **Entonces** el título y el de la hoja usan Archivo en negrita fuerte

### Escenario: cifras grandes y datos pequeños
- **Dado** la app con un gasto este mes
- **Cuando** la persona mira el resultado del mes en Inicio y el importe en Movimientos
- **Entonces** el resultado usa Archivo y el importe de la lista, la monoespaciada
- **Y** los textos usan la letra del sistema

### Escenario: sin letras de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio

### Escenario: la letra funciona sin conexión
- **Dado** la app ya abierta una vez
- **Cuando** la persona la vuelve a abrir sin conexión
- **Entonces** los títulos siguen usando Archivo

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

### Escenario: mes en un objetivo
- **Dado** la hoja «Nuevo objetivo» abierta a 390 px
- **Cuando** la persona mira «Mes del primer aporte» y «Fecha límite»
- **Entonces** los dos campos caben en la hoja
- **Y** no hay desplazamiento horizontal

## Requisito: todo se lee sobre el fondo

En las dos apariencias, los importes principales y el texto de las tarjetas se leen con un contraste de al menos
4,5 a 1, y las dos partes de la barra de fijos y variables se distinguen de su tarjeta (al menos 1,5 a 1: el dato está
en el texto que la acompaña).

### Escenario: contraste en las dos apariencias
- **Dado** gastos fijos y variables, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas y Cierre en las apariencias Clara y Oscura
- **Entonces** el resultado, el disponible, el patrimonio y el texto de las tarjetas tienen contraste de al menos 4,5 a 1, y las dos partes de la barra de fijos y variables, de al menos 1,5 a 1 contra su tarjeta

## Requisito: el logo «mf.» dentro de la app

El encabezado de Inicio muestra el monograma «mf.» en Archivo: las letras en el color del texto y el punto en lima (#B2FF00 en la oscura, #8CCB00 en la clara).

### Escenario: logo en Inicio
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el encabezado muestra «mf.» con el punto lima #B2FF00

### Escenario: el logo sigue a la apariencia
- **Dado** el logo en Inicio
- **Cuando** la persona cambia a la apariencia Clara
- **Entonces** las letras pasan a #13131A y el punto a #8CCB00

## Requisito: color por categoría

Cada gasto es una tarjeta del color de su categoría, el mismo en la torta, en la lista y en el icono. Los 19 colores son los de la paleta de gráficos del sistema de diseño, con su versión clara y oscura: cada categoría conserva su color de un mes a otro. El texto de la tarjeta es blanco u oscuro, el que mejor se lee sobre ese color, con contraste de al menos 4,5 a 1.

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la tarjeta del gasto en Movimientos
- **Entonces** la porción de Supermercado y la tarjeta del gasto tienen el mismo color

### Escenario: texto legible en las tarjetas
- **Dado** un gasto en cada categoría
- **Cuando** la persona recorre Movimientos en las apariencias Oscura y Clara
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1 con su color

### Escenario: reembolsos distinguibles
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su tarjeta tiene el color propio de esa categoría y distinto del de Compras

### Escenario: el color no cambia de un mes a otro
- **Dado** un gasto en Alquiler en octubre y otro en septiembre, y Alquiler con más gasto en un mes que en el otro
- **Cuando** la persona mira Movimientos en cada mes
- **Entonces** las tarjetas de Alquiler tienen el mismo color en los dos meses

## Requisito: panel de análisis

Un botón «≡» a la izquierda del encabezado, en todas las pantallas, abre un panel lateral con cuatro entradas: Objetivos, Forecast, Inversiones
y Radar de noticias. Objetivos abre la lista de objetivos de ahorro; Forecast abre la proyección; Inversiones abre el rendimiento de las
cuentas de inversión; Radar de noticias está deshabilitada y dice «Próximamente». El panel se cierra al elegir una entrada, al tocar fuera
de él o con Escape.

### Escenario: abrir y cerrar el panel
- **Dado** la app abierta en Inicio
- **Cuando** la persona toca «≡» y después toca fuera del panel
- **Entonces** ve el panel con «Objetivos», «Forecast», «Inversiones» y «Radar de noticias» y después deja de verlo

### Escenario: el botón está en todas las pantallas
- **Dado** la app abierta
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre y Ajustes
- **Entonces** ve el botón «≡» en cada una

### Escenario: ir a Objetivos
- **Dado** el panel abierto
- **Cuando** la persona toca «Objetivos»
- **Entonces** el panel se cierra y se abre la hoja «Objetivos»

### Escenario: ir a Forecast
- **Dado** el panel abierto
- **Cuando** la persona toca «Forecast»
- **Entonces** el panel se cierra y se abre la hoja Forecast

### Escenario: ir a Inversiones
- **Dado** una cuenta de inversión y el panel abierto
- **Cuando** la persona toca «Inversiones»
- **Entonces** el panel se cierra y se abre el rendimiento de las inversiones

### Escenario: Inversiones sin cuentas de inversión
- **Dado** que la persona no tiene cuentas de inversión y el panel abierto
- **Cuando** toca «Inversiones»
- **Entonces** la app avisa «No tenés cuentas de inversión. Agregá una en Cuentas.» y no abre nada

### Escenario: el radar todavía no está
- **Dado** el panel abierto
- **Cuando** la persona toca «Radar de noticias»
- **Entonces** no pasa nada: está deshabilitada y dice «Próximamente»

### Escenario: el encabezado cabe en 390 px
- **Dado** un ancho de 390 px
- **Cuando** la persona abre Inicio y Movimientos
- **Entonces** el botón «≡», el logo o el título, el selector de mes y los botones de la derecha caben sin desbordar el ancho

## Requisito: tarjetas de vidrio

Las tarjetas son de vidrio: translúcidas, con el fondo desenfocado detrás, un borde fino y las esquinas redondeadas, sin degradado. Las cuentas y los grupos que antes llevaban un color sólido por tipo (bancos, inversiones, tarjetas, financiaciones y deudas compartidas) llevan ahora un punto de ese color junto al título de la tarjeta. El título de cada tarjeta usa el color de etiqueta de la apariencia. El texto se lee con contraste de al menos 4,5 a 1.

### Escenario: el vidrio deja ver el fondo
- **Dado** una tarjeta de Inicio
- **Cuando** la persona la mira
- **Entonces** su fondo es translúcido y desenfoca lo que tiene detrás

### Escenario: sin degradados en las tarjetas
- **Dado** el disponible de una tarjeta de crédito con tope y «Cuotas del mes»
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de las tarjetas no tiene degradado

### Escenario: punto de color por tipo de cuenta
- **Dado** una cuenta de bancos y una tarjeta de crédito
- **Cuando** la persona abre Cuentas
- **Entonces** cada una lleva un punto del color de su tipo junto al título, y los dos colores son distintos

### Escenario: el texto se lee sobre el vidrio
- **Dado** tarjetas de Inicio, Cuentas y Cierre
- **Cuando** la persona las mira en las apariencias Clara y Oscura
- **Entonces** el texto de cada tarjeta tiene contraste de al menos 4,5 a 1 con lo que tiene detrás

## Requisito: tarjeta destacada

El patrimonio neto de Cuentas y el resultado del mes de Inicio son tarjetas destacadas: vidrio más translúcido, con un borde de color que gira despacio y un foco de luz que sigue el dedo mientras toca la tarjeta y se apaga al soltar. Con «Reducir movimiento», el borde queda quieto.

### Escenario: tarjetas destacadas
- **Dado** la app con datos de ejemplo
- **Cuando** la persona abre Inicio y Cuentas
- **Entonces** el resultado del mes y el patrimonio neto son tarjetas destacadas
- **Y** las demás tarjetas son de vidrio estándar

### Escenario: el borde gira
- **Dado** el teléfono sin «Reducir movimiento»
- **Cuando** la persona mira una tarjeta destacada
- **Entonces** su borde de color está girando

### Escenario: borde quieto con reducir movimiento
- **Dado** el teléfono con «Reducir movimiento» activado
- **Cuando** la persona mira una tarjeta destacada
- **Entonces** su borde de color está quieto

### Escenario: el foco sigue el dedo
- **Dado** una tarjeta destacada
- **Cuando** la persona la toca y la mantiene
- **Entonces** aparece un foco de luz en el punto tocado
- **Y** al soltar, el foco se apaga

## Requisito: botón principal

El botón principal de cada hoja y pantalla es una píldora lima (#B2FF00) con texto oscuro (#13131A) y una sombra lima que pulsa despacio. El botón secundario es de vidrio. Con «Reducir movimiento» no hay pulso.

### Escenario: botón lima
- **Dado** la hoja «Nuevo movimiento» abierta
- **Cuando** la persona mira «Guardar»
- **Entonces** es una píldora lima con texto oscuro

### Escenario: el botón pulsa
- **Dado** el teléfono sin «Reducir movimiento»
- **Cuando** la persona mira un botón principal
- **Entonces** su sombra está pulsando

### Escenario: sin pulso con reducir movimiento
- **Dado** el teléfono con «Reducir movimiento» activado
- **Cuando** la persona mira un botón principal
- **Entonces** su sombra no pulsa

### Escenario: botón secundario de vidrio
- **Dado** una hoja con un botón secundario, como «Cerrar»
- **Cuando** la persona lo mira
- **Entonces** es de vidrio y no lima

## Requisito: tendencia del mes

El brillo de la forma del fondo, el foco de la tarjeta destacada y el texto de variación siguen la tendencia del mes que se ve: positiva si el resultado (ingresos menos gastos) es mayor que 0, negativa si es menor que 0, neutra si es 0 o no hay datos. En la forma del fondo y en el foco, la positiva usa el verde lima, la negativa el rojo y la neutra el violeta del sistema; el resultado del mes se escribe en verde si es positivo, en rojo si es negativo y en el color del texto si es neutro.

### Escenario: tendencia positiva
- **Dado** ingresos de 1500 € y gastos de 100 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** la tendencia es positiva y el resultado usa el color positivo

### Escenario: tendencia negativa
- **Dado** ingresos de 100 € y gastos de 300 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** la tendencia es negativa y el resultado usa el color negativo

### Escenario: tendencia neutra
- **Dado** un mes sin movimientos
- **Cuando** la persona abre Inicio
- **Entonces** la tendencia es neutra

### Escenario: la tendencia cambia con el mes que se ve
- **Dado** un mes con resultado positivo y el anterior con resultado negativo
- **Cuando** la persona pasa de uno a otro con el selector de mes
- **Entonces** la tendencia cambia con el mes que se ve

## Requisito: muestras de color

Los 19 colores de categoría salen de la paleta de gráficos del sistema, en la versión de cada apariencia, y son todos distintos entre sí. Los cinco tipos de cuenta usan los colores principales de esa paleta como punto de color junto al título de la tarjeta: violeta para bancos, cielo para inversiones, coral para tarjetas, lavanda para financiaciones y lima para deudas compartidas.

### Escenario: 19 colores distintos
- **Dado** la app abierta
- **Cuando** se comparan los colores de las 19 categorías en la apariencia Clara y en la Oscura
- **Entonces** en cada una son 19 colores distintos

### Escenario: 5 colores por tipo de cuenta
- **Dado** la app abierta
- **Cuando** se comparan los colores de los cinco tipos de cuenta
- **Entonces** son cinco colores distintos en cada apariencia

### Escenario: colores de la paleta de gráficos
- **Dado** la apariencia Oscura
- **Cuando** se miran los colores de las categorías Supermercado, Comida fuera y Delivery
- **Entonces** son el violeta #8450FC, la lima #B2FF00 y el azul cielo #1AAEFC del sistema
