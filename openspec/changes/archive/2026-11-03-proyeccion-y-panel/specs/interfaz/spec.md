# Capacidad: interfaz

## Requisito: panel de análisis

Un botón «≡» a la izquierda del encabezado, en todas las pantallas, abre un panel lateral con tres entradas: Forecast, Inversiones
y Radar de noticias. Forecast abre la proyección; Inversiones abre el rendimiento de las cuentas de inversión; Radar de noticias
está deshabilitada y dice «Próximamente». El panel se cierra al elegir una entrada, al tocar fuera de él o con Escape.

### Escenario: abrir y cerrar el panel
- **Dado** la app abierta en Inicio
- **Cuando** la persona toca «≡» y después toca fuera del panel
- **Entonces** ve el panel con «Forecast», «Inversiones» y «Radar de noticias» y después deja de verlo

### Escenario: el botón está en todas las pantallas
- **Dado** la app abierta
- **Cuando** la persona recorre Inicio, Movimientos, Cuentas, Cierre y Ajustes
- **Entonces** ve el botón «≡» en cada una

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
