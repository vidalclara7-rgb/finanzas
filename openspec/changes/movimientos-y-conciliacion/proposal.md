---
cambio: movimientos-y-conciliacion
estado: diseno-aprobado
datos: migra
---
# Movimientos entre tus cuentas y conciliación mensual

## Por qué

La app se pensó para seguir un plan (topes y fondo). Lo que se necesita es llevar el orden del mes y
que el saldo de cada cuenta refleje la realidad al 100 %. Hoy no puede: los gastos van contra tres
cuentas fijas (Tarjeta, Revolut, Débito/efectivo), no hay ingresos ni transferencias, y el saldo de
las cuentas se escribe a mano. Así, el saldo que muestra la app y el del banco nunca se pueden
comparar.

## Qué cambia

- **Movimientos**: además de gastos, ingresos (Sueldo, Reembolso, Venta o trabajo extra, Regalo,
  Intereses y rendimientos, Otros) y transferencias entre cuentas (pagar la tarjeta, pasar plata a
  otra cuenta). Todos contra las cuentas que cada persona crea. Los movimientos se pueden editar.
- **Saldo calculado**: cada cuenta parte de un saldo inicial y su saldo se calcula con sus
  movimientos. Ya no se escribe a mano.
- **Conciliación mensual**: en el cierre del mes, la persona carga el saldo real de cada cuenta. Si
  coincide, queda conciliada; si no, ve la diferencia y puede registrarla como ajuste. Cambiar un
  movimiento de un mes conciliado devuelve esa cuenta a «sin conciliar».
- **Inicio** muestra el resultado del mes (ingresos, gastos y diferencia) y el disponible de cada
  cuenta que tenga tope. El plan del fondo sale de Inicio.
- **Topes** por cuenta (opcionales), en lugar de los dos fijos de Ajustes.
- **Fondo de emergencia**: es una cuenta más, marcada como fondo. Su plan se conserva y se sigue en
  el cierre del mes.
- La pestaña Gastos pasa a llamarse **Movimientos** y Mes pasa a ser **Cierre**, con la conciliación
  arriba y el checklist debajo.
- **Checklist propio**: cada persona agrega, edita y borra sus tareas del cierre. Quien ya usaba la
  app conserva las cinco de antes como tareas propias.
- **Gráficos**: barras de ingresos contra gastos de los últimos seis meses, y el anillo del tope pasa
  a cada cuenta con tope.

## A quién afecta

A todas las personas que usan el link. Se construye después de estilo-blanco-y-graficos. Al actualizar, la app convierte lo que tienen: crea las
cuentas Tarjeta, Revolut y Débito/efectivo (las que tengan gastos o tope) con sus topes y les asigna
los gastos, y crea «Fondo de emergencia» con el último saldo anotado. Esas cuentas arrancan con saldo
inicial cero: **hasta la primera conciliación, sus saldos no son reales**. Nada se pierde.

## Pantallas

Inicio, Movimientos (antes Gastos), hoja de nuevo movimiento, Cuentas, hoja de cuenta, Cierre (antes
Mes), hoja de conciliación, hoja de tarea del checklist y Ajustes.

## Fuera de alcance

- Adjuntar archivos a las cuentas: es el cambio siguiente.
- Importar el extracto del banco o cruzar movimiento a movimiento.
- Movimientos que se repiten solos (el sueldo de cada mes).
- Varias monedas.
