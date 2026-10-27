# Tareas: paletas-oscura-y-clara

## Preview
- [x] Estilos en `index.html` (paletas Brûlée y Jardín, números en monoespaciada, `.card.grad`, `.logo`); quitar lo de los kits
- [x] Crear el esqueleto del preview
- [x] Pantallas: Inicio y Movimientos, con datos y vacías
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [ ] Gate 2: la persona aprueba el diseño

## Datos y migración
- [ ] Sin datos nuevos: `settings.kit` no existe; `apariencia` y `paleta` se tratan como hasta ahora

## Pantallas
- [ ] Variables de color de las dos paletas y del degradado; letra sans y números monoespaciados
- [ ] Tarjetas con degradado (disponibles, «Cuotas del mes», patrimonio) y logo «mf.» en el encabezado de Inicio (sólo en Inicio)
- [ ] `theme-color` de cada apariencia
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `apariencia` (5) e `interfaz` (11); reescribir los que asumían los colores de los moodboards
- [ ] Pruebas extra: contraste del degradado en las dos apariencias, 390 px sin desbordes

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado

## Documentación
- [ ] `CLAUDE.md`: paletas, letra y números, degradado y logo
