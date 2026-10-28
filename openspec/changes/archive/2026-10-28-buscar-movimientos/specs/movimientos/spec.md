# Capacidad: movimientos

## Requisito: ver los movimientos del mes

La pestaña Movimientos muestra los movimientos del mes en curso, del más reciente al más antiguo, cada uno en una
sola línea de poca altura: el concepto (la nota o, si no hay, la categoría), la fecha corta y el importe, sin icono. Cada
gasto lleva el color de su categoría, los ingresos van en verde, y las transferencias y los ajustes en gris. Ingresos con
«+», gastos con «−», transferencias con la cuenta de origen y la de destino como concepto. Si el movimiento no es en euros,
el importe lleva su moneda. Las marcas de un movimiento (documento, cuota, reembolso, fijo) van en una segunda fila fina, sólo
en los que las tienen. Sólo los ajustes llevan una cruz en la fila. Arriba, el total de ingresos y el de gastos del mes;
transferencias y ajustes no suman en ninguno. Inicio no repite la lista de gastos recientes: para verlos, se abre
Movimientos.

### Escenario: movimientos de otro mes no aparecen
- **Dado** que hoy es 2026-10-15, un gasto del 2026-09-28 y otro del 2026-10-03
- **Cuando** la persona abre Movimientos
- **Entonces** sólo ve el gasto del 2026-10-03

### Escenario: Inicio sin gastos recientes
- **Dado** seis gastos este mes
- **Cuando** la persona abre Inicio
- **Entonces** no ve tarjetas con los últimos gastos
- **Y** Movimientos muestra los seis, el más reciente primero

### Escenario: mes sin movimientos
- **Dado** que no hay movimientos en el mes en curso
- **Cuando** la persona abre Movimientos
- **Entonces** ve «Sin movimientos este mes.»

### Escenario: totales sin transferencias
- **Dado** un ingreso de 1500 €, un gasto de 80 € y una transferencia de 300 € este mes
- **Cuando** la persona abre Movimientos
- **Entonces** ve ingresos 1500 € y gastos 80 €

### Escenario: movimiento en otra moneda
- **Dado** un gasto de 20 USD este mes
- **Cuando** la persona abre Movimientos
- **Entonces** el movimiento muestra «−20 USD»

### Escenario: cada movimiento en una línea
- **Dado** diez gastos este mes, uno de ellos con nota
- **Cuando** la persona abre Movimientos con un teléfono de 390 px de ancho
- **Entonces** cada movimiento sin marcas mide como máximo 56 px de alto y no se solapa con el siguiente
- **Y** el que tiene nota muestra la nota y no muestra su categoría ni ningún icono

### Escenario: sin nota se ve la categoría
- **Dado** un gasto de Transporte sin nota
- **Cuando** la persona abre Movimientos
- **Entonces** el concepto del movimiento es «Transporte»

### Escenario: marcas en una segunda fila
- **Dado** un gasto con un documento adjunto y otro sin marcas
- **Cuando** la persona abre Movimientos
- **Entonces** el primero muestra su marca de documento en una segunda fila
- **Y** el segundo sigue en una sola línea

### Escenario: una descripción larga no desborda
- **Dado** un gasto con una nota de 80 caracteres
- **Cuando** la persona abre Movimientos
- **Entonces** la nota se corta con puntos suspensivos y el importe sigue completo a la derecha
- **Y** la pantalla no se desplaza hacia los lados

## Requisito: buscar movimientos

En Movimientos, una lupa arriba a la derecha, junto al engranaje, abre un campo de búsqueda. Mientras se escribe, la
lista pasa a mostrar los movimientos de todos los meses que coinciden, del más reciente al más antiguo, con su fecha
completa y la cantidad de resultados. Coincide por la nota, la categoría, la cuenta (también la de destino) y la fecha
escrita; si lo escrito es un número, también por el importe exacto. Con varias palabras, tienen que aparecer todas, en
cualquier orden, sin distinguir mayúsculas ni tildes. Mientras se busca no se ven los totales del mes ni las acciones de
la lista. Cerrar la búsqueda devuelve la lista del mes en curso.

### Escenario: buscar por comercio en todos los meses
- **Dado** un gasto «Panadería» del 2026-09-10 y otro del 2026-10-03, y un gasto «Cine» del 2026-10-05
- **Cuando** la persona toca la lupa y escribe «panaderia»
- **Entonces** ve «2 resultados» con los dos gastos de Panadería, el de octubre primero, cada uno con su fecha completa
- **Y** no ve «Cine»

### Escenario: buscar por categoría y cuenta
- **Dado** un gasto de Supermercado con Banco A y otro de Transporte con Tarjeta Y
- **Cuando** la persona busca «supermercado» y después «tarjeta y»
- **Entonces** la primera búsqueda muestra el gasto de Supermercado y la segunda el de Transporte

### Escenario: buscar por importe
- **Dado** un gasto de 12,50 € y otro de 125 €
- **Cuando** la persona busca «12,50»
- **Entonces** ve sólo el gasto de 12,50 €

### Escenario: varias palabras
- **Dado** un gasto con la nota «Cena con amigos» y otro con la nota «Cena en casa»
- **Cuando** la persona busca «amigos cena»
- **Entonces** ve sólo el gasto «Cena con amigos»

### Escenario: sin resultados
- **Dado** movimientos que no contienen «zzz»
- **Cuando** la persona busca «zzz»
- **Entonces** ve «Sin resultados para «zzz».»

### Escenario: abrir un resultado y volver
- **Dado** una búsqueda con un resultado de un mes anterior
- **Cuando** la persona lo toca, lo cierra sin cambiar nada
- **Entonces** vuelve a la búsqueda con el mismo texto y los mismos resultados

### Escenario: cerrar la búsqueda
- **Dado** una búsqueda con resultados de varios meses
- **Cuando** la persona cierra la búsqueda
- **Entonces** ve la lista del mes en curso con sus totales

### Escenario: salir de Movimientos cierra la búsqueda
- **Dado** una búsqueda abierta
- **Cuando** la persona va a Inicio y vuelve a Movimientos
- **Entonces** la búsqueda está cerrada y la lupa sólo se ve en Movimientos

### Escenario: borrar desde los resultados
- **Dado** un resultado de búsqueda
- **Cuando** la persona lo abre y borra el movimiento con dos toques
- **Entonces** vuelve a la búsqueda, el movimiento ya no está y la cantidad baja en uno

## Requisito: borrar un movimiento con confirmación

Borrar se hace desde la hoja del movimiento, abajo, con «Borrar movimiento»: el primer toque pide confirmar con «Tocá de
nuevo para borrar» y el segundo borra y cierra la hoja. Si el movimiento es el último gasto de un documento, la
confirmación dice «Tocá de nuevo: se borra también su documento». Los ajustes de conciliación, que no se abren, se borran
con dos toques sobre la cruz de su fila. Un movimiento nuevo no tiene «Borrar movimiento».

### Escenario: borrar con dos toques
- **Dado** un movimiento en la lista del mes
- **Cuando** la persona lo abre, toca «Borrar movimiento» y después «Tocá de nuevo para borrar»
- **Entonces** la app avisa «Movimiento borrado», la hoja se cierra y desaparece de la lista

### Escenario: un solo toque no borra
- **Dado** un movimiento en la lista del mes
- **Cuando** la persona lo abre, toca «Borrar movimiento» una vez y cierra la hoja
- **Entonces** el movimiento sigue en la lista

### Escenario: un movimiento nuevo no se borra
- **Dado** la hoja de nuevo movimiento abierta
- **Cuando** la persona mira el pie de la hoja
- **Entonces** no hay «Borrar movimiento»

### Escenario: borrar un ajuste de conciliación
- **Dado** un ajuste de conciliación en la lista del mes
- **Cuando** la persona toca su cruz y después «Borrar»
- **Entonces** la app avisa «Movimiento borrado» y el ajuste desaparece

### Escenario: borrar el último gasto de un documento
- **Dado** un gasto con un documento que no tiene otros gastos
- **Cuando** la persona abre el gasto y toca «Borrar movimiento»
- **Entonces** el botón dice «Tocá de nuevo: se borra también su documento»
