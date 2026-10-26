# Diseño: cuotas-a-la-vista

## Decisiones de la persona (2026-10-26)

- La tarjeta incluye **financiaciones y compras en cuotas de tarjeta**, en **Inicio** (descartadas: sólo
  financiaciones; dos tarjetas; ponerla en Cuentas).
- Las cuotas que faltan **bajan solas mes a mes** (descartadas: a mano, y una por cada pago registrado, que se
  descuadra si se salta o se repite un pago).
- Movimientos de una cuenta: **lista por cuenta con flechas de mes, en la hoja de la cuenta** (descartado: cambiar la
  pestaña Movimientos).

## Decisiones tomadas al escribir (a confirmar en el Gate 1)

- **«Faltan N» incluye la cuota de este mes**, como ya dice la hoja de cuentas («faltan 12, hasta septiembre 2027»
  desde octubre 2026). Cada mes que pasa, N baja en uno; al llegar a 0 la financiación no suma más.
- **Punto de partida:** se guarda el mes en que se cargó el número (`cuotasMes`). Se reinicia sólo si la persona
  cambia «cuotas que faltan»; editar otro dato de la cuenta no lo toca. Las financiaciones que ya tenían el número
  toman el mes en que se abre la app actualizada (no se descuenta nada hacia atrás).
- **Financiación sin «cuotas que faltan»:** cuenta su cuota todos los meses y muestra «sin fecha de fin»; no suma a
  «te quedan por pagar».
- **Compra en cuotas:** en el mes k de n suma su cuota, y faltan n − k + 1 (incluida la de este mes). Terminada, no aparece.
- **Te quedan por pagar** = cuota × cuotas que faltan, sumado (sin intereses ni descuentos).
- **Resumen de Cuentas** («Cuotas de financiaciones: X por mes») suma sólo las financiaciones con cuotas pendientes.
- **Lista de una cuenta:** los movimientos donde la cuenta es origen o destino, del mes elegido; empieza en el mes en
  curso; no se avanza más allá. Las compras en cuotas aparecen con la cuota de ese mes, como en Movimientos.
- **Editar desde la lista:** abre la hoja de movimiento y, al guardar o cerrar, vuelve a la lista del mismo mes.

## Cómo se implementa en index.html

- `cuentas[i].cuotasMes?: "AAAA-MM"` en cuentas de financiación; `norm()` lo pone al mes actual si hay `cuotas` y no
  hay `cuotasMes`, y lo descarta si no tiene la forma. Sin cambiar `v` ni la clave de `localStorage`.
- `cuotasFaltan(c, mes)` = `max(0, c.cuotas − meses entre cuotasMes y mes)`; `detalleCuenta()`, `totales().cuotas` y la
  tarjeta salen de ahí. Compras en cuotas: `cuotaEnMes()` ya da `cuotaN` y el total.
- `cuotasDelMes(mes)` arma la lista (financiaciones y compras) para la tarjeta y la hoja «Cuotas»; textos con `esc()`.
- Hoja `sheetCuotas` y `sheetMovsCta` en `HOJAS`; `abrirMovsCta(id, mes)`, con un estado para volver tras editar.
- Sube la versión de `CACHE` en `sw.js`.
