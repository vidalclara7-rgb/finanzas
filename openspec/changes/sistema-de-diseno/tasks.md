# Tareas: sistema-de-diseno

## Preview
- [ ] Fuente Archivo en `vendor/archivo/` con su licencia y `@font-face`; variables y clases del sistema en `index.html` (sólo estilos)
- [ ] Esqueleto del preview y pantallas: Inicio, Movimientos, Cuentas, Cierre, Ajustes, panel y hojas, más una pantalla de muestras de color (normal y vacío)
- [ ] `python3 kit.py preview` en verde y capturas a 390 px en claro y oscuro

## Datos y migración
- [ ] Sin migración (`datos: sin-cambios`): confirmar que `norm()` no cambia

## Estilos
- [ ] Variables de la paleta (claro y oscuro) y quitar las dos paletas, `--mancha*` y `--velo`
- [ ] Tarjetas de vidrio, marca de color por tipo de cuenta y 19 colores de categoría derivados
- [ ] Tarjeta destacada (borde cónico y foco), botón principal con pulso y botón secundario de vidrio
- [ ] Letra: Archivo en títulos y cifras grandes, monoespaciada en datos pequeños; logo «mf.»

## Lógica
- [ ] `tendenciaMes()` y `data-tendencia` en `<html>`; color positivo, negativo o neutro
- [ ] Fondo fluido: tres lóbulos con filtro de fusión, 30 fps, pausa con la app oculta y con «Reducir movimiento»; medir el costo en el iPhone
- [ ] Foco de la tarjeta destacada con el dedo
- [ ] `theme-color` con el fondo nuevo; `sw.js`: subir `CACHE` y sumar `vendor/archivo/*` a `FILES`

## Tests
- [ ] Reescribir los de apariencia (fondo y colores) y los de contraste de las tarjetas; ajustar los que miran `--cat*`
- [ ] Un test por escenario (37) con `// Escenario: <título>`
- [ ] `python3 kit.py check` en verde

## Prueba en el navegador
- [ ] `python3 kit.py capturas` y revisión en claro y oscuro contra el preview

## Documentación
- [ ] `CLAUDE.md`: «Apariencia y fondo» y «Estilo» al sistema nuevo
