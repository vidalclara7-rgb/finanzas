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

Todos los textos de la app usan la letra Roboto, guardada dentro de la app, en cinco pesos: fino, normal, medio, seminegrita y negrita. Los títulos y las cifras grandes van en medio o negrita; los importes, porcentajes y datos pequeños llevan cifras de ancho fijo para que se alineen.

### Escenario: títulos en Roboto
- **Dado** la app abierta en Inicio
- **Cuando** la persona mira el título de la pantalla y abre la hoja de nuevo gasto
- **Entonces** el título y el de la hoja usan Roboto

### Escenario: cifras grandes y datos pequeños
- **Dado** la app con un gasto este mes
- **Cuando** la persona mira el resultado del mes en Inicio y el importe en Movimientos
- **Entonces** el resultado usa Roboto en negrita y el importe de la lista, Roboto con cifras de ancho fijo

### Escenario: sin letras de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio

### Escenario: la letra funciona sin conexión
- **Dado** la app ya abierta una vez
- **Cuando** la persona la vuelve a abrir sin conexión
- **Entonces** los títulos siguen usando Roboto

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

El encabezado de Inicio muestra el monograma «mf.» en Roboto negrita: las letras en el color del texto y el punto con el degradado del sistema.

### Escenario: logo en Inicio
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el encabezado muestra «mf.» con las letras en #151C2A y el punto con el degradado

### Escenario: el logo sigue a la apariencia
- **Dado** el logo en Inicio
- **Cuando** la persona cambia a la apariencia Oscura
- **Entonces** las letras pasan a #F1F0F2

## Requisito: color por categoría

Cada categoría de gasto tiene su color, el mismo en la torta, en el círculo de cada fila de la lista y en las barras de categoría. Los 19 colores son los de la paleta de gráficos del sistema de diseño, con su versión clara y oscura: cada categoría conserva su color de un mes a otro. La inicial de la categoría dentro del círculo es blanca u oscura, la que mejor se lee sobre ese color, con contraste de al menos 4,5 a 1. Las filas de la lista son blancas: ya no hay una tarjeta de color por gasto.

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira la torta de Inicio y la fila del gasto en Movimientos
- **Entonces** la porción de Supermercado y el círculo de la fila tienen el mismo color

### Escenario: inicial legible en el círculo
- **Dado** un gasto en cada categoría
- **Cuando** la persona recorre Movimientos en las apariencias Oscura y Clara
- **Entonces** la inicial de cada círculo tiene contraste de al menos 4,5 a 1 con su color

### Escenario: reembolsos distinguibles
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su círculo tiene el color propio de esa categoría y distinto del de Compras

### Escenario: el color no cambia de un mes a otro
- **Dado** un gasto en Alquiler en octubre y otro en septiembre, y Alquiler con más gasto en un mes que en el otro
- **Cuando** la persona mira Movimientos en cada mes
- **Entonces** los círculos de Alquiler tienen el mismo color en los dos meses

### Escenario: filas blancas
- **Dado** un gasto este mes
- **Cuando** la persona abre Movimientos en la apariencia Clara
- **Entonces** la fila del gasto tiene el fondo de la tarjeta y no el color de su categoría

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

## Requisito: tarjeta destacada

El resultado del mes de Inicio y el patrimonio neto de Cuentas son tarjetas destacadas: llevan el degradado del sistema de fondo y el texto en blanco, con contraste de al menos 4,5 a 1 en el punto del degradado donde peor se lee. No se mueven ni reaccionan al dedo con ningún efecto. Las demás tarjetas son blancas.

### Escenario: tarjetas destacadas
- **Dado** la app con datos de ejemplo
- **Cuando** la persona abre Inicio y Cuentas
- **Entonces** el resultado del mes y el patrimonio neto tienen fondo de degradado
- **Y** las demás tarjetas son blancas

### Escenario: el texto de la destacada se lee
- **Dado** una tarjeta destacada
- **Cuando** la persona la mira en las dos apariencias
- **Entonces** su texto blanco tiene contraste de al menos 4,5 a 1 con el punto más claro de su degradado

### Escenario: la destacada no se mueve
- **Dado** una tarjeta destacada
- **Cuando** la persona la toca y la mantiene
- **Entonces** no aparece ningún foco ni cambia el borde

## Requisito: botón principal

El botón principal de cada hoja y pantalla es una píldora con el degradado del sistema y texto blanco, con contraste de al menos 4,5 a 1. El botón secundario es una píldora de tarjeta con borde fino. Ningún botón pulsa ni se anima.

### Escenario: botón con degradado
- **Dado** la hoja «Nuevo movimiento» abierta
- **Cuando** la persona mira «Guardar»
- **Entonces** es una píldora con degradado y texto blanco

### Escenario: el botón no se anima
- **Dado** un botón principal a la vista
- **Cuando** la persona lo mira dos segundos
- **Entonces** no tiene ninguna animación en marcha

### Escenario: botón secundario
- **Dado** una hoja con un botón secundario, como «Cerrar»
- **Cuando** la persona lo mira
- **Entonces** es una píldora de tarjeta con borde fino y no de degradado

## Requisito: tendencia del mes

El texto del resultado y la variación siguen la tendencia del mes que se ve: positiva si el resultado (ingresos menos gastos) es mayor que 0, negativa si es menor que 0, neutra si es 0 o no hay datos. En la tarjeta destacada, el resultado va en blanco; junto a él, una marca dice si el mes va en verde (positivo), en rosa (negativo) o neutra. En el resto de las tarjetas, el resultado se escribe en el verde de texto si es positivo, en el rosa de texto si es negativo y en el color del texto si es neutro.

### Escenario: tendencia positiva
- **Dado** ingresos de 1500 € y gastos de 100 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** la tendencia es positiva y la marca del resultado es verde

### Escenario: tendencia negativa
- **Dado** ingresos de 100 € y gastos de 300 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** la tendencia es negativa y la marca del resultado es rosa

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

## Requisito: tarjetas blancas

Las tarjetas son blancas en la apariencia Clara y azules en la Oscura, con las esquinas muy redondeadas, una sombra suave y sin desenfoque ni borde. Las cuentas y los grupos de cada tipo (bancos, inversiones, tarjetas, financiaciones y deudas compartidas) llevan un punto de su color junto al título de la tarjeta. El título de la tarjeta, y sólo el título, usa el color de etiqueta de la apariencia. El texto se lee con contraste de al menos 4,5 a 1, también en las tarjetas que son botones, como «Cuotas del mes» y «Toca transferir».

### Escenario: tarjeta blanca con sombra
- **Dado** una tarjeta de Inicio en la apariencia Clara
- **Cuando** la persona la mira
- **Entonces** su fondo es blanco, tiene sombra y no tiene desenfoque

### Escenario: punto de color por tipo de cuenta
- **Dado** una cuenta de bancos y una tarjeta de crédito
- **Cuando** la persona abre Cuentas
- **Entonces** cada una lleva un punto del color de su tipo junto al título, y los dos colores son distintos

### Escenario: la etiqueta es sólo el título
- **Dado** una tarjeta con título y textos pequeños de apoyo
- **Cuando** la persona la mira
- **Entonces** sólo el título lleva el color de etiqueta y el punto de color

### Escenario: el texto de las tarjetas botón se lee
- **Dado** tarjetas «Cuotas del mes» y «Toca transferir» en Inicio
- **Cuando** la persona las mira en las dos apariencias
- **Entonces** su texto tiene contraste de al menos 4,5 a 1 con la tarjeta

## Requisito: Inicio con la tarjeta de resultado

Inicio abre con el resultado del mes en la tarjeta destacada y, debajo, dos tarjetas pequeñas, «Gastado» (con un punto rosa) e «Ingresado» (con un punto verde), con los totales del mes que se ve. Transferencias y ajustes no suman en ninguna. Después siguen las tarjetas que Inicio ya tiene.

### Escenario: gastado e ingresado
- **Dado** un ingreso de 1500 € y un gasto de 80 € este mes, y una transferencia de 300 €
- **Cuando** la persona abre Inicio
- **Entonces** «Gastado» dice 80 € e «Ingresado» dice 1500 €

### Escenario: sin movimientos
- **Dado** un mes sin movimientos
- **Cuando** la persona abre Inicio
- **Entonces** «Gastado» e «Ingresado» dicen 0 €

## Requisito: Cuentas con el patrimonio por mes

Cuentas abre con el patrimonio neto en la tarjeta destacada, con la fecha del cierre que se ve, y debajo un gráfico de barras con el patrimonio al cierre de los últimos cinco meses, incluido el que se ve. La barra del mes que se ve va resaltada con el degradado y un globo con su valor; las demás son grises. Bajo el gráfico, cada cuenta es una tarjeta numerada (01, 02…) con su saldo, y las tarjetas se desplazan hacia los lados sin desbordar la pantalla. Sin cuentas, no se dibuja el gráfico.

### Escenario: barras de cinco meses
- **Dado** que hoy es 2026-10-15 y movimientos desde junio
- **Cuando** la persona abre Cuentas
- **Entonces** el gráfico muestra cinco barras, de junio a octubre 2026
- **Y** la de octubre está resaltada con un globo con su valor

### Escenario: cuentas numeradas
- **Dado** tres cuentas
- **Cuando** la persona abre Cuentas a 390 px
- **Entonces** las tarjetas se numeran 01, 02 y 03, y la pantalla no tiene desplazamiento horizontal

### Escenario: Cuentas sin cuentas
- **Dado** que la persona no tiene cuentas
- **Cuando** abre Cuentas
- **Entonces** no se dibuja el gráfico de barras
