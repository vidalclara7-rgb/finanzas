# Capacidad: datos

## Requisito: datos anteriores a la importación

Lo guardado antes de este cambio, y las copias de seguridad anteriores, siguen igual: las cuentas no
tienen extractos asociados y no hay categorías aprendidas ni adjuntos.

### Escenario: datos sin importaciones
- **Dado** datos guardados con cuentas y movimientos, sin ninguna importación
- **Cuando** la persona abre la app actualizada
- **Entonces** ve sus cuentas y movimientos como antes
- **Y** al importar el primer extracto de una cuenta, la app le pide elegir a cuál corresponde
