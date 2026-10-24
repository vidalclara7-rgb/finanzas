# Capacidad: interfaz

## Requisito: se usa cómodo en un iPhone

Todas las pantallas entran en 390 px de ancho sin desplazamiento horizontal, y los textos están en
castellano rioplatense.

### Escenario: ninguna pantalla se desborda
- **Dado** la app con los datos de ejemplo en un teléfono de 390 px de ancho
- **Cuando** la persona recorre Inicio, Gastos, Cuentas, Mes y Ajustes
- **Entonces** ninguna pantalla tiene desplazamiento horizontal

## Requisito: navegación

Una barra inferior lleva a Inicio, Gastos, Cuentas y Mes, con el botón «+» en el centro. Ajustes se
abre con el engranaje del encabezado. El «+» agrega un gasto, salvo en Cuentas, donde agrega una
cuenta. El título del encabezado cambia con la pantalla.

### Escenario: el más según la pantalla
- **Dado** la app abierta en Inicio
- **Cuando** la persona toca «+», cierra, va a Cuentas y vuelve a tocar «+»
- **Entonces** primero se abre «Nuevo gasto» y después «Nueva cuenta»

### Escenario: ajustes desde el engranaje
- **Dado** la app abierta en Inicio
- **Cuando** la persona toca el engranaje
- **Entonces** el título dice «Ajustes» y se ven los topes mensuales

## Requisito: modo oscuro

La app sigue el modo claro u oscuro del teléfono. En oscuro el fondo es oscuro y las tarjetas de
color mantienen el texto oscuro legible.

### Escenario: teléfono en modo oscuro
- **Dado** el teléfono en modo oscuro
- **Cuando** la persona abre la app
- **Entonces** el fondo de la pantalla es oscuro
- **Y** el texto de la tarjeta de Tarjeta sigue siendo oscuro

## Requisito: funciona sin conexión

Después de abrirla una vez con conexión, la app abre y funciona sin conexión.

### Escenario: abrir sin conexión
- **Dado** la app abierta una vez con conexión
- **Cuando** el teléfono se queda sin conexión y la persona vuelve a abrir la app
- **Entonces** la app abre y muestra Inicio con sus datos
