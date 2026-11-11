# Tareas: rediseno-figma

## Preview (Gate 2)
- [x] Traer Roboto (`@fontsource-variable/roboto`, latín) a `vendor/roboto/` con su licencia y comprobar que el preview lo usa
- [x] Crear `preview.html` con el esqueleto y rellenar Inicio, Movimientos y Cuentas (normal y vacío)
- [x] Fijar los tonos de texto (secundario, verde, rosa, degradado de la destacada y del botón) con la prueba de contraste
- [x] Capturas a 390 px en claro y en oscuro y enseñarlas (Gate 2)

## Datos y migración
- [ ] Confirmar que no hay migración (`datos: sin-cambios`): `settings.paleta` se sigue ignorando y la apariencia elegida se conserva

## Pantallas y lógica
- [ ] Variables de color, tarjetas blancas, botones y tipografía Roboto; borrar vidrio, fondo fluido, borde que gira, foco y pulso
- [ ] Inicio: tarjeta destacada, «Gastado» e «Ingresado», curvas de ingresos contra gastos con globo
- [ ] Movimientos: filas con círculo, importes verdes y rosas, dos tarjetas de totales
- [ ] Cuentas: patrimonio, barras de cinco meses con globo, tarjetas numeradas que se desplazan
- [ ] Logo «mf.», cierre, ajustes, panel y hojas con el estilo nuevo; título y punto de color acotados
- [ ] Quitar variables y clases sin uso; manifiesto con los colores nuevos
- [ ] `sw.js`: `CACHE` a v51, Roboto en `FILES` y Archivo fuera

## Tests
- [ ] Reescribir `apariencia.test.cjs` y `sistema.test.cjs` para los escenarios nuevos (fondo, colores, tarjetas, destacada, botón, tendencia)
- [ ] Ajustar `interfaz.test.cjs`, `movimientos.test.cjs` y `graficos.test.cjs` (filas con círculo, Gastado/Ingresado, curvas, barras de Cuentas)
- [ ] Un test por escenario con `// Escenario: <título>`, en claro y en oscuro a 390 px

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y revisar la app real contra el preview, en claro y en oscuro

## Documentación
- [ ] `CLAUDE.md`: reescribir «Apariencia y fondo» y «Estilo» y la lista de ficheros (Roboto, sin Archivo)
