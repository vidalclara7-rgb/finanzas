# Tareas: rediseno-tarjetas-de-color

## Preview (Gate 2)
- [x] Clases nuevas en `index.html` que el preview necesita (paleta, tarjetas grises, `.tile`, `.grp`, `.sc`, mosaico, carrusel, barra flotante), sin lógica
- [x] Definir los colores de categoría 6 a 19 (claro y oscuro) y sus textos, midiendo contraste en el peor punto
- [x] Esqueleto del preview y pantallas: Inicio, Gasto por categoría, Movimientos, Cuentas, hoja de categoría con «Ícono», cada una con estado normal y vacío
- [x] `kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos
- [ ] `icono` opcional en las categorías de gasto: `categoriasDatosNorm()` conserva sólo ids de la lista (o vacío), no escribe el de siempre
- [ ] `iconoDe()`, `ICONO_BASE` y el renombrado que conserva el ícono

## Pantallas y lógica
- [ ] Paleta, letra del sistema, títulos grandes, barra flotante con el «+» central
- [ ] Destacada y botón principal negro/lima; botón secundario gris; logo con el punto de acento
- [ ] Íconos: símbolos dentro de la app; cuadradito en Movimientos, lista de categorías e ícono en la hoja de categoría
- [ ] Resultado del mes con destino del sobrante y «Mover»
- [ ] Mosaico de «Gasto del mes» en lugar de la torta
- [ ] Hoja «Gasto por categoría» con la pila
- [ ] Cuentas: carrusel de tarjetas, saldo de la centrada, totales por tipo
- [ ] Movimientos: filas en grupos con cuadradito, gastos en el color del texto
- [ ] Ingresos y gastos, barras por semana y patrimonio con los colores nuevos; rosa sólo para avisos
- [ ] Subir `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario del delta (apariencia, interfaz, gráficos, presupuesto, movimientos, categorías, datos, meses)
- [ ] Actualizar los tests existentes de los requisitos sustituidos o retirados

## Comprobar
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado, en claro y en oscuro

## Documentación
- [ ] `CLAUDE.md`: paleta, íconos, resultado, mosaico, pila, carrusel y modelo de categorías
