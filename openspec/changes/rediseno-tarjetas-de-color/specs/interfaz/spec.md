# Capacidad: interfaz

## Requisito: navegación

Una barra inferior flotante, en forma de píldora oscura separada del borde, lleva a Inicio, Movimientos, Cuentas y Cierre, cada una con su ícono y su nombre, con el botón «+» en el centro. La pestaña activa se resalta: blanca en la apariencia Clara y lima en la Oscura. Ajustes se abre con el engranaje del encabezado. El «+» abre «Nuevo movimiento», salvo en Cuentas, donde abre «Nueva cuenta». El título del encabezado cambia con la pantalla.

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
- **Entonces** ve «Inicio», «Movimientos», «Cuentas» y «Cierre», cada una con su ícono

### Escenario: barra flotante
- **Dado** la app abierta a 390 px en las dos apariencias
- **Cuando** la persona mira la barra inferior
- **Entonces** es una píldora oscura con esquinas redondeadas, separada de los bordes de la pantalla
- **Y** la pestaña activa se distingue de las demás con contraste de al menos 3 a 1

### Escenario: la barra no tapa el contenido
- **Dado** Inicio con todas sus tarjetas
- **Cuando** la persona baja hasta el final
- **Entonces** la última tarjeta queda entera por encima de la barra

## Requisito: títulos grandes

El título de cada pantalla (Inicio, Movimientos, Cuentas, Cierre y Ajustes) va en grande, de al menos 28 px y en negrita, alineado a la izquierda. En Inicio, el título es el logo «mf.».

### Escenario: título grande
- **Dado** la app abierta a 390 px
- **Cuando** la persona abre Movimientos
- **Entonces** el título «Movimientos» mide al menos 28 px, va en negrita y empieza en el margen izquierdo

## Retirado: una sola letra en toda la app
Lo sustituye «la letra del sistema»: en el iPhone se usa la letra del teléfono y Roboto queda de respaldo.

## Requisito: la letra del sistema

Todos los textos usan la letra del sistema del teléfono: en el iPhone, SF Pro. En los teléfonos que no la tienen, se usa Roboto, que va guardada dentro de la app. Los títulos y las cifras grandes van en negrita; los importes, porcentajes y datos pequeños llevan cifras de ancho fijo para que se alineen.

### Escenario: la letra del sistema primero
- **Dado** la app abierta en Inicio
- **Cuando** la persona mira el título de la pantalla y abre la hoja de nuevo gasto
- **Entonces** el título y el de la hoja piden primero la letra del sistema y, si no está, Roboto

### Escenario: cifras de ancho fijo
- **Dado** la app con un gasto este mes
- **Cuando** la persona mira el importe en Movimientos
- **Entonces** el importe usa cifras de ancho fijo

### Escenario: sin letras de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio

### Escenario: el respaldo funciona sin conexión
- **Dado** la app ya abierta una vez
- **Cuando** la persona la vuelve a abrir sin conexión
- **Entonces** Roboto sigue disponible dentro de la app

## Requisito: las categorías nuevas tienen color propio

Cada categoría de gasto nueva tiene un color fijo, distinto del de las demás, que es el mismo en «Gasto del mes» de Inicio, en la pila de «Gasto por categoría» y en el cuadradito de sus movimientos. En las dos apariencias, el texto sobre ese color se lee con contraste de al menos 4,5 a 1.

### Escenario: color en la lista y en la fila
- **Dado** un gasto de 30 € en Alquiler este mes
- **Cuando** la persona mira «Gasto del mes» de Inicio y la fila del gasto en Movimientos
- **Entonces** el color de «Alquiler» es el mismo en «Gasto del mes», la pila y el cuadradito de la fila
- **Y** no coincide con el de otra categoría

### Escenario: contraste con cada categoría nueva
- **Dado** un gasto en cada categoría nueva
- **Cuando** la persona recorre Movimientos y «Gasto por categoría» en las apariencias Clara y Oscura
- **Entonces** el texto y el ícono sobre cada color tienen contraste de al menos 4,5 a 1 en el punto donde peor se leen

## Requisito: todo se lee sobre el fondo

En las dos apariencias, los importes principales y el texto de las tarjetas, también el de las tarjetas de color, se leen con un contraste de al menos 4,5 a 1 en el punto donde peor se leen. Las partes de las barras partidas (fijos y variables, destino del sobrante) se distinguen de su tarjeta con al menos 1,5 a 1: el dato está en el texto que las acompaña.

### Escenario: contraste en las dos apariencias
- **Dado** gastos fijos y variables, una transferencia a una inversión, una tarjeta de crédito con tope y cuentas de varios tipos
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas y Cierre en las apariencias Clara y Oscura
- **Entonces** el resultado, el disponible, el patrimonio y el texto de las tarjetas tienen contraste de al menos 4,5 a 1
- **Y** las partes de las barras partidas, de al menos 1,5 a 1 contra su tarjeta

## Requisito: el logo «mf.» dentro de la app

El encabezado de Inicio muestra el monograma «mf.» en negrita, grande: las letras en el color del texto y el punto en el acento, lima en la apariencia Oscura y azul (#4C5BD8) en la Clara.

### Escenario: logo en Inicio
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el encabezado muestra «mf.» con las letras en #0B0B0F y el punto en #4C5BD8

### Escenario: el logo sigue a la apariencia
- **Dado** el logo en Inicio
- **Cuando** la persona cambia a la apariencia Oscura
- **Entonces** las letras pasan a #F5F5F7 y el punto a lima

## Requisito: color por categoría

Cada categoría de gasto tiene su color con degradado, el mismo en «Gasto del mes», en la pila de «Gasto por categoría», en el cuadradito de cada fila de Movimientos y en las barras de categoría. Cada uno de los 19 colores es una pareja de dos tonos: un fondo de color con un degradado suave y el texto y el ícono en otro color vivo, con versión clara (por ejemplo lila con violeta oscuro o naranja con azul marino) y oscura (por ejemplo violeta con lima o verde oscuro con rosa). Cada categoría conserva su color de un mes a otro. El cuadradito de la fila es un cuadrado de esquinas redondeadas con el ícono de la categoría, o su inicial si no tiene, en blanco u oscuro, el que mejor se lea, con contraste de al menos 4,5 a 1.

### Escenario: mismo color por categoría
- **Dado** un gasto en Supermercado este mes
- **Cuando** la persona mira «Gasto del mes» de Inicio y la fila del gasto en Movimientos
- **Entonces** el cuadradito de Supermercado en «Gasto del mes» y el cuadradito de la fila tienen el mismo color

### Escenario: ícono legible en el cuadradito
- **Dado** un gasto en cada categoría
- **Cuando** la persona recorre Movimientos en las apariencias Oscura y Clara
- **Entonces** el ícono o la inicial de cada cuadradito tiene contraste de al menos 4,5 a 1 con su color

### Escenario: reembolsos distinguibles
- **Dado** un gasto en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Movimientos
- **Entonces** su cuadradito tiene el color propio de esa categoría y distinto del de Compras

### Escenario: el color no cambia de un mes a otro
- **Dado** un gasto en Alquiler en octubre y otro en septiembre, y Alquiler con más gasto en un mes que en el otro
- **Cuando** la persona mira Movimientos y «Gasto del mes» en cada mes
- **Entonces** Alquiler tiene el mismo color en los dos meses

## Requisito: tarjeta destacada

El patrimonio neto de Cuentas es la tarjeta destacada: negra (#0B0B0F) con el texto blanco en la apariencia Clara, y lima (#E8F94B) con el texto casi negro en la Oscura, sin degradado. No se mueve ni reacciona al dedo con ningún efecto. El resultado del mes de Inicio ya no es una tarjeta destacada.

### Escenario: tarjeta destacada
- **Dado** la app con datos de ejemplo
- **Cuando** la persona abre Cuentas en las dos apariencias
- **Entonces** el patrimonio neto tiene fondo #0B0B0F en la clara y #E8F94B en la oscura
- **Y** su texto tiene contraste de al menos 4,5 a 1

### Escenario: la destacada no se mueve
- **Dado** la tarjeta destacada
- **Cuando** la persona la toca y la mantiene
- **Entonces** no aparece ningún foco ni cambia el borde

## Requisito: botón principal

El botón principal de cada hoja y pantalla es una píldora negra con texto blanco en la apariencia Clara, y lima con texto casi negro en la Oscura, con contraste de al menos 4,5 a 1. El botón secundario es una píldora gris del color de las tarjetas, sin borde. Ningún botón pulsa ni se anima.

### Escenario: botón principal
- **Dado** la hoja «Nuevo movimiento» abierta
- **Cuando** la persona mira «Guardar» en las dos apariencias
- **Entonces** es una píldora negra con texto blanco en la clara y lima con texto oscuro en la oscura

### Escenario: el botón no se anima
- **Dado** un botón principal a la vista
- **Cuando** la persona lo mira dos segundos
- **Entonces** no tiene ninguna animación en marcha

### Escenario: botón secundario
- **Dado** una hoja con un botón secundario, como «Cerrar»
- **Cuando** la persona lo mira
- **Entonces** es una píldora gris, sin borde, y no negra ni lima

## Requisito: tendencia del mes

El título del resultado del mes sigue la tendencia del mes que se ve: positiva si el resultado (ingresos menos gastos de plata propia) es mayor que 0, negativa si es menor que 0, neutra si es 0 o no hay datos. Positiva: «Te sobraron X €». Negativa: «Te faltaron X €», con la marca «Mes en negativo». Neutra: «Sin resultado este mes».

### Escenario: tendencia positiva
- **Dado** ingresos de 1500 € y gastos de 100 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** la tendencia es positiva y el resultado dice «Te sobraron 1400 €»

### Escenario: tendencia negativa
- **Dado** ingresos de 100 € y gastos de 300 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** la tendencia es negativa y el resultado dice «Te faltaron 200 €», con la marca «Mes en negativo»

### Escenario: tendencia neutra
- **Dado** un mes sin movimientos
- **Cuando** la persona abre Inicio
- **Entonces** la tendencia es neutra y el resultado dice «Sin resultado este mes»

### Escenario: la tendencia cambia con el mes que se ve
- **Dado** un mes con resultado positivo y el anterior con resultado negativo
- **Cuando** la persona pasa de uno a otro con el selector de mes
- **Entonces** la tendencia cambia con el mes que se ve

## Requisito: muestras de color

Los 19 colores de categoría son todos distintos entre sí en cada apariencia. Los cinco primeros son, en la Clara, las parejas lila con violeta oscuro, lima con verde, azul con amarillo, naranja con azul marino y rosa con bordó, y en la Oscura, las parejas violeta con lima, verde oscuro con rosa, magenta con amarillo, menta con azul marino y bordó con celeste. Los cinco tipos de cuenta usan esos cinco colores: bancos el primero, deudas compartidas el segundo, inversiones el tercero, tarjetas el cuarto y financiaciones el quinto.

### Escenario: 19 colores distintos
- **Dado** la app abierta
- **Cuando** se comparan los colores de las 19 categorías en la apariencia Clara y en la Oscura
- **Entonces** en cada una son 19 colores distintos

### Escenario: 5 colores por tipo de cuenta
- **Dado** la app abierta
- **Cuando** se comparan los colores de los cinco tipos de cuenta
- **Entonces** son cinco colores distintos en cada apariencia

### Escenario: los primeros colores de la paleta
- **Dado** la apariencia Clara
- **Cuando** se miran los colores de las categorías Supermercado, Comida fuera y Delivery
- **Entonces** son los fondos lila, lima y azul de la paleta

## Retirado: tarjetas blancas
Lo sustituyen «fondo liso y tarjetas sin sombra», en apariencia, y «títulos de las tarjetas».

## Requisito: títulos de las tarjetas

Cada tarjeta tiene su título en negrita, en el color del texto, y los textos de apoyo en el color secundario. En Cuentas, cada tipo de cuenta lleva un punto de su color junto al nombre del tipo. El texto se lee con contraste de al menos 4,5 a 1, también en las tarjetas que son botones, como «Cuotas del mes» y «Toca transferir».

### Escenario: punto de color por tipo de cuenta
- **Dado** una cuenta de bancos y una tarjeta de crédito
- **Cuando** la persona abre Cuentas
- **Entonces** cada tipo lleva un punto de su color junto a su nombre, y los dos colores son distintos

### Escenario: el texto de las tarjetas botón se lee
- **Dado** tarjetas «Cuotas del mes» y «Toca transferir» en Inicio
- **Cuando** la persona las mira en las dos apariencias
- **Entonces** su texto tiene contraste de al menos 4,5 a 1 con la tarjeta

## Requisito: Inicio con la tarjeta de resultado

Inicio muestra el resultado del mes en una tarjeta con el destino del sobrante y, debajo, dos tarjetas pequeñas, «Gastado» (con un punto del color del texto) e «Ingresado» (con un punto verde), con los totales del mes que se ve. Transferencias y ajustes no suman en ninguna. El resto de las tarjetas de Inicio sigue en el mismo orden que antes: la torta pasa a ser una lista con barras y «Por semana» deja de estar.

### Escenario: gastado e ingresado
- **Dado** un ingreso de 1500 € y un gasto de 80 € este mes, y una transferencia de 300 €
- **Cuando** la persona abre Inicio
- **Entonces** «Gastado» dice 80 € e «Ingresado» dice 1500 €

### Escenario: sin movimientos
- **Dado** un mes sin movimientos
- **Cuando** la persona abre Inicio
- **Entonces** «Gastado» e «Ingresado» dicen 0 €

### Escenario: el orden de Inicio
- **Dado** gastos fijos y variables, una cuenta con tope, ingresos de seis meses y cuentas cargadas
- **Cuando** la persona abre Inicio
- **Entonces** de arriba abajo ve «Fijos y variables», el resultado del mes, «Gastado» e «Ingresado», el disponible por cuenta, «Gasto del mes», «Ingresos y gastos» y «Patrimonio neto», y no ve «Por semana»

## Requisito: Cuentas con el patrimonio por mes

Cuentas abre con el patrimonio neto en la tarjeta destacada, con la fecha del cierre que se ve, y debajo un gráfico de barras con el patrimonio al cierre de los últimos cinco meses, incluido el que se ve. La barra del mes que se ve va resaltada (negra en la clara, lima en la oscura) con un globo con su valor; las demás son grises. Sin cuentas, no se dibuja el gráfico.

### Escenario: barras de cinco meses
- **Dado** que hoy es 2026-10-15 y movimientos desde junio
- **Cuando** la persona abre Cuentas
- **Entonces** el gráfico muestra cinco barras, de junio a octubre 2026
- **Y** la de octubre está resaltada con un globo con su valor

### Escenario: Cuentas sin cuentas
- **Dado** que la persona no tiene cuentas
- **Cuando** abre Cuentas
- **Entonces** no se dibuja el gráfico de barras

## Requisito: carrusel de cuentas

Debajo del patrimonio, cada cuenta es una tarjeta grande, del color con degradado de su tipo, con su nombre, su tipo y, si lo tiene, su tope o su límite. Las tarjetas se deslizan hacia los lados de a una: la centrada se ve entera y las de los costados asoman. Unos puntos debajo dicen cuántas hay y cuál se ve. Debajo de la tarjeta centrada se leen su saldo en grande, si está conciliada este mes y el botón «Ver movimientos». Si es una cuenta de inversión, además «Ver rendimiento». Tocar la tarjeta abre la hoja de la cuenta. Las cuentas van ordenadas por tipo y, más abajo, una lista dice el total de cada tipo con su punto de color.

### Escenario: tres cuentas en el carrusel
- **Dado** «Banco A» con 1200 €, «Tarjeta Y» con 350 € de deuda y «Broker X» con 2100 €
- **Cuando** la persona abre Cuentas a 390 px
- **Entonces** ve tres puntos y la tarjeta de Banco A centrada, con «1200 €» debajo
- **Y** la pantalla no tiene desplazamiento horizontal

### Escenario: deslizar a la siguiente cuenta
- **Dado** el carrusel con Banco A centrada
- **Cuando** la persona desliza hacia la izquierda
- **Entonces** queda centrada la siguiente cuenta, el saldo de debajo cambia al suyo y el punto marcado avanza

### Escenario: ver movimientos de la cuenta centrada
- **Dado** el carrusel con Banco A centrada
- **Cuando** la persona toca «Ver movimientos»
- **Entonces** se abre la lista de movimientos de Banco A

### Escenario: rendimiento de una inversión
- **Dado** el carrusel con Broker X centrada
- **Cuando** la persona mira debajo de la tarjeta
- **Entonces** ve «Ver movimientos» y «Ver rendimiento»

### Escenario: abrir la cuenta desde la tarjeta
- **Dado** el carrusel con Banco A centrada
- **Cuando** la persona toca la tarjeta
- **Entonces** se abre la hoja de Banco A para editarla

### Escenario: total por tipo
- **Dado** Banco A con 1200 € y Banco B con 300 €
- **Cuando** la persona abre Cuentas
- **Entonces** la lista de totales dice «Bancos y efectivo» 1500 €, con el punto de color de los bancos

## Requisito: tarjetas de Inicio en parejas de color

En Inicio, las tarjetas del resumen llevan una pareja de color, como las categorías: un fondo de color con un degradado suave y todo su texto, sus barras y sus anillos en el otro color de la pareja. Son el resultado del mes, «Fijos y variables», «Gastado», «Ingresado», el disponible de cada cuenta con tope (con la pareja de su tipo de cuenta), «Cuotas del mes», «Por cobrar», «Toca transferir» y «Patrimonio neto». Las demás (los avisos, la sugerencia de gasto fijo, «Gasto del mes» e «Ingresos y gastos») siguen grises. El texto de cada tarjeta de color tiene contraste de al menos 4,5 a 1 en el punto de su degradado donde peor se lee, en las dos apariencias. Dentro de una tarjeta de color, un tope excedido o un mes en negativo se dicen con texto y una marca, no con rosa.

### Escenario: el resumen de Inicio en color
- **Dado** gastos fijos y variables, ingresos, una tarjeta de crédito con tope y cuentas cargadas este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado del mes, «Fijos y variables», «Gastado», «Ingresado», el disponible de la tarjeta y «Patrimonio neto» tienen fondo de color
- **Y** «Gasto del mes» e «Ingresos y gastos» son grises

### Escenario: tarjetas de color distintas
- **Dado** el resultado del mes, «Fijos y variables», «Gastado» e «Ingresado» a la vista
- **Cuando** la persona mira Inicio
- **Entonces** cada una de esas cuatro tarjetas tiene un color de fondo distinto de las otras tres

### Escenario: el texto de las tarjetas de color se lee
- **Dado** todas las tarjetas de color de Inicio a la vista
- **Cuando** la persona las mira en las apariencias Clara y Oscura
- **Entonces** todo su texto tiene contraste de al menos 4,5 a 1 con cada punto de su degradado

### Escenario: tope excedido en una tarjeta de color
- **Dado** «Tarjeta» con tope de 300 € y 320 € gastados este mes
- **Cuando** la persona abre Inicio
- **Entonces** el disponible de Tarjeta dice «-20 €», su anillo dice «107 %» y lleva la marca «Excedido»

## Requisito: importes con punto de miles

Todos los importes que muestra la app separan los miles con punto y los decimales con coma, también los de cuatro cifras: «1.284 €», «2.450,3 €», «1.000.000 €», «-1.060 €». Los campos donde se escribe un importe no cambian: aceptan «1.234,56», «1234,56» y «1234.56».

### Escenario: miles con punto
- **Dado** «Banco A» con 1234,56 € y un gasto de 1284 € este mes
- **Cuando** la persona abre Cuentas y Movimientos
- **Entonces** Banco A muestra «1.234,56 €» y el gasto, «−1.284 €»

### Escenario: millones y negativos
- **Dado** «Broker X» con 1.000.000 € y «Tarjeta Y» con 1060 € de deuda
- **Cuando** la persona abre Cuentas
- **Entonces** Broker X muestra «1.000.000 €» y el total de tarjetas, «-1.060 €»

### Escenario: importes chicos sin punto
- **Dado** un gasto de 64,30 €
- **Cuando** la persona abre Movimientos
- **Entonces** el gasto muestra «−64,3 €»

## Requisito: ningún texto se pisa

En ninguna pantalla ni hoja un texto se superpone con otro texto ni se sale de la tarjeta o el botón que lo contiene, en 390 px de ancho y en las dos apariencias. Un texto que no entra en su renglón se corta con puntos suspensivos o pasa al renglón siguiente.

### Escenario: recorrido sin textos pisados
- **Dado** la app con cuentas, categorías y notas de nombres largos (30 caracteres o más) e importes de seis cifras
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre, Ajustes, «Gasto por categoría», la hoja de una categoría y la de una cuenta, a 390 px, en las apariencias Clara y Oscura
- **Entonces** ningún texto se superpone con otro y ninguno se sale de su tarjeta o su botón
