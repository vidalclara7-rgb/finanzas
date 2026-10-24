# Capacidad: fondo

## Requisito: configurar el plan del fondo

En Ajustes se cargan el aporte mensual al fondo, el objetivo, el mes del primer aporte y,
opcionalmente, los meses sin aporte separados por coma. El aporte y el objetivo tienen que ser
mayores que cero y el mes de inicio es obligatorio. Los meses sin aporte con formato distinto de
AAAA-MM se descartan.

### Escenario: plan completo
- **Dado** Ajustes vacío
- **Cuando** la persona carga 100, 1000, el mes 2026-09 y «2026-12, diciembre» y guarda
- **Entonces** la app avisa «Ajustes guardados»
- **Y** los meses sin aporte quedan como «2026-12»

### Escenario: plan incompleto
- **Dado** Ajustes vacío
- **Cuando** la persona guarda sin el objetivo del fondo
- **Entonces** la app avisa «Completá el aporte, el objetivo y el mes de inicio» y no guarda nada

## Requisito: saldo del fondo y estado frente al plan

El saldo del fondo es el de la cuenta marcada como fondo de emergencia. En Cierre, el plan muestra
cada mes con su objetivo y el saldo del fondo al cierre de ese mes, y el estado del mes en curso:
«En plan» si llega, «Atrasado» con la diferencia si no llega. Sin cuenta marcada como fondo, el plan
lo pide.

### Escenario: fondo en plan
- **Dado** un plan de 200 € para octubre 2026 y «Fondo» marcada como fondo con 200 €
- **Cuando** la persona abre Cierre
- **Entonces** el plan de octubre 2026 muestra «En plan»

### Escenario: fondo atrasado
- **Dado** un plan de 200 € para octubre 2026 y «Fondo» marcada como fondo con 150 €
- **Cuando** la persona abre Cierre
- **Entonces** el plan de octubre 2026 muestra «Atrasado 50 €»

### Escenario: sin cuenta de fondo
- **Dado** un plan configurado y ninguna cuenta marcada como fondo
- **Cuando** la persona abre Cierre
- **Entonces** el plan dice «Marcá una cuenta como fondo de emergencia para seguir el plan.»
