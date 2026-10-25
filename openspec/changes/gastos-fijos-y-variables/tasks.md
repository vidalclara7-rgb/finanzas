# Tareas: gastos-fijos-y-variables

## Preview (Gate 2)
- [x] `preview.html`: Inicio con «Fijos y variables», línea del % y tarjeta de sugerencia (normal y vacío)
- [x] Hoja de gasto con la casilla «Gasto fijo»
- [x] Movimientos con la etiqueta «Fijo»
- [x] `python3 kit.py preview gastos-fijos-y-variables` en verde y capturas en claro y oscuro

## Datos
- [x] `movs[i].fijo` y `fijos` en la raíz; `norm()` crea `fijos` vacío (al cargar y al restaurar)

## Pantallas y lógica
- [x] Quitar la forma de círculos y su hoja de estilos; línea «Gastaste el X %» sobre el resultado
- [x] «Fijos y variables»: barra partida y ranking por grupo, sin reembolsables
- [x] Casilla «Gasto fijo» en la hoja de gasto (oculta en reembolsables), premarcado por categoría y nota
- [x] Desmarcar: el gasto vuelve a variable y la regla se quita
- [x] Etiqueta «Fijo» en la tarjeta del movimiento
- [x] Sugerencias: tres meses seguidos, ±10 %, con nota; «Sí, es fijo» y «No»
- [x] `data-pantalla` y `data-ui` del preview en la app
- [x] Subir `CACHE` en `sw.js`
- [x] Gate 3, ronda 1: % y resultado del mes sin reembolsables (gastos de Trabajo e ingresos de Reembolso)

## Tests
- [x] graficos: 7 escenarios
- [x] movimientos: 11 escenarios
- [x] datos: 3 escenarios
- [x] reembolsos fuera del porcentaje y del resultado: 2 escenarios

## Comprobación y documentación
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y contraste en las cuatro paletas
- [x] `CLAUDE.md`: modelo de datos, pantallas y gráficos
