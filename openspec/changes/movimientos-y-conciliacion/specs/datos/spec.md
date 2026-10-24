# Capacidad: datos

## Requisito: datos de versiones anteriores siguen valiendo

Quien usaba una versión anterior no pierde nada al actualizar. Sus gastos pasan a cuentas que la app
crea sola: «Tarjeta» (tarjeta de crédito), «Revolut» y «Débito/efectivo» (bancos y efectivo), sólo
las que tengan gastos o tope, con sus topes y con saldo inicial cero desde el mes de su primer gasto.
Si había anotado el saldo del fondo, se crea «Fondo de emergencia», marcada como fondo, con el último
saldo anotado. Hasta la primera conciliación, esos saldos no reflejan la realidad. Las copias de
seguridad de versiones anteriores se convierten igual al restaurarlas.

### Escenario: datos de la primera versión
- **Dado** datos de la primera versión con topes de 500 € y 300 €, gastos con Tarjeta, Revolut y Débito/efectivo, y el fondo anotado en 150 €
- **Cuando** la persona abre la app actualizada
- **Entonces** Cuentas muestra Tarjeta, Revolut, Débito/efectivo y Fondo de emergencia con 150 €
- **Y** Movimientos muestra los mismos gastos del mes, cada uno en su cuenta
- **Y** Inicio muestra Tarjeta con 435,7 € disponibles

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
