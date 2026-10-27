# Tareas: kits-de-diseno

## Preview
- [x] Estilos en `index.html` (variables por kit y apariencia, letra, `.card.grad`, `.logo`, opciones de kit) y `?kit=` en la plantilla del preview
- [x] Crear el esqueleto del preview
- [x] Pantallas: Inicio (con datos y vacío) y Ajustes con la tarjeta «Diseño»
- [x] Comprobar el preview y sacar capturas a 390 px de los cuatro kits, claro y oscuro
- [ ] Gate 2: la persona aprueba el diseño

## Datos y migración
- [ ] `settings.kit?`: ausente o inválido = Índigo, sin tocar `norm()`; viaja en la copia; `settings.paleta` sigue ignorándose

## Pantallas
- [ ] Script del `<head>` con `data-kit`; `aplicarKit()` y la tarjeta «Diseño» en Ajustes (cambio al instante y recordado)
- [ ] Tarjetas con degradado (disponibles, «Cuotas del mes», patrimonio) y logo en el encabezado de Inicio
- [ ] Letra y números por kit
- [ ] `theme-color` sigue al fondo del kit
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `kits` (15), `apariencia` (4), `interfaz` (2) y `datos` (4); reescribir los tests que asumían los colores de los moodboards
- [ ] Pruebas extra: contraste del degradado en los 8 kits y apariencias, 390 px sin desbordes

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado

## Documentación
- [ ] `CLAUDE.md`: kits, letra, logo, tarjetas con degradado
