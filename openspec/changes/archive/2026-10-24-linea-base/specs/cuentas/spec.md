# Capacidad: cuentas

## Requisito: crear una cuenta con nombre libre

En la pestaña Cuentas la persona crea cuentas con el nombre que quiera y uno de cinco tipos: Bancos y
efectivo, Inversiones, Tarjetas de crédito, Financiaciones y Deudas compartidas. Cada cuenta guarda un
importe en positivo y la fecha en que se actualizó. Las cuentas se agrupan por tipo, cada grupo con su
total.

### Escenario: cuenta de banco
- **Dado** que hoy es 2026-10-15 y no hay cuentas
- **Cuando** la persona crea «Banco A» de tipo Bancos y efectivo con 1200 €
- **Entonces** la app avisa «Cuenta guardada»
- **Y** aparece en el grupo «Bancos y efectivo» con 1200 € y «act. 15/10/26»

### Escenario: cuenta sin nombre
- **Dado** el formulario de cuenta abierto
- **Cuando** la persona guarda sin nombre
- **Entonces** la app avisa «Ponele un nombre a la cuenta» y no guarda nada

### Escenario: sin cuentas todavía
- **Dado** que no hay cuentas
- **Cuando** la persona abre Cuentas
- **Entonces** ve la tarjeta «Tu foto financiera» y el botón «Agregar cuenta»
- **Y** Inicio no muestra el patrimonio neto

## Requisito: patrimonio neto

El patrimonio neto es lo que se tiene menos lo que se debe. Suman los bancos, las inversiones y las
deudas compartidas a favor; restan las tarjetas, las financiaciones y las deudas compartidas en
contra. También se muestra el total de cuotas mensuales de las financiaciones. Aparece arriba en
Cuentas y en Inicio.

### Escenario: patrimonio con todos los tipos
- **Dado** Banco A con 1200 €, Broker X con 2100 €, Tarjeta Y con 350 €, Financiera Z con 600 € y 50 € de cuota, y Gastos del piso donde la persona debe 45 €
- **Cuando** la persona abre Cuentas
- **Entonces** el patrimonio neto es 2305 €, «Tenés 3300 €», «Debés 995 €»
- **Y** dice «Cuotas de financiaciones: 50 € por mes»

### Escenario: deuda compartida a favor
- **Dado** sólo una deuda compartida «Gastos del piso» donde a la persona le deben 30 €
- **Cuando** la persona abre Cuentas
- **Entonces** el patrimonio neto es 30 € y la cuenta dice «Te deben»

## Requisito: detalle según el tipo de cuenta

Cada tipo pide y muestra datos propios: en inversiones, lo aportado y la ganancia en euros y en
porcentaje; en tarjetas, el límite y lo disponible; en financiaciones, la cuota mensual, las cuotas
que faltan y el mes en que termina. Todos son opcionales salvo el importe.

### Escenario: ganancia de una inversión
- **Dado** Broker X con un valor de 2100 € y 2000 € aportados
- **Cuando** la persona abre Cuentas
- **Entonces** Broker X dice «+100 € (+5,0 %) sobre 2000 €»

### Escenario: disponible de una tarjeta
- **Dado** Tarjeta Y con 350 € de deuda y 1500 € de límite
- **Cuando** la persona abre Cuentas
- **Entonces** Tarjeta Y dice «Disponible 1150 € de 1500 €»

### Escenario: fin de una financiación
- **Dado** que hoy es 2026-10-15 y Financiera Z con 50 € de cuota y 12 cuotas por pagar
- **Cuando** la persona abre Cuentas
- **Entonces** Financiera Z dice «50 €/mes · faltan 12 (hasta septiembre 2027)»

## Requisito: editar y borrar una cuenta

Tocar una cuenta abre su formulario con los datos cargados. Guardar actualiza el importe y la fecha de
actualización. Borrar pide dos toques.

### Escenario: actualizar un saldo
- **Dado** Banco A con 1200 € actualizado el 2026-10-10 y hoy 2026-10-15
- **Cuando** la persona toca Banco A, cambia el saldo a 1250 € y guarda
- **Entonces** Banco A muestra 1250 € y «act. 15/10/26»

### Escenario: borrar una cuenta
- **Dado** Banco A en la lista
- **Cuando** la persona toca Banco A, «Borrar cuenta» y «Tocá de nuevo para borrar»
- **Entonces** la app avisa «Cuenta borrada» y Banco A desaparece

## Requisito: patrimonio neto de cada mes

Cada vez que se guarda o se borra una cuenta, la app recuerda el patrimonio neto de ese mes, para
poder mostrar su evolución más adelante.

### Escenario: patrimonio del mes guardado
- **Dado** que hoy es 2026-10-15 y no hay cuentas
- **Cuando** la persona crea «Banco A» con 1200 €
- **Entonces** la copia de seguridad registra 1200 como patrimonio de 2026-10
