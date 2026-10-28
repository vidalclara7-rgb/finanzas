# Capacidad: movimientos

## Requisito: anotar un gasto

Con el botón «+» la persona abre «Nuevo movimiento», elige Gasto y anota importe, una de sus
cuentas, categoría, una nota opcional y la fecha, que por defecto es hoy. Las categorías de gasto
son las de la persona; al empezar: Supermercado, Comida fuera, Delivery, Transporte, Ocio, Compras, Ropa,
Belleza, Casa/Splitwise, Salud, Viajes, Regalos, Salidas bar/disco, Plan Iberia, Servicios mensuales,
Alquiler, Carga móvil, Trabajo (reembolsable) y Otros. La categoría se elige en un
desplegable, que termina con «Nueva categoría…» para crear una. El gasto baja el saldo de la cuenta o, si es una tarjeta,
sube su deuda.

### Escenario: gasto desde una cuenta propia
- **Dado** que hoy es 2026-10-15 y «Banco A» con saldo inicial de 1000 € desde el 2026-10-01
- **Cuando** la persona anota un gasto de 12,50 € en Supermercado desde Banco A con la nota «verdulería»
- **Entonces** la app avisa «Gasto guardado»
- **Y** el gasto aparece en Movimientos con «−12,5 €» y la fecha 15/10
- **Y** Banco A tiene 987,5 €

### Escenario: gasto en una categoría nueva
- **Dado** que hoy es 2026-10-15 y «Banco A» con saldo inicial de 1000 € desde el 2026-10-01
- **Cuando** la persona anota un gasto de 30 € en Carga móvil desde Banco A
- **Entonces** el gasto aparece en Movimientos como «Carga móvil» con «−30 €»
- **Y** Banco A tiene 970 €

### Escenario: elegir la categoría en el desplegable
- **Dado** el formulario de gasto abierto
- **Cuando** la persona abre el desplegable de categoría y elige Alquiler
- **Entonces** el desplegable muestra «Alquiler» elegida
- **Y** la última opción de la lista es «Nueva categoría…»

### Escenario: todas las categorías nuevas se pueden elegir
- **Dado** el formulario de gasto abierto
- **Cuando** la persona mira las categorías
- **Entonces** ve Salidas bar/disco, Plan Iberia, Servicios mensuales, Alquiler y Carga móvil
- **Y** «Otros» sigue siendo la última

### Escenario: importe en cero
- **Dado** el formulario de movimiento abierto
- **Cuando** la persona guarda con el importe en 0
- **Entonces** la app avisa «Poné un importe mayor que 0»
- **Y** no se guarda ningún movimiento

### Escenario: importe vacío
- **Dado** el formulario de movimiento abierto
- **Cuando** la persona guarda con el importe vacío
- **Entonces** el formulario sigue abierto con el aviso propio del teléfono de campo obligatorio
- **Y** no se guarda ningún movimiento

### Escenario: sin cuentas para anotar
- **Dado** que la persona no tiene cuentas
- **Cuando** toca «+» en Inicio
- **Entonces** la hoja dice «Primero creá una cuenta» con el botón «Crear cuenta»
- **Y** el botón abre «Nueva cuenta»

## Requisito: anotar un ingreso

En «Nuevo movimiento» la persona elige Ingreso y anota importe, cuenta, categoría, nota y fecha. Las
categorías de ingreso son las de la persona; al empezar: Sueldo, Reembolso, Reembolso por regalos, Venta o
trabajo extra, Regalo, Intereses y rendimientos, y Otros. El ingreso sube el saldo de la cuenta o, si es una tarjeta, baja su deuda.

### Escenario: ingreso extra
- **Dado** «Banco A» con 1000 €
- **Cuando** la persona anota un ingreso de 200 € en Venta o trabajo extra en Banco A con la nota «bicicleta»
- **Entonces** la app avisa «Ingreso guardado»
- **Y** aparece en Movimientos con «+200 €»
- **Y** Banco A tiene 1200 €

### Escenario: devolución en la tarjeta
- **Dado** «Tarjeta Y» con 350 € de deuda
- **Cuando** la persona anota un ingreso de 20 € en Reembolso en Tarjeta Y
- **Entonces** Tarjeta Y debe 330 €

### Escenario: reembolso por regalos
- **Dado** «Banco A» con 1000 € y un gasto de 80 € en Regalos este mes
- **Cuando** la persona anota un ingreso de 40 € en Reembolso por regalos en Banco A
- **Entonces** el ingreso aparece en Movimientos con «+40 €»
- **Y** el gasto en Regalos sigue siendo 80 € y los ingresos del mes suman 40 €

## Requisito: transferir entre cuentas

En «Nuevo movimiento» la persona elige Transferencia, una cuenta de origen, una de destino, el
importe y la fecha. La plata sale de una y entra en la otra: no es gasto ni ingreso y el patrimonio
no cambia. Pagar la tarjeta es una transferencia del banco a la tarjeta.

### Escenario: pagar la tarjeta
- **Dado** «Banco A» con 1000 € y «Tarjeta Y» con 350 € de deuda
- **Cuando** la persona transfiere 350 € de Banco A a Tarjeta Y
- **Entonces** la app avisa «Transferencia guardada»
- **Y** Banco A tiene 650 € y Tarjeta Y debe 0 €
- **Y** el patrimonio neto sigue en 650 € y los gastos del mes no cambian

### Escenario: misma cuenta de origen y destino
- **Dado** el formulario de transferencia abierto
- **Cuando** la persona elige Banco A como origen y como destino y guarda
- **Entonces** la app avisa «Elegí dos cuentas distintas» y no guarda nada

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

## Requisito: editar un movimiento

Tocar un movimiento abre su hoja con los datos cargados; guardar lo actualiza.

### Escenario: corregir un importe
- **Dado** un gasto de 20 € en Supermercado desde Banco A, que tiene 980 €
- **Cuando** la persona lo toca, cambia el importe a 25 € y guarda
- **Entonces** el gasto muestra «−25 €» y Banco A tiene 975 €

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

## Requisito: gasto por categoría

Inicio muestra lo gastado en el mes por categoría, de mayor a menor, incluidos los gastos
reembolsables. Ingresos, transferencias y ajustes no aparecen.

### Escenario: categorías ordenadas
- **Dado** 64,30 € en Supermercado, 42 € en Trabajo (reembolsable), 18 € en Comida fuera y un ingreso de 1500 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** «Por categoría» muestra Supermercado, Trabajo (reembolsable) y Comida fuera, en ese orden

### Escenario: sin gastos por categoría
- **Dado** que no hay gastos en el mes en curso
- **Cuando** la persona abre Inicio
- **Entonces** «Por categoría» dice «Todavía no anotaste gastos este mes. Tocá + para empezar.»

## Requisito: resultado del mes

Inicio muestra los ingresos, los gastos y el resultado del mes en curso (ingresos menos gastos).
Transferencias y ajustes no cuentan, y tampoco los gastos de «Trabajo (reembolsable)» ni los ingresos de
Reembolso: el resultado es el de la plata propia. Los totales de Movimientos sí los incluyen.

### Escenario: resultado con ingresos y gastos
- **Dado** ingresos de 1500 € en Sueldo y 200 € en Venta o trabajo extra, y gastos de 64,30 € y 18 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** ve ingresos 1700 €, gastos 82,3 € y resultado 1617,7 €

### Escenario: mes en negativo
- **Dado** un ingreso de 100 € y gastos por 150 € este mes
- **Cuando** la persona abre Inicio
- **Entonces** el resultado es -50 € y se marca en rojo

### Escenario: reembolsos fuera del resultado
- **Dado** un ingreso de 1000 € en Sueldo y otro de 50 € en Reembolso, y gastos de 200 € en Supermercado y 50 € en Trabajo (reembolsable) este mes
- **Cuando** la persona abre Inicio
- **Entonces** ve ingresos 1000 €, gastos 200 € y resultado 800 €
- **Y** en Movimientos, los totales son ingresos 1050 € y gastos 250 €

## Requisito: marcar un gasto como fijo

La hoja de gasto tiene la casilla «Gasto fijo», para lo que se repite al menos 12 meses: alquiler,
cuotas, seguros, suscripciones. No aparece en gastos de «Trabajo (reembolsable)». Al guardar un gasto
fijo con nota, los gastos siguientes con la misma categoría y la misma nota (sin distinguir
mayúsculas ni espacios de más) vienen con la casilla marcada. Desmarcar un gasto lo vuelve variable y
hace que los siguientes con esa nota ya no vengan marcados; los anteriores no cambian. Si la
categoría es «siempre fija», todo gasto de esa categoría cuenta como fijo y la casilla viene marcada, aunque
cambie el importe o la nota; desmarcarla en un gasto lo deja variable sólo a él. En Movimientos, los gastos
fijos llevan la etiqueta «Fijo».

### Escenario: gasto marcado como fijo
- **Dado** «Banco A» y ningún gasto este mes
- **Cuando** la persona anota 600 € en Casa/Splitwise con la nota «alquiler» y marca «Gasto fijo»
- **Entonces** su tarjeta en Movimientos dice «Fijo»
- **Y** Inicio muestra «Fijos 600 € · 100 %»

### Escenario: el siguiente viene marcado
- **Dado** un gasto fijo en Casa/Splitwise con la nota «alquiler» en septiembre 2026
- **Cuando** la persona abre un gasto nuevo, elige Casa/Splitwise y escribe la nota «Alquiler »
- **Entonces** la casilla «Gasto fijo» aparece marcada

### Escenario: desmarcar un fijo
- **Dado** dos gastos fijos «alquiler» en Casa/Splitwise, uno en septiembre y otro en octubre 2026
- **Cuando** la persona edita el de octubre y desmarca «Gasto fijo»
- **Entonces** el de octubre ya no dice «Fijo» y el de septiembre sí
- **Y** un gasto nuevo en Casa/Splitwise con la nota «alquiler» viene sin marcar

### Escenario: reembolsable sin casilla
- **Dado** la hoja de gasto abierta
- **Cuando** la persona elige Trabajo (reembolsable)
- **Entonces** no aparece la casilla «Gasto fijo»

### Escenario: sin nota no se arrastra
- **Dado** un gasto fijo en Ocio sin nota
- **Cuando** la persona abre un gasto nuevo y elige Ocio sin escribir nota
- **Entonces** la casilla «Gasto fijo» aparece sin marcar

### Escenario: categoría siempre fija con importe que cambia
- **Dado** «Siempre fija» activada en Servicios mensuales y gastos de 40 € en agosto y de 80 € en septiembre 2026 en esa categoría con notas distintas
- **Cuando** la persona abre Movimientos y mira Inicio en septiembre
- **Entonces** el gasto de septiembre dice «Fijo» aunque el importe haya cambiado
- **Y** Inicio muestra «Fijos 80 €» en el reparto de septiembre

## Requisito: sugerir gastos fijos

Cuando un mismo gasto (misma categoría y misma nota) aparece en tres meses de calendario seguidos,
con un importe parecido (lo de cada mes no se aparta más de un 10 % del promedio de los tres), y no
está marcado como fijo, Inicio muestra la tarjeta «¿“<nota>” es un gasto fijo?» con los botones «Sí,
es fijo» y «No». Se muestra una sugerencia a la vez, la de mayor importe. «Sí, es fijo» marca como
fijos todos los gastos ya anotados con esa categoría y nota, y los siguientes vienen marcados. «No»
hace que no se vuelva a preguntar por ese gasto. No se sugieren gastos sin nota, de «Trabajo
(reembolsable)» ni de categorías «siempre fijas».

### Escenario: sugerencia tras tres meses
- **Dado** que hoy es 2026-10-15 y gastos en Salud con la nota «gimnasio» de 30 € en agosto, 30 € en septiembre y 32 € en octubre
- **Cuando** la persona abre Inicio
- **Entonces** aparece la tarjeta «¿“gimnasio” es un gasto fijo?»

### Escenario: aceptar la sugerencia
- **Dado** la tarjeta «¿“gimnasio” es un gasto fijo?» con sus tres gastos de agosto a octubre
- **Cuando** la persona toca «Sí, es fijo»
- **Entonces** la tarjeta desaparece y los tres gastos dicen «Fijo» en Movimientos
- **Y** Inicio muestra «Fijos 32 €» en el reparto de octubre

### Escenario: rechazar la sugerencia
- **Dado** la tarjeta «¿“gimnasio” es un gasto fijo?»
- **Cuando** la persona toca «No» y vuelve a abrir la app
- **Entonces** la tarjeta no aparece y los gastos siguen sin la etiqueta «Fijo»

### Escenario: importe que cambia mucho
- **Dado** que hoy es 2026-10-15 y gastos en Casa/Splitwise con la nota «luz» de 40 € en agosto, 80 € en septiembre y 45 € en octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia

### Escenario: un mes salteado
- **Dado** que hoy es 2026-10-15 y gastos en Salud con la nota «gimnasio» de 30 € en julio, agosto y octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia

### Escenario: gastos sin nota
- **Dado** que hoy es 2026-10-15 y gastos de 100 € en Supermercado sin nota en agosto, septiembre y octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia

### Escenario: categoría siempre fija no se sugiere
- **Dado** que hoy es 2026-10-15, «Siempre fija» activada en Salud y gastos en Salud con la nota «gimnasio» de 30 € en agosto, septiembre y octubre
- **Cuando** la persona abre Inicio
- **Entonces** no aparece ninguna sugerencia

## Requisito: moneda de un movimiento

Al anotar o editar un movimiento la persona elige su moneda: EUR (la de siempre), USD, GBP u Otra,
con un código de tres letras. La moneda es una etiqueta: la app no convierte, así que saldos, topes y
totales suman el importe tal cual. Un movimiento sin moneda es en euros.

### Escenario: elegir USD
- **Dado** el formulario de gasto abierto con la moneda en EUR
- **Cuando** la persona elige USD, anota 20 y guarda
- **Entonces** el gasto queda con la moneda USD
- **Y** al editarlo, el selector muestra USD

### Escenario: otra moneda
- **Dado** el formulario de gasto abierto
- **Cuando** la persona elige Otra, escribe «chf», anota 15 y guarda
- **Entonces** el gasto queda con la moneda CHF

### Escenario: código de moneda inválido
- **Dado** el formulario con «Otra» elegida
- **Cuando** la persona escribe «ab» y guarda
- **Entonces** la app avisa «Poné un código de 3 letras, por ejemplo CHF» y no guarda nada

### Escenario: sin conversión
- **Dado** «Banco A» con 1000 € y un gasto de 20 USD desde Banco A
- **Cuando** la persona abre Cuentas
- **Entonces** Banco A tiene 980 €
- **Y** la hoja del movimiento avisa «Los totales no convierten monedas»

### Escenario: movimientos anteriores siguen en euros
- **Dado** movimientos guardados antes de este cambio, sin moneda
- **Cuando** la persona abre Movimientos
- **Entonces** los ve igual que antes, en euros

## Requisito: gasto en cuotas con la tarjeta

Al anotar un gasto en una tarjeta de crédito, la persona puede activar «Pagar en cuotas» e indicar
cuántas cuotas son (dos o más) y de cuánto es cada una. El importe del gasto es lo que debe en total
por la compra. Como gasto de cada mes cuenta sólo la cuota, desde el mes de la compra hasta la última
cuota. La tarjeta de la compra en Movimientos dice «Cuota 1 de 6», con la cuota de cada mes.

### Escenario: compra fraccionada
- **Dado** que hoy es 2026-10-15 y «Tarjeta Y» sin deuda
- **Cuando** la persona anota un gasto de 700 € en Compras con Tarjeta Y, en 3 cuotas de 240 €
- **Entonces** Tarjeta Y debe 700 €
- **Y** el gasto del mes en Compras es 240 €
- **Y** la tarjeta del gasto dice «Cuota 1 de 3»

### Escenario: cuotas en los meses siguientes
- **Dado** esa compra del 2026-10-15 en 3 cuotas de 240 €
- **Cuando** la persona mira el mes de noviembre de 2026
- **Entonces** el gasto de noviembre en Compras es 240 €
- **Y** la tarjeta dice «Cuota 2 de 3»

### Escenario: después de la última cuota
- **Dado** esa compra del 2026-10-15 en 3 cuotas de 240 €
- **Cuando** la persona mira el mes de enero de 2027
- **Entonces** esa compra no cuenta en el gasto de enero

### Escenario: cuota mayor que el total
- **Dado** el formulario de gasto en tarjeta, con 700 € de importe
- **Cuando** la persona pone 3 cuotas de 800 € y guarda
- **Entonces** la app avisa «La cuota no puede ser mayor que el total» y no guarda nada

### Escenario: menos de dos cuotas
- **Dado** el formulario de gasto en tarjeta con «Pagar en cuotas» activado
- **Cuando** la persona pone 1 cuota y guarda
- **Entonces** la app avisa «Poné 2 cuotas o más» y no guarda nada

### Escenario: cuota vacía
- **Dado** el formulario de gasto en tarjeta con «Pagar en cuotas» activado y 3 cuotas
- **Cuando** la persona guarda sin el valor de la cuota
- **Entonces** la app avisa «Poné el valor de cada cuota» y no guarda nada

### Escenario: cuotas y tope de la tarjeta
- **Dado** «Tarjeta Y» con tope mensual de 500 € y un gasto de 700 € en 3 cuotas de 240 €
- **Cuando** la persona abre Inicio en el mes de la compra
- **Entonces** Tarjeta Y muestra 260 € disponibles del tope

### Escenario: la opción sólo existe en tarjetas
- **Dado** el formulario de gasto con «Banco A», una cuenta de bancos
- **Cuando** la persona mira el formulario
- **Entonces** no ve «Pagar en cuotas»

### Escenario: borrar una compra en cuotas
- **Dado** una compra de 700 € en 3 cuotas
- **Cuando** la persona la borra y confirma
- **Entonces** desaparecen todas sus cuotas y la deuda de la tarjeta baja 700 €

## Requisito: seleccionar gastos

En Movimientos, el botón «Seleccionar» activa un modo en el que cada gasto del mes tiene una casilla.
La persona marca los que quiera y ve cuántos marcó. Ingresos, transferencias y ajustes no se pueden
marcar. «Cancelar» sale del modo sin cambios. «Con documento» filtra los gastos que tienen documentos.

### Escenario: marcar gastos
- **Dado** tres gastos y un ingreso este mes
- **Cuando** la persona toca «Seleccionar» y marca dos gastos
- **Entonces** ve «2 seleccionados»
- **Y** el ingreso no tiene casilla

### Escenario: salir sin cambios
- **Dado** el modo seleccionar con dos gastos marcados
- **Cuando** la persona toca «Cancelar»
- **Entonces** desaparecen las casillas y no cambia ningún gasto

### Escenario: salir de Movimientos cancela el modo seleccionar
- **Dado** el modo seleccionar con un gasto marcado
- **Cuando** la persona va a Inicio y vuelve a Movimientos
- **Entonces** no hay casillas ni gastos marcados y «Seleccionar» está disponible

### Escenario: filtrar los gastos con documento
- **Dado** cuatro gastos este mes, dos con documento
- **Cuando** la persona toca el filtro «Con documento»
- **Entonces** ve sólo esos dos gastos

### Escenario: sin gastos con documento
- **Dado** que ningún gasto del mes tiene documento
- **Cuando** la persona toca el filtro «Con documento»
- **Entonces** ve «Ningún gasto de este mes tiene documento.»

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
