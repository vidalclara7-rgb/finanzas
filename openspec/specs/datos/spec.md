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
