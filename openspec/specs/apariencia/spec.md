# Capacidad: apariencia

## Requisito: elegir la apariencia

En Ajustes, «Apariencia» ofrece Oscura, Clara y Automática (sigue al teléfono). Sin elección, la apariencia es
Oscura, aunque el teléfono esté en modo claro. Al elegir otra, toda la app cambia al instante y la elección se
recuerda al volver a abrir.

### Escenario: oscura por defecto
- **Dado** una app recién abierta, sin datos, en un teléfono en modo claro
- **Cuando** la persona abre la app y luego Ajustes
- **Entonces** la app se ve oscura
- **Y** «Apariencia» tiene marcada «Oscura»

### Escenario: elegir clara
- **Dado** la app oscura
- **Cuando** la persona elige «Clara» en Ajustes
- **Entonces** el fondo de la pantalla pasa a claro y la opción queda marcada

### Escenario: automática sigue al teléfono
- **Dado** «Automática» elegida y el teléfono en modo claro
- **Cuando** la persona abre la app
- **Entonces** la app se ve clara
- **Y** al pasar el teléfono a modo oscuro, la app pasa a oscura

### Escenario: la apariencia se recuerda
- **Dado** «Clara» elegida
- **Cuando** la persona vuelve a abrir la app
- **Entonces** la app se ve clara

## Requisito: la barra del sistema acompaña

En la app instalada, el color de la barra superior del sistema acompaña a la apariencia que se está viendo.

### Escenario: barra oscura y clara
- **Dado** la apariencia Oscura
- **Cuando** la persona cambia a Clara
- **Entonces** el color de la barra del sistema pasa de oscuro a claro

## Requisito: colores del sistema

La app tiene una sola paleta, con versión clara y oscura. Clara: fondo #FFFFFF, tarjeta #F4F4F6, texto #0B0B0F, texto secundario #66666E. Oscura: fondo #000000, tarjeta #141416, texto #F5F5F7, texto secundario #9A9AA2. El acento es lima (#E8F94B). Lo que entra es verde: relleno #34C759 y, en los importes escritos, #17773F en la clara y #4ADE80 en la oscura. Lo que sale se escribe en el color del texto. El rosa queda para los avisos sobre fondo gris o liso (un mes en negativo en el gráfico, un saldo negativo en Cuentas): #C81E4A en la clara y #FF8AA6 en la oscura. Dentro de una tarjeta de color, los avisos se dicen con texto y una marca, en el color de la pareja. Ya no hay degradado azul y violeta.

### Escenario: los colores de la clara
- **Dado** la apariencia Clara
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es #FFFFFF y el texto principal es #0B0B0F

### Escenario: los colores de la oscura
- **Dado** la apariencia Oscura
- **Cuando** la persona abre Inicio
- **Entonces** el fondo de la pantalla es #000000 y el texto principal es #F5F5F7

### Escenario: verde para lo que entra y texto para lo que sale
- **Dado** un gasto y un ingreso este mes
- **Cuando** la persona abre Movimientos en las dos apariencias
- **Entonces** el importe del ingreso es verde y el del gasto tiene el color del texto
- **Y** cada importe tiene contraste de al menos 4,5 a 1 con su fondo

### Escenario: rosa sólo para avisos
- **Dado** una tarjeta de crédito con 350 € de deuda y septiembre con gastos mayores que los ingresos
- **Cuando** la persona abre Inicio y Cuentas en las dos apariencias
- **Entonces** septiembre se marca en rosa en «Ingresos y gastos» y el total negativo de «Tarjetas de crédito» en «Por tipo» va en rosa, con contraste de al menos 4,5 a 1

### Escenario: texto secundario legible
- **Dado** Inicio, Movimientos y Cuentas con datos
- **Cuando** la persona los mira en las dos apariencias
- **Entonces** el texto secundario (fechas, detalles, etiquetas) tiene contraste de al menos 4,5 a 1 con su tarjeta

### Escenario: una paleta vieja guardada
- **Dado** datos guardados que elegían otra paleta cuando se podía elegir
- **Cuando** la persona abre la app
- **Entonces** la app se ve con la paleta del sistema, sin error

## Requisito: fondo liso y tarjetas sin sombra

Detrás de todas las pantallas hay un fondo liso, sin formas ni animación: blanco #FFFFFF en la apariencia Clara y negro #000000 en la Oscura. Las tarjetas quedan encima, sin sombra ni borde, con esquinas muy redondeadas (al menos 22 px). Las que no llevan una pareja de color son grises: #F4F4F6 en la clara y #141416 en la oscura. Nada en el fondo ni en las tarjetas se mueve por sí solo, así que «Reducir movimiento» no cambia nada.

### Escenario: fondo de cada apariencia
- **Dado** la app abierta
- **Cuando** la persona cambia entre Clara y Oscura
- **Entonces** el fondo de la pantalla es #FFFFFF en la clara y #000000 en la oscura

### Escenario: tarjetas de cada apariencia
- **Dado** la tarjeta «Gasto del mes» de Inicio
- **Cuando** la persona la mira en la clara y en la oscura
- **Entonces** su fondo es #F4F4F6 en la clara y #141416 en la oscura, sin sombra y con esquinas de al menos 22 px

### Escenario: nada se mueve solo
- **Dado** el teléfono sin «Reducir movimiento»
- **Cuando** la persona abre Inicio y espera dos segundos
- **Entonces** el fondo, las tarjetas y los botones no tienen ninguna animación en marcha

### Escenario: sin cargar nada de otros sitios
- **Dado** la app abierta
- **Cuando** la persona recorre todas las pantallas
- **Entonces** la app no hace ninguna petición a otro sitio
