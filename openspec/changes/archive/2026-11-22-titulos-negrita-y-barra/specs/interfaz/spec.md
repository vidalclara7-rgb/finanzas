# Capacidad: interfaz

## Requisito: navegación

Una barra inferior flotante, en forma de píldora oscura separada del borde, lleva a Inicio, Movimientos, Cuentas y Cierre, cada una con su ícono y su nombre, con el botón «+» en el centro. La pestaña activa se resalta con una píldora: blanca en la apariencia Clara y lima en la Oscura. El nombre de cada pestaña, también el de «Movimientos», que es el más largo, entra en su resaltado con al menos 6 px de aire a cada lado. Ajustes se abre con el engranaje del encabezado. El «+» abre «Nuevo movimiento», salvo en Cuentas, donde abre «Nueva cuenta». El título del encabezado cambia con la pantalla.

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

### Escenario: el resaltado tiene aire
- **Dado** la app abierta a 390 px en las dos apariencias
- **Cuando** la persona va a Movimientos y mira la barra inferior
- **Entonces** el nombre «Movimientos» queda dentro del resaltado con al menos 6 px a cada lado
- **Y** lo mismo pasa con «Inicio», «Cuentas» y «Cierre» cuando son la pestaña activa

## Requisito: títulos de las tarjetas

Cada tarjeta tiene su título en negrita (peso 700), en el color del texto. También los títulos de las hojas, del panel «≡» y de cada tipo en Cuentas van en negrita. Los textos de apoyo van en peso normal y y los textos de apoyo en el color secundario. En Cuentas, cada tipo de cuenta lleva un punto de su color junto al nombre del tipo. El texto se lee con contraste de al menos 4,5 a 1, también en las tarjetas que son botones, como «Cuotas del mes» y «Toca transferir».

### Escenario: punto de color por tipo de cuenta
- **Dado** una cuenta de bancos y una tarjeta de crédito
- **Cuando** la persona abre Cuentas
- **Entonces** cada tipo lleva un punto de su color junto a su nombre, y los dos colores son distintos

### Escenario: el texto de las tarjetas botón se lee
- **Dado** tarjetas «Cuotas del mes» y «Toca transferir» en Inicio
- **Cuando** la persona las mira en las dos apariencias
- **Entonces** su texto tiene contraste de al menos 4,5 a 1 con la tarjeta

### Escenario: títulos en negrita
- **Dado** la app con datos en las dos apariencias
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre y Ajustes, y abre la hoja de un movimiento y el panel «≡»
- **Entonces** el título de cada tarjeta, de cada hoja y del panel va en negrita
