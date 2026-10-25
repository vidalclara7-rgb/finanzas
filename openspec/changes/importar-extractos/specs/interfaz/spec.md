# Capacidad: interfaz

## Requisito: los avisos no tapan botones

Con una hoja abierta, los avisos de la app («Gasto guardado», «4 movimientos importados»…) aparecen
arriba de la pantalla, sin tapar ningún botón de la hoja. Sin hoja abierta, aparecen sobre la barra de
navegación.

### Escenario: aviso con la hoja abierta
- **Dado** un extracto recién importado, con la hoja «Extracto importado» abierta
- **Cuando** aparece el aviso «2 movimientos importados»
- **Entonces** el aviso no se superpone con ningún botón de la hoja
