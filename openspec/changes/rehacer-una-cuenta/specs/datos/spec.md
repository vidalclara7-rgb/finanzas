# Capacidad: datos

## Requisito: respaldo antes de borrar los movimientos de una cuenta

Antes de borrar todos los movimientos de una cuenta, la app guarda el texto de lo que había como respaldo, igual que al
restaurar. Ajustes lo muestra en «Respaldo guardado», con su fecha y la cuenta, y se puede copiar, restaurar o descartar. Si el
respaldo que hay es de datos que no se pudieron leer, no se pisa: la app avisa y no borra.

### Escenario: lo anterior queda guardado al borrar
- **Dado** que hoy es 2026-11-02 y «Tarjeta Y» con tres movimientos
- **Cuando** la persona borra todos sus movimientos
- **Entonces** Ajustes muestra «Respaldo guardado» con «Datos de antes de borrar los movimientos de Tarjeta Y, del 02/11»

### Escenario: volver atrás
- **Dado** ese respaldo guardado
- **Cuando** la persona toca «Restaurar este respaldo» dos veces
- **Entonces** la app avisa «Copia restaurada» y Tarjeta Y vuelve a tener sus tres movimientos

### Escenario: no se pisa un respaldo de datos ilegibles
- **Dado** un respaldo de datos que no se pudieron leer y «Tarjeta Y» con movimientos
- **Cuando** la persona intenta borrar todos sus movimientos
- **Entonces** la app avisa «Antes de borrar, copiá o descartá el respaldo de datos que no se pudieron leer» y no borra nada

### Escenario: respaldos anteriores a este cambio
- **Dado** un respaldo guardado antes de este cambio, de antes de restaurar
- **Cuando** la persona abre Ajustes
- **Entonces** lo ve igual que antes, con «Datos de antes de restaurar»
