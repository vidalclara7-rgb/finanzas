# Capacidad: interfaz

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
