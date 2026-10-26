# Tareas: rediseno-metaballs

## Preview
- [x] Estilos nuevos en `index.html` (variables por paleta y apariencia, capa `.fondo`, tarjetas sobre el fondo) para poder mostrarlos
- [x] Plantilla del preview: pone la apariencia según el esquema del navegador (claro/oscuro) para las capturas
- [x] Crear el esqueleto del preview
- [x] Pantallas: Inicio, Movimientos, Cuentas, Cierre y Ajustes (con «Apariencia»), con datos y vacías
- [x] Una hoja de ejemplo (Nuevo movimiento) sobre el fondo
- [x] Comprobar el preview y sacar capturas a 390 px, apariencia clara y oscura
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [ ] `settings.apariencia?: "oscura"|"clara"|"auto"`: ausente o inválido = oscura, sin tocar `norm()`; viaja en la copia

## Pantallas
- [ ] Script en el `<head>` que pone `data-apariencia` antes de pintar (con `try/catch`); `auto` sigue al teléfono y escucha los cambios
- [ ] Bloques oscuros de cada paleta pasan de `prefers-color-scheme` a `[data-apariencia="oscura"]`
- [ ] Capa `.fondo` con cinco manchas en el HTML; movimiento lento; sin movimiento con «Reducir movimiento»; pausa con `visibilitychange`
- [ ] Encabezado, barra, hojas y tarjetas sobre el fondo, con contraste 4,5 a 1 en las cuatro paletas y las dos apariencias
- [ ] «Apariencia» en Ajustes (Oscura, Clara, Automática) con su persistencia
- [ ] `theme-color` y barra de estado acompañan a la apariencia
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `apariencia` (13), `interfaz` (los nuevos y los reescritos) y `datos` (4)
- [ ] Ayuda de tests: fijar la apariencia en vez del esquema del navegador; reescribir los tests que asumían el fondo gris claro
- [ ] Pruebas extra: contraste real del texto sobre las manchas (peor caso), 390 px en las dos apariencias, sin peticiones externas

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado, apariencia clara y oscura

## Documentación
- [ ] `CLAUDE.md`: apariencia, fondo de manchas, variables y pantallas
