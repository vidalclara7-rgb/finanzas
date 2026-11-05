---
cambio: sistema-de-diseno
estado: aprobada
datos: sin-cambios
---
# Nuevo sistema de diseño: vidrio, fondo fluido y paleta lima y violeta

## Por qué

La persona diseñó un sistema visual propio (el archivo `MyFinanzasDesignSystem.swift`, hecho para una app nativa de iOS) y quiere que esta app lo use.
La app es web, así que el sistema no se puede usar como código: se traduce a CSS y JavaScript con los mismos colores, tipografía, tarjetas, fondo y botón.

## Qué cambia

- **Una sola paleta con versión clara y oscura**, la del sistema, en lugar de Jardín (oscura) y Brûlée (clara): fondo #F3F3F8 / #0B0B10, acento lima #B2FF00, violeta,
  lavanda y cielo. Ajustes sigue con Oscura, Clara y Automática.
- **Tipografía Archivo** (peso heavy) para títulos y cifras grandes, guardada dentro de la app. El texto y los datos pequeños siguen con la letra del sistema y la monoespaciada.
- **Tarjetas de vidrio**: la estándar es translúcida, con desenfoque del fondo y borde fino. La **tarjeta destacada** (patrimonio y resultado del mes) suma un borde cónico que
  gira despacio y un foco de luz que sigue el dedo.
- **Fondo fluido**: una sola forma de tres lóbulos que se funden y cambian de color según la tendencia (lima si el resultado del mes es positivo, rojo si es negativo, violeta si no hay datos).
- **Botón principal** lima con un pulso suave.
- **Colores propios derivados**: los 19 colores de categoría y los cinco colores por tipo de cuenta, que el sistema no define, se derivan de su paleta y se aprueban en el preview.
- Se retiran las manchas del fondo, las dos paletas de hoy y las tarjetas de color sólido.

## A quién afecta

A todas las personas que usan la app: cambia el aspecto de todas las pantallas. Lo guardado no cambia (`datos: sin-cambios`); la apariencia elegida (Oscura, Clara o Automática) se conserva.

## Pantallas

Todas: Inicio, Movimientos, Cuentas, Cierre, Ajustes, el panel de análisis y las hojas. Cada una se muestra en el preview en claro y en oscuro.

## Fuera de alcance

- La **vibración al tocar** de la tarjeta destacada: la web no la ofrece en iPhone. Y la **pausa por modo de bajo consumo**: el navegador no deja detectarlo; el fondo se pausa con la app oculta o con «Reducir movimiento».
- El ícono de la app en la pantalla de inicio (rosa chicle) y el contenido de las pantallas: sólo cambia el aspecto, no lo que hacen.
- Una versión nativa en SwiftUI.
- Elegir entre varios temas: hay uno solo.
