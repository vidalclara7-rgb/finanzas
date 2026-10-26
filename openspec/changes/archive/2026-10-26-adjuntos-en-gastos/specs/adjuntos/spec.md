# Capacidad: adjuntos

## Requisito: adjuntar un documento a varios gastos

Con gastos marcados, «Adjuntar documento» permite elegir un PDF o una foto, que queda vinculado a todos
los gastos marcados. Cada gasto con documento muestra un clip, y su hoja lista sus documentos, que se
abren y se pueden quitar con dos toques. Un gasto puede tener varios documentos.

### Escenario: un documento para dos gastos
- **Dado** el modo seleccionar con dos gastos marcados
- **Cuando** la persona adjunta el PDF «factura.pdf»
- **Entonces** la app avisa «Documento adjuntado a 2 gastos»
- **Y** los dos gastos muestran un clip
- **Y** la hoja de cada uno lista «factura.pdf»

### Escenario: sin gastos marcados
- **Dado** el modo seleccionar sin ningún gasto marcado
- **Cuando** la persona mira la barra
- **Entonces** «Adjuntar documento» está desactivado

### Escenario: archivo que no se puede guardar
- **Dado** el modo seleccionar con un gasto marcado
- **Cuando** la persona elige un archivo que no es PDF ni foto
- **Entonces** la app avisa «Elegí un PDF o una foto» y no adjunta nada

### Escenario: quitar un documento de un gasto
- **Dado** «factura.pdf» vinculado a dos gastos
- **Cuando** la persona lo quita desde la hoja de uno, con dos toques
- **Entonces** ese gasto ya no lo lista
- **Y** el otro gasto sigue teniéndolo

### Escenario: borrar el último gasto de un documento
- **Dado** «factura.pdf» vinculado a un solo gasto
- **Cuando** la persona borra ese gasto
- **Entonces** la confirmación dice que también se borra el documento
- **Y** al confirmar, el documento ya no existe

### Escenario: borrar un gasto con documento compartido
- **Dado** «factura.pdf» vinculado a dos gastos
- **Cuando** la persona borra uno
- **Entonces** el documento sigue en el otro gasto
