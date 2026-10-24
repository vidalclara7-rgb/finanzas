# Tareas: estilo-blanco-y-graficos

## Preview (Gate 2)
- [x] Hoja de estilos nueva en `index.html` (paleta blanca, letra única, clases de gráficos), sin tocar marcado ni lógica
- [x] `preview.html`: Inicio (con datos y vacía), Gastos, Cuentas y hoja de nuevo gasto
- [x] `python3 kit.py preview estilo-blanco-y-graficos` en verde y capturas en claro y oscuro

## Pantallas y lógica
- [ ] Quitar Google Fonts y la letra con serifa; títulos con la letra del texto
- [ ] Inicio: tarjetas de Tarjeta y Revolut con anillo del tope
- [ ] Inicio: torta de gastos por categoría con el total al centro y la lista con sus colores
- [ ] Inicio: barras de gasto por semana con la semana actual resaltada
- [ ] Cuentas: tarjetas de grupo blancas con punto de color por tipo; patrimonio en tarjeta negra
- [ ] `data-pantalla` y `data-ui` del preview en la app
- [ ] Subir `CACHE` en `sw.js`

## Tests
- [ ] graficos: 6 escenarios
- [ ] interfaz: 3 escenarios (y el de modo oscuro de la línea base, sustituido)
- [ ] datos: 2 escenarios (nada sale del teléfono, sin excepción de tipografías)
- [ ] Tests de la línea base que dependían de los colores viejos, ajustados a la spec nueva

## Comprobación y documentación
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` contra el preview aprobado, en claro y oscuro
- [ ] `CLAUDE.md`: sección de estilo
