# Capacidad: datos

## Requisito: adjuntos guardados antes de aceptar cualquier tipo

Los adjuntos de cuenta, los extractos importados y los documentos de gastos guardados antes de este cambio (PDF y fotos)
siguen donde estaban y se abren igual. Los archivos de otros tipos tampoco entran en la copia de seguridad: el aviso de
Ajustes los cuenta junto con los demás.

### Escenario: adjuntos anteriores intactos
- **Dado** un PDF y una foto adjuntos a «Banco A» de una versión anterior
- **Cuando** la persona abre la app actualizada y la hoja de Banco A
- **Entonces** ve los dos adjuntos con su nombre y su mes y los puede abrir

### Escenario: el aviso cuenta todos los tipos
- **Dado** un PDF adjunto a una cuenta y un Excel adjunto a otra
- **Cuando** la persona abre Ajustes
- **Entonces** ve «Tus 2 adjuntos no entran en la copia: guardalos aparte si los necesitás.»
