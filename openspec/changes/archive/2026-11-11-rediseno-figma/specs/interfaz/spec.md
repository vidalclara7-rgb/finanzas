# Capacidad: interfaz

## Retirado: tarjetas de vidrio

Lo sustituyen las tarjetas blancas.

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
