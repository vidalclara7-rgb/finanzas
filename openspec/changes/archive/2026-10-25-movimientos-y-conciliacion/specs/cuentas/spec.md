# Capacidad: cuentas

## Requisito: crear una cuenta con nombre libre

En la pestaña Cuentas la persona crea cuentas con el nombre que quiera, uno de cinco tipos (Bancos y
efectivo, Inversiones, Tarjetas de crédito, Financiaciones y Deudas compartidas) y el saldo con el
que parte, en positivo. Bancos y efectivo y Tarjetas de crédito pueden tener un tope de gasto
mensual; una cuenta de Bancos y efectivo se puede marcar como fondo de emergencia. Las cuentas se
agrupan por tipo, cada grupo con su total, y cada cuenta muestra si está conciliada este mes.

### Escenario: cuenta de banco
- **Dado** que hoy es 2026-10-15 y no hay cuentas
- **Cuando** la persona crea «Banco A» de tipo Bancos y efectivo con 1200 €
- **Entonces** la app avisa «Cuenta guardada»
- **Y** aparece en el grupo «Bancos y efectivo» con 1200 € y «Sin conciliar»

### Escenario: cuenta sin nombre
- **Dado** el formulario de cuenta abierto
- **Cuando** la persona guarda sin nombre
- **Entonces** la app avisa «Ponele un nombre a la cuenta» y no guarda nada

### Escenario: sin cuentas todavía
- **Dado** que no hay cuentas
- **Cuando** la persona abre Cuentas
- **Entonces** ve la tarjeta «Tu foto financiera» y el botón «Agregar cuenta»
- **Y** Inicio no muestra el patrimonio neto

### Escenario: un solo fondo de emergencia
- **Dado** «Fondo A» marcada como fondo de emergencia
- **Cuando** la persona marca «Banco A» como fondo de emergencia y guarda
- **Entonces** Banco A es el fondo y Fondo A deja de serlo

## Requisito: saldo calculado con los movimientos

El saldo de cada cuenta es el saldo con el que partió más sus movimientos desde ese día: los gastos
restan, los ingresos suman, las transferencias pasan de una cuenta a otra y los ajustes de
conciliación corrigen. En tarjetas y financiaciones se muestra lo que se debe.

### Escenario: gasto con la tarjeta
- **Dado** «Tarjeta Y» con 350 € de deuda
- **Cuando** la persona anota un gasto de 50 € con Tarjeta Y
- **Entonces** Tarjeta Y debe 400 € y el patrimonio neto baja 50 €

### Escenario: movimientos anteriores al saldo de partida
- **Dado** «Banco A» creada con 1000 € el 2026-10-10 y un gasto de 30 € del 2026-10-05 en Banco A
- **Cuando** la persona abre Cuentas
- **Entonces** Banco A tiene 1000 €

## Requisito: editar y borrar una cuenta

Tocar una cuenta abre su formulario. Se pueden cambiar el nombre, el tope y los datos propios del
tipo; el saldo no se cambia a mano, se corrige conciliando. Borrar pide dos toques, y una cuenta con
movimientos no se puede borrar.

### Escenario: renombrar una cuenta
- **Dado** «Banco A» en la lista
- **Cuando** la persona la toca, cambia el nombre a «Banco principal» y guarda
- **Entonces** la cuenta se llama «Banco principal» y conserva su saldo y sus movimientos

### Escenario: borrar una cuenta sin movimientos
- **Dado** «Banco A» sin movimientos
- **Cuando** la persona toca Banco A, «Borrar cuenta» y «Tocá de nuevo para borrar»
- **Entonces** la app avisa «Cuenta borrada» y Banco A desaparece

### Escenario: cuenta con movimientos no se borra
- **Dado** «Banco A» con un gasto
- **Cuando** la persona toca Banco A, «Borrar cuenta» y «Tocá de nuevo para borrar»
- **Entonces** la app avisa «No se puede borrar: la cuenta tiene movimientos» y Banco A sigue

## Requisito: patrimonio neto de cada mes

Cada vez que cambia una cuenta o un movimiento, la app recuerda el patrimonio neto de ese mes, para
poder mostrar su evolución más adelante.

### Escenario: patrimonio del mes guardado
- **Dado** que hoy es 2026-10-15 y no hay cuentas
- **Cuando** la persona crea «Banco A» con 1200 € y anota un gasto de 200 € desde Banco A
- **Entonces** la copia de seguridad registra 1000 como patrimonio de 2026-10
