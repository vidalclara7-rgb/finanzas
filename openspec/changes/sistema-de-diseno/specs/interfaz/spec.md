# Capacidad: interfaz

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

## Retirado: tarjetas de color sólido
Lo sustituyen las tarjetas de vidrio.

## Requisito: tarjetas de vidrio

Las tarjetas son de vidrio: translúcidas, con el fondo desenfocado detrás, un borde fino y las esquinas redondeadas, sin degradado. Las cuentas y los grupos que antes llevaban un color sólido por tipo (bancos, inversiones, tarjetas, financiaciones y deudas compartidas) llevan ahora una marca de ese color sobre el vidrio. El título de cada tarjeta usa el color de etiqueta de la apariencia. El texto se lee con contraste de al menos 4,5 a 1.

### Escenario: el vidrio deja ver el fondo
- **Dado** una tarjeta de Inicio
- **Cuando** la persona la mira
- **Entonces** su fondo es translúcido y desenfoca lo que tiene detrás

### Escenario: sin degradados en las tarjetas
- **Dado** el disponible de una tarjeta de crédito con tope y «Cuotas del mes»
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de las tarjetas no tiene degradado

### Escenario: marca de color por tipo de cuenta
- **Dado** una cuenta de bancos y una tarjeta de crédito
- **Cuando** la persona abre Cuentas
- **Entonces** cada una lleva la marca de color de su tipo, y los dos colores son distintos

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

El brillo de la forma del fondo, el foco de la tarjeta destacada y el texto de variación siguen la tendencia del mes que se ve: positiva si el resultado (ingresos menos gastos) es mayor que 0, negativa si es menor que 0, neutra si es 0 o no hay datos. Positiva usa el verde lima, negativa el rojo y neutra el violeta del sistema.

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

Los 19 colores de categoría y los cinco colores por tipo de cuenta salen de la paleta del sistema: son los mismos en las dos apariencias, todos distintos entre sí, y el texto blanco sobre cada color de categoría tiene contraste de al menos 4,5 a 1.

### Escenario: 19 colores distintos
- **Dado** la app abierta
- **Cuando** se comparan los colores de las 19 categorías
- **Entonces** son 19 colores distintos

### Escenario: texto legible sobre cada color de categoría
- **Dado** un gasto en cada categoría
- **Cuando** la persona recorre Movimientos en las apariencias Clara y Oscura
- **Entonces** el texto blanco de cada tarjeta tiene contraste de al menos 4,5 a 1

### Escenario: 5 colores por tipo de cuenta
- **Dado** la app abierta
- **Cuando** se comparan los colores de los cinco tipos de cuenta
- **Entonces** son cinco colores distintos, los mismos en las dos apariencias
