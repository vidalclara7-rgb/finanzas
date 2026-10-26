# Tareas: rediseno-metaballs

## Preview
- [x] Estilos nuevos en `index.html` (variables por tema, capa `.fondo`, tarjetas sobre el fondo) para poder mostrarlos
- [x] Plantilla del preview: pone la apariencia según el esquema del navegador (claro/oscuro) para las capturas
- [x] Crear el esqueleto del preview
- [x] Pantallas: Inicio, Movimientos, Cuentas, Cierre y Ajustes (con «Apariencia»), con datos y vacías
- [x] Una hoja de ejemplo (Nuevo movimiento) sobre el fondo
- [x] Comprobar el preview y sacar capturas a 390 px, apariencia clara y oscura
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] `settings.paleta` deja de usarse (se ignora sin migrar, sin error); `settings.apariencia` ausente o inválida = oscura; todo viaja en la copia

## Pantallas
- [x] Quitar `PALETAS`, `aplicarPaleta()`, los bloques `[data-paleta]` y la tarjeta «Paleta de colores» de Ajustes
- [x] Una sola paleta con dos temas (variables de `:root` y `[data-apariencia="oscura"]`) y las 19 categorías
- [x] Tarjetas neutras con franja de color (`.acento`, `.mov`) en vez de tarjetas de color
- [x] Estrellas (`.fondo::before` y `<b>`), con pausa y sin movimiento reducido
- [x] Apariencia por defecto oscura; orden Oscura, Clara, Automática; `theme-color` de cada tema
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Reescribir los tests de paleta y de color de tarjetas; tests de apariencia, estrellas, contraste en los dos temas y categorías distintas
- [x] Tests de `datos`: paleta antigua ignorada, apariencia por defecto oscura

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado, clara y oscura

## Documentación
- [x] `CLAUDE.md`: paleta única, dos temas, estrellas, tarjetas neutras
