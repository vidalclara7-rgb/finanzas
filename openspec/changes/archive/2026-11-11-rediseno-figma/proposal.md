---
cambio: rediseno-figma
estado: archivado
datos: sin-cambios
archivado: 2026-11-11
---
# Rediseño con el estilo del Figma «Personal Finance – Account Balance App»

## Por qué

La persona quiere cambiar el aspecto de la app por el de un diseño de Figma (comunidad, «Personal Finance – Account Balance App»): pantalla clara, tarjetas blancas con sombra suave, un degradado azul, violeta y rosa, la letra Roboto, verde para lo que entra y rosa para lo que sale. Decidió que **reemplaza entero** el sistema actual (vidrio, fondo fluido, lima y violeta, Archivo) y que se **deriva una versión oscura** de la misma familia. De paso se corrigen los defectos de contraste y rendimiento que dejó la revisión de código del sistema anterior.

## Qué cambia

- **Paleta y tipografía del Figma**, con versión clara y oscura (Ajustes sigue con Oscura, Clara y Automática): fondo #F1F0F2, tarjetas blancas, textos en los azules oscuros del Figma, degradado azul cielo, violeta y rosa, verde y rosa para ingresos y gastos. Letra Roboto (en cinco pesos), guardada dentro de la app. Se retira Archivo.
- **Tarjetas blancas** con sombra suave y esquinas amplias, en lugar de vidrio. Se retiran el fondo fluido, el borde que gira, el foco que sigue el dedo y el pulso del botón: ya no hay animaciones de fondo ni de botón.
- **Tarjeta destacada con degradado** (el resultado del mes de Inicio y el patrimonio de Cuentas), como la tarjeta de crédito del Figma. Botón principal en píldora con degradado y texto blanco.
- **Disposición de las pantallas del Figma**:
  - Inicio: la tarjeta destacada arriba, «Gastado» e «Ingresado» en dos tarjetas pequeñas con su punto de color, y los ingresos contra gastos de seis meses en dos curvas (verde y rosa) con el dato del mes tocado en un globo.
  - Cuentas: el patrimonio en cifra grande con su fecha, las barras de los últimos meses con el mes que se ve resaltado en degradado y un globo con su valor, y las cuentas en tarjetas numeradas 01, 02… que se desplazan de lado.
  - Movimientos: arriba «Gastado» e «Ingresado» en dos tarjetas, y la lista en filas blancas con un círculo a la izquierda, el concepto y su detalle, y el importe a la derecha (rosa los gastos, verde los ingresos).
- **Se conservan los 19 colores fijos por categoría**: ahora son el círculo de cada fila, la torta y las barras de categoría. Ya no hay tarjetas de color por gasto.
- **Se corrigen las diez observaciones de la revisión de código** que ya no desaparecen solas: texto de las tarjetas con botón, texto secundario con contraste, foco por encima del texto (desaparece), costo de desenfoque y animación (desaparece), etiquetas y punto de color acotados al título, muestra de color seleccionada, variables sin uso y colores del manifiesto de instalación.

## A quién afecta

A todas las personas que usan la app: cambia el aspecto de todas las pantallas. Lo guardado no cambia (`datos: sin-cambios`); la apariencia elegida (Oscura, Clara o Automática) se conserva.

## Pantallas

Inicio, Movimientos, Cuentas, Cierre, Ajustes, el panel «≡» y todas las hojas (nuevo movimiento, cuenta, objetivos, forecast, importación…) cambian de aspecto. Cambian de disposición Inicio, Cuentas y Movimientos.

## Fuera de alcance

- Las pestañas Diario, Semanal y Mensual de la pantalla de gastos del Figma, y el carrusel de tarjetas de crédito: no se agregan funciones nuevas.
- Cotizaciones, fotos de perfil o íconos de comercio del Figma: la app no carga nada de otros sitios.
- Cambiar los textos, los datos o la lógica de ninguna pantalla.
