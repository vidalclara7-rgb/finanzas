# Capacidad: meses

## Requisito: elegir el mes que se ve

Inicio, Movimientos y Cierre llevan junto al título un selector de mes con flechas (por ejemplo «‹ octubre 2026 ›») que cambia
el mes de las tres pantallas a la vez. Al abrir la app es el mes en curso y no se puede pasar de él. Todo lo que esas
pantallas muestran del mes es del mes elegido, y el patrimonio neto es el del cierre de ese mes (su último día, u hoy en el mes
en curso). En Cierre se puede conciliar y ajustar un mes ya cerrado. Anotar un movimiento nuevo sigue usando la fecha de hoy.

### Escenario: ver el mes anterior en Inicio
- **Dado** que hoy es 2026-11-02, un gasto de 40 € en Supermercado del 2026-10-20 y otro de 10 € del 2026-11-01
- **Cuando** la persona abre Inicio y toca la flecha ‹
- **Entonces** el selector dice «octubre 2026» y Inicio muestra gastos por 40 €
- **Y** la torta tiene sólo Supermercado

### Escenario: no pasa del mes en curso
- **Dado** que hoy es 2026-11-02
- **Cuando** la persona abre Inicio
- **Entonces** el selector dice «noviembre 2026» y la flecha › está desactivada

### Escenario: movimientos de otro mes
- **Dado** un gasto del 2026-10-20 y otro del 2026-11-01, y hoy es 2026-11-02
- **Cuando** la persona abre Movimientos y toca la flecha ‹
- **Entonces** ve sólo el gasto del 2026-10-20

### Escenario: el mes elegido se mantiene
- **Dado** el selector en octubre 2026 en Inicio
- **Cuando** la persona va a Movimientos y después a Cierre
- **Entonces** las dos pantallas muestran octubre 2026

### Escenario: al abrir la app, el mes en curso
- **Dado** el selector en octubre 2026
- **Cuando** la persona cierra y vuelve a abrir la app
- **Entonces** el selector dice «noviembre 2026»

### Escenario: conciliar un mes anterior
- **Dado** que hoy es 2026-11-02, «Banco A» con un saldo calculado de 900 € al 31 de octubre y Cierre en octubre 2026
- **Cuando** la persona concilia Banco A con 880 € de saldo real y registra el ajuste
- **Entonces** se crea un ajuste de −20 € con fecha 2026-10-31
- **Y** Banco A queda conciliada en octubre

### Escenario: patrimonio al cierre del mes
- **Dado** que hoy es 2026-11-02, «Banco A» con 1000 € el 31 de octubre y un gasto de 100 € del 2026-11-01
- **Cuando** la persona abre Inicio en octubre 2026
- **Entonces** el patrimonio neto es 1000 €
- **Y** en noviembre es 900 €

### Escenario: anotar sigue usando la fecha de hoy
- **Dado** Inicio en octubre 2026 y hoy es 2026-11-02
- **Cuando** la persona toca «+»
- **Entonces** la fecha del movimiento nuevo es 2026-11-02

### Escenario: mes sin datos
- **Dado** que hoy es 2026-11-02 y ningún movimiento en septiembre 2026
- **Cuando** la persona va a septiembre 2026 en Inicio
- **Entonces** Inicio muestra «Todavía no anotaste gastos este mes. Tocá + para empezar.» y el resultado es 0 €
