# Capacidad: adjuntos

## Requisito: el extracto queda adjunto

El archivo importado queda guardado en el teléfono con su cuenta y el mes de su último movimiento. La hoja de la cuenta lista
sus adjuntos con nombre y mes, y se pueden abrir.

### Escenario: extracto importado queda en la cuenta
- **Dado** un extracto de Banco A de octubre 2026 importado
- **Cuando** la persona abre la hoja de Banco A
- **Entonces** ve el extracto en sus adjuntos con «octubre 2026»

## Requisito: adjuntar a mano

Desde la hoja de una cuenta, un solo botón, «Adjuntar archivo», adjunta una foto o un archivo de cualquier tipo, que queda en
el mes en curso. Si el archivo trae movimientos que la app puede leer, pregunta «Encontré N movimientos. ¿Querés revisarlos?»,
con «Revisar» y «Ahora no»; si la persona los importa, el adjunto pasa al mes de su último movimiento. Un adjunto se borra con
dos toques.

### Escenario: adjuntar una foto
- **Dado** la hoja de Banco A abierta
- **Cuando** la persona adjunta una foto «recibo.jpg» sin texto legible
- **Entonces** aparece en los adjuntos de Banco A con el mes en curso

### Escenario: adjuntar un archivo de cualquier tipo
- **Dado** la hoja de Banco A abierta
- **Cuando** la persona adjunta «contrato.docx»
- **Entonces** aparece en los adjuntos de Banco A y se puede abrir
- **Y** la app no pregunta por movimientos

### Escenario: un solo botón
- **Dado** la hoja de una cuenta abierta
- **Cuando** la persona mira la sección de adjuntos
- **Entonces** ve el botón «Adjuntar archivo» y no ve «Importar extracto»

### Escenario: archivo con movimientos
- **Dado** la hoja de Banco A abierta
- **Cuando** la persona adjunta un Excel con 3 movimientos
- **Entonces** el Excel queda en los adjuntos
- **Y** la app pregunta «Encontré 3 movimientos. ¿Querés revisarlos?»

### Escenario: revisar y guardar los movimientos
- **Dado** esa pregunta con un Excel de movimientos de octubre 2026
- **Cuando** la persona toca «Revisar» y guarda los 3 movimientos
- **Entonces** los movimientos son de Banco A
- **Y** el adjunto muestra «octubre 2026»

### Escenario: no revisar ahora
- **Dado** esa pregunta
- **Cuando** la persona toca «Ahora no»
- **Entonces** no se guarda ningún movimiento y el archivo sigue adjunto

### Escenario: archivo vacío
- **Dado** la hoja de Banco A abierta
- **Cuando** la persona elige un archivo de 0 bytes
- **Entonces** la app avisa «El archivo está vacío.» y no adjunta nada

### Escenario: borrar un adjunto
- **Dado** un adjunto en Banco A
- **Cuando** la persona toca su cruz y después «Borrar»
- **Entonces** el adjunto desaparece

## Requisito: adjuntar un documento a varios gastos

Con gastos marcados, «Adjuntar documento» permite elegir una foto o un archivo de cualquier tipo, que queda vinculado a todos
los gastos marcados. Cada gasto con documento muestra un clip, y su hoja lista sus documentos, que se abren y se pueden quitar
con dos toques. Un gasto puede tener varios documentos.

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

### Escenario: documento de cualquier tipo
- **Dado** el modo seleccionar con un gasto marcado
- **Cuando** la persona adjunta «presupuesto.xlsx»
- **Entonces** la app avisa «Documento adjuntado a 1 gasto» y la hoja del gasto lista «presupuesto.xlsx»

### Escenario: documento vacío
- **Dado** el modo seleccionar con un gasto marcado
- **Cuando** la persona elige un archivo de 0 bytes
- **Entonces** la app avisa «El archivo está vacío.» y no adjunta nada

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
