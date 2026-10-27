# Tareas: paletas-oscura-y-clara

## Preview
- [x] Estilos en `index.html`: paletas Jardín y Brûlée con ranuras de color `--k1` a `--k5`, tarjetas de color sólido, gastos del color de su categoría, números en monoespaciada, logo; quitar el fondo de manchas y los degradados
- [x] Crear el esqueleto del preview
- [x] Pantallas: Inicio, Movimientos y Cuentas, con datos y vacías
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [ ] Gate 2: la persona aprueba el diseño

## Datos y migración
- [ ] Sin datos nuevos: `apariencia` y `paleta` se tratan como hasta ahora

## Pantallas
- [ ] Todas las tarjetas de color con su ranura (`cTipo()`, avisos, conciliación, checklist, resumen de inversión…) y neutras «Gasto del mes», hojas y formularios
- [ ] Gastos como tarjetas sólidas del color de su categoría; ingresos en verde
- [ ] Logo «mf.» en el encabezado de Inicio (sólo en Inicio); letra sans y números monoespaciados
- [ ] `theme-color` de cada apariencia; quitar `.fondo`, estrellas, movimiento y `en-pausa`
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `apariencia` (3) e `interfaz` (14); retirar los de manchas, estrellas y movimiento del fondo y reescribir los que asumían tarjetas neutras
- [ ] Pruebas extra: contraste de cada color de tarjeta en las dos apariencias, 390 px sin desbordes

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado

## Documentación
- [ ] `CLAUDE.md`: paletas, bloques de color, letra y números, logo
