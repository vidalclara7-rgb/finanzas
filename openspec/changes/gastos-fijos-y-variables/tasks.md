# Tareas: gastos-fijos-y-variables

## Preview (Gate 2)
- [x] `preview.html`: Inicio con «Fijos y variables», línea del % y tarjeta de sugerencia (normal y vacío)
- [x] Hoja de gasto con la casilla «Gasto fijo»
- [x] Movimientos con la etiqueta «Fijo»
- [x] `python3 kit.py preview gastos-fijos-y-variables` en verde y capturas en claro y oscuro

## Datos
- [ ] `movs[i].fijo` y `fijos` en la raíz; `norm()` crea `fijos` vacío (al cargar y al restaurar)

## Pantallas y lógica
- [ ] Quitar la forma de círculos y su hoja de estilos; línea «Gastaste el X %» sobre el resultado
- [ ] «Fijos y variables»: barra partida y ranking por grupo, sin reembolsables
- [ ] Casilla «Gasto fijo» en la hoja de gasto (oculta en reembolsables), premarcado por categoría y nota
- [ ] Desmarcar: el gasto vuelve a variable y la regla se quita
- [ ] Etiqueta «Fijo» en la tarjeta del movimiento
- [ ] Sugerencias: tres meses seguidos, ±10 %, con nota; «Sí, es fijo» y «No»
- [ ] `data-pantalla` y `data-ui` del preview en la app
- [ ] Subir `CACHE` en `sw.js`

## Tests
- [ ] graficos: 7 escenarios
- [ ] movimientos: 11 escenarios
- [ ] datos: 3 escenarios

## Comprobación y documentación
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y contraste en las cuatro paletas
- [ ] `CLAUDE.md`: modelo de datos, pantallas y gráficos
