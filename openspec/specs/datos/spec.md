# Capacidad: datos

## Requisito: los datos quedan sólo en el teléfono

Todo lo que la persona carga queda guardado en su dispositivo y sigue ahí al cerrar y volver a abrir
la app. La app no se comunica con ningún otro sitio.

### Escenario: se conserva al volver a abrir
- **Dado** un gasto y una cuenta guardados
- **Cuando** la persona cierra la app y la vuelve a abrir
- **Entonces** el gasto y la cuenta siguen ahí

### Escenario: nada sale del teléfono
- **Dado** la app abierta
- **Cuando** la persona anota un gasto y crea una cuenta
- **Entonces** la app no hace ninguna petición a otro sitio

## Requisito: copia de seguridad

En Ajustes la persona copia todos sus datos como texto y los restaura pegando ese texto. Restaurar
reemplaza todo lo que hay. Un texto que no es una copia válida se rechaza sin tocar nada.

### Escenario: restaurar una copia
- **Dado** una copia de seguridad hecha con dos gastos y una cuenta
- **Cuando** la persona la pega en una app vacía y toca «Restaurar copia»
- **Entonces** la app avisa «Copia restaurada» y aparecen los dos gastos y la cuenta

### Escenario: copia inválida
- **Dado** la app con datos
- **Cuando** la persona pega «hola» y toca «Restaurar copia»
- **Entonces** la app avisa «Esa copia no es válida» y los datos siguen iguales

## Requisito: datos de versiones anteriores siguen valiendo

Quien usaba una versión anterior no pierde nada al actualizar. Sus gastos pasan a cuentas que la app
crea sola: «Tarjeta» (tarjeta de crédito), «Revolut» y «Débito/efectivo» (bancos y efectivo), sólo
las que tengan gastos o tope, con sus topes y con saldo inicial cero desde el mes de su primer gasto.
Si había anotado el saldo del fondo, se crea «Fondo de emergencia», marcada como fondo, con el último
saldo anotado. Las cinco tareas del checklist anterior pasan a ser tareas propias, con los importes
que tenían, y conservan lo marcado. Hasta la primera conciliación, esos saldos no reflejan la realidad. Las copias de
seguridad de versiones anteriores se convierten igual al restaurarlas.

### Escenario: datos de la primera versión
- **Dado** datos de la primera versión con topes de 500 € y 300 €, gastos con Tarjeta, Revolut y Débito/efectivo, y el fondo anotado en 150 €
- **Cuando** la persona abre la app actualizada
- **Entonces** Cuentas muestra Tarjeta, Revolut, Débito/efectivo y Fondo de emergencia con 150 €
- **Y** Movimientos muestra los mismos gastos del mes, cada uno en su cuenta
- **Y** Inicio muestra Tarjeta con 435,7 € disponibles

### Escenario: checklist anterior convertido
- **Dado** datos de la primera versión con un aporte de 100 €, tope de Revolut de 300 € y la primera tarea de octubre marcada
- **Cuando** la persona abre la app actualizada
- **Entonces** el checklist tiene cinco tareas, entre ellas «Transferir 100 € al fondo» y «Transferir 300 € a Revolut»
- **Y** «Transferir 100 € al fondo» sigue marcada en octubre

### Escenario: sólo las cuentas usadas
- **Dado** datos de la primera versión sin topes y con gastos sólo en Tarjeta
- **Cuando** la persona abre la app actualizada
- **Entonces** Cuentas muestra sólo Tarjeta

### Escenario: abrir dos veces no duplica
- **Dado** datos de la primera versión ya convertidos al abrir la app
- **Cuando** la persona la vuelve a abrir
- **Entonces** las cuentas y los movimientos son los mismos, sin duplicados

### Escenario: datos de la versión con cuentas
- **Dado** datos guardados con cuentas que tenían su saldo escrito a mano
- **Cuando** la persona abre la app actualizada
- **Entonces** cada cuenta conserva ese saldo como saldo de partida

### Escenario: copia de seguridad de la primera versión
- **Dado** una copia de seguridad de la primera versión
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada» y la convierte igual que al abrir la app

## Requisito: resumen del mes para copiar

En Ajustes, «Copiar resumen del mes» copia un texto con los ingresos, los gastos y el resultado del
mes, el saldo de cada cuenta con su estado de conciliación, el disponible de las cuentas con tope, el
fondo frente al plan, cuántas tareas del checklist están hechas, lo gastado por categoría y el
patrimonio neto.

### Escenario: resumen con conciliación
- **Dado** los datos de ejemplo de octubre 2026, con Banco A conciliada
- **Cuando** la persona toca «Copiar resumen del mes»
- **Entonces** el texto empieza con «Resumen octubre 2026» e incluye ingresos, gastos y resultado
- **Y** incluye una línea por cuenta con su saldo y «conciliada» o «sin conciliar»

## Requisito: reembolsables guardados antes de los estados

Los gastos de «Trabajo (reembolsable)» guardados antes de este cambio, o que vienen en una copia de
seguridad anterior, quedan como Pendientes. Nada más cambia.

### Escenario: reembolsables anteriores
- **Dado** datos guardados con dos gastos de Trabajo (reembolsable) sin estado
- **Cuando** la persona abre la app actualizada
- **Entonces** los dos aparecen como «Pendiente» y suman en «Por cobrar»

### Escenario: copia anterior con reembolsables
- **Dado** una copia de seguridad con un gasto de Trabajo (reembolsable) sin estado
- **Cuando** la persona la restaura
- **Entonces** el gasto aparece como «Pendiente»

## Requisito: la paleta viaja con los datos

La paleta elegida se guarda con los datos y viaja en la copia de seguridad. Los datos y las copias de
antes de este cambio, que no tienen paleta, se ven con Viva.

### Escenario: datos sin paleta
- **Dado** datos guardados antes de poder elegir paleta
- **Cuando** la persona abre la app actualizada
- **Entonces** la app se ve con la paleta Viva y sus datos siguen iguales

### Escenario: copia con paleta
- **Dado** una copia de seguridad hecha con la paleta Pastel crema
- **Cuando** la persona la restaura
- **Entonces** la app pasa a la paleta Pastel crema

## Requisito: gastos fijos en datos anteriores

Los gastos guardados antes de este cambio no tienen la marca de fijo: cuentan como variables y entran
en las sugerencias. La marca de cada gasto y las sugerencias respondidas viajan en la copia de
seguridad.

### Escenario: datos sin marca de fijo
- **Dado** datos guardados antes de este cambio con gastos de 300 € este mes
- **Cuando** la persona abre la app actualizada
- **Entonces** Inicio muestra «Variables 300 € · 100 %» y los movimientos siguen iguales

### Escenario: copia anterior sin fijos
- **Dado** una copia de seguridad hecha antes de este cambio
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada» y sus gastos cuentan como variables

### Escenario: copia con fijos y una sugerencia rechazada
- **Dado** una copia con un gasto fijo «alquiler» y la sugerencia de «gimnasio» respondida con «No»
- **Cuando** la persona la restaura
- **Entonces** el gasto «alquiler» dice «Fijo» y no aparece la sugerencia de «gimnasio»

## Requisito: datos anteriores a la importación

Lo guardado antes de este cambio, y las copias de seguridad anteriores, siguen igual: las cuentas no
tienen extractos asociados y no hay categorías aprendidas ni adjuntos.

### Escenario: datos sin importaciones
- **Dado** datos guardados con cuentas y movimientos, sin ninguna importación
- **Cuando** la persona abre la app actualizada
- **Entonces** ve sus cuentas y movimientos como antes
- **Y** al importar el primer extracto de una cuenta, la app le pide elegir a cuál corresponde

## Requisito: Súper pasa a llamarse Supermercado

La categoría de gasto «Súper» se llama ahora «Supermercado». Los gastos guardados con «Súper», las
categorías aprendidas al importar y los gastos fijos de esa categoría pasan a «Supermercado» al abrir
la app y al restaurar una copia, sin perder nada.

### Escenario: datos con Súper
- **Dado** datos guardados con dos gastos en Súper y un gasto fijo «verdulería» en Súper
- **Cuando** la persona abre la app actualizada
- **Entonces** los dos gastos están en Supermercado y un gasto nuevo en Supermercado con la nota «verdulería» viene marcado como fijo

### Escenario: copia vieja con Súper
- **Dado** una copia de seguridad con un gasto en Súper
- **Cuando** la persona la restaura
- **Entonces** el gasto aparece en Supermercado

## Requisito: movimientos guardados antes de la moneda

Los movimientos guardados antes de poder elegir la moneda siguen valiendo sin cambios y se tratan
como euros, tanto al abrir la app como al restaurar una copia de seguridad vieja.

### Escenario: datos de la versión anterior
- **Dado** datos con tres gastos sin moneda
- **Cuando** la persona abre la app actualizada
- **Entonces** Movimientos y los totales del mes son los de antes
- **Y** ningún gasto muestra una moneda distinta de euros

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** sus movimientos aparecen en euros y la app funciona con normalidad

### Escenario: la moneda viaja en la copia
- **Dado** un gasto de 20 USD
- **Cuando** la persona copia los datos y los restaura
- **Entonces** el gasto vuelve con USD

## Requisito: gastos de tarjeta guardados antes de las cuotas

Los gastos guardados antes de poder fraccionar siguen valiendo sin cambios: no tienen cuotas y cuentan
entero en su mes, tanto al abrir la app como al restaurar una copia de seguridad vieja. Las cuotas
viajan en la copia.

### Escenario: datos de la versión anterior
- **Dado** datos con un gasto de 100 € en «Tarjeta Y» sin cuotas
- **Cuando** la persona abre la app actualizada
- **Entonces** el gasto cuenta 100 € en su mes y la deuda de Tarjeta Y es la de antes

### Escenario: la copia conserva las cuotas
- **Dado** una compra de 700 € en 3 cuotas de 240 €
- **Cuando** la persona copia los datos y los restaura
- **Entonces** la compra vuelve con «Cuota 1 de 3» y 240 € como gasto del mes

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

## Requisito: inversiones guardadas antes de las posiciones

Las cuentas de inversión guardadas antes de poder cargar activos siguen valiendo igual, con su valor y
su total aportado, tanto al abrir la app como al restaurar una copia vieja. Activos y operaciones
viajan en la copia de seguridad.

### Escenario: datos de la versión anterior
- **Dado** datos con «Broker X», una inversión de 2100 € con 2000 € aportados y ningún activo
- **Cuando** la persona abre la app actualizada
- **Entonces** Broker X dice «+100 € (+5,0 %) sobre 2000 €» como antes
- **Y** el patrimonio neto no cambia

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** la app funciona con normalidad y no hay activos

### Escenario: la copia conserva las posiciones
- **Dado** «Fondo A» con una compra de 10 unidades a 50 €
- **Cuando** la persona copia los datos y los restaura
- **Entonces** «Fondo A» vuelve con 10 unidades y la misma compra

### Escenario: copia rota o con una operación huérfana
- **Dado** una copia con una operación que apunta a un activo que no existe
- **Cuando** la persona la restaura
- **Entonces** la app ignora esa operación, funciona con normalidad y no pierde lo demás
