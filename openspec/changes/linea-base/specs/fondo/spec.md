# Capacidad: fondo

## Requisito: plan del fondo de emergencia

El plan acumula el aporte mensual desde el mes de inicio hasta llegar al objetivo, sin pasarlo. En
los meses sin aporte el acumulado se repite. La pestaña Mes lista cada mes del plan con su objetivo.

### Escenario: plan hasta el objetivo
- **Dado** un aporte de 100 €, un objetivo de 250 € y el inicio en 2026-09
- **Cuando** la persona abre Mes
- **Entonces** el plan tiene tres meses: septiembre 2026 con 100 €, octubre 2026 con 200 € y noviembre 2026 con 250 €

### Escenario: mes sin aporte
- **Dado** un aporte de 100 €, un objetivo de 1000 €, el inicio en 2026-09 y 2026-10 como mes sin aporte
- **Cuando** la persona abre Mes
- **Entonces** septiembre y octubre 2026 tienen 100 € y noviembre 2026 tiene 200 €

## Requisito: saldo del fondo y estado frente al plan

En Mes la persona anota el saldo del fondo del mes en curso. Inicio muestra el último saldo anotado y
su estado frente al plan del mes: «En plan» si llega, «Atrasado» con la diferencia si no llega,
«Anotá el saldo» si nunca se anotó y «Fuera del plan» si el mes en curso no está en el plan.

### Escenario: fondo en plan
- **Dado** un plan de 200 € para octubre 2026 y hoy 2026-10-15
- **Cuando** la persona anota 200 € en Mes y abre Inicio
- **Entonces** la app avisa «Saldo guardado»
- **Y** el fondo muestra 200 € con el estado «En plan»

### Escenario: fondo atrasado
- **Dado** un plan de 200 € para octubre 2026 y un saldo anotado de 150 €
- **Cuando** la persona abre Inicio
- **Entonces** el fondo muestra 150 € con el estado «Atrasado 50 €»

### Escenario: fondo sin anotar
- **Dado** los ajustes completos y ningún saldo anotado
- **Cuando** la persona abre Inicio
- **Entonces** el fondo dice «Sin anotar» con el estado «Anotá el saldo»
