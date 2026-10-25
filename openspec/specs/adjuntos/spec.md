# Capacidad: adjuntos

## Requisito: el extracto queda adjunto

El PDF importado queda guardado en el teléfono con su cuenta y el mes de su último movimiento. La
hoja de la cuenta lista sus adjuntos con nombre y mes, y se pueden abrir.

### Escenario: extracto importado queda en la cuenta
- **Dado** un extracto de Banco A de octubre 2026 importado
- **Cuando** la persona abre la hoja de Banco A
- **Entonces** ve el extracto en sus adjuntos con «octubre 2026»

## Requisito: adjuntar a mano

Desde la hoja de una cuenta, la persona adjunta un PDF o una foto, que queda en el mes en curso. Un
adjunto se borra con dos toques.

### Escenario: adjuntar una foto
- **Dado** la hoja de Banco A abierta
- **Cuando** la persona adjunta una foto «recibo.jpg»
- **Entonces** aparece en los adjuntos de Banco A con el mes en curso

### Escenario: borrar un adjunto
- **Dado** un adjunto en Banco A
- **Cuando** la persona toca su cruz y después «Borrar»
- **Entonces** el adjunto desaparece

## Requisito: los adjuntos no van en la copia

Los adjuntos ocupan lugar en el teléfono y no entran en la copia de seguridad de texto. Ajustes lo
dice junto a la copia, con cuántos adjuntos hay.

### Escenario: aviso en Ajustes
- **Dado** dos adjuntos guardados
- **Cuando** la persona abre Ajustes
- **Entonces** ve «Tus 2 adjuntos no entran en la copia: guardalos aparte si los necesitás.»
