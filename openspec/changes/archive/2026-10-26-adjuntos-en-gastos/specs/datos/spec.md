# Capacidad: datos

## Requisito: adjuntos guardados antes de los documentos de gastos

Los adjuntos de cuenta y los extractos importados guardados antes de este cambio siguen en la hoja de
su cuenta, sin cambios. Los documentos de gastos tampoco entran en la copia de seguridad.

### Escenario: adjuntos anteriores intactos
- **Dado** un extracto adjunto a «Banco A» de una versión anterior
- **Cuando** la persona abre la app actualizada
- **Entonces** el extracto sigue en la hoja de Banco A y ningún gasto lo muestra

### Escenario: aviso en Ajustes cuenta los documentos de gastos
- **Dado** un adjunto de cuenta y un documento de gastos
- **Cuando** la persona abre Ajustes
- **Entonces** ve «Tus 2 adjuntos no entran en la copia: guardalos aparte si los necesitás.»

### Escenario: copia restaurada con gastos que ya no existen
- **Dado** un documento vinculado a un gasto que la copia restaurada no trae
- **Cuando** la persona restaura la copia
- **Entonces** la app funciona con normalidad y el documento no aparece en ningún gasto
