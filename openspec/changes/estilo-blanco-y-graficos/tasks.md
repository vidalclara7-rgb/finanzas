# Tareas: estilo-blanco-y-graficos

## Preview (Gate 2)
- [x] Hoja de estilos nueva en `index.html` (paleta blanca, letra única, clases de gráficos), sin tocar marcado ni lógica
- [x] `preview.html`: Inicio (con datos y vacía), Gastos, Cuentas y hoja de nuevo gasto
- [x] `python3 kit.py preview estilo-blanco-y-graficos` en verde y capturas en claro y oscuro

## Pantallas y lógica
- [x] Quitar Google Fonts y la letra con serifa; títulos con la letra del texto
- [x] Inicio: tarjetas de Tarjeta y Revolut con anillo del tope
- [x] Inicio: torta de gastos por categoría con el total al centro y la lista con sus colores
- [x] Inicio: barras de gasto por semana con la semana actual resaltada
- [x] Cuentas: tarjetas de grupo blancas con punto de color por tipo; patrimonio en tarjeta negra
- [x] `data-pantalla` y `data-ui` del preview en la app
- [x] Subir `CACHE` en `sw.js`

## Tests
- [x] graficos: 6 escenarios
- [x] interfaz: 3 escenarios (y el de modo oscuro de la línea base, sustituido)
- [x] presupuesto: 3 escenarios del requisito sustituido (anillo en lugar de barra)
- [x] datos: 2 escenarios (nada sale del teléfono, sin excepción de tipografías)
- [x] Tests de la línea base que dependían de los colores viejos, ajustados a la spec nueva

## Comprobación y documentación
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` contra el preview aprobado, en claro y oscuro
- [x] `CLAUDE.md`: sección de estilo
