# Capacidad: datos

## Requisito: copia de seguridad

En Ajustes la persona copia todos sus datos como texto, o los guarda en un archivo, y los restaura
pegando ese texto o eligiendo ese archivo. Restaurar pide un segundo toque y reemplaza todo lo que hay.
Una copia que no es válida se rechaza sin tocar nada.

### Escenario: restaurar una copia
- **Dado** una copia de seguridad hecha con dos gastos y una cuenta
- **Cuando** la persona la pega en una app vacía y toca «Restaurar copia» dos veces
- **Entonces** la app avisa «Copia restaurada» y aparecen los dos gastos y la cuenta

### Escenario: un solo toque no restaura
- **Dado** la app con un gasto y una copia de seguridad pegada con otros datos
- **Cuando** la persona toca «Restaurar copia» una vez
- **Entonces** el botón dice «Tocá de nuevo: reemplaza todo lo que tenés»
- **Y** los datos siguen iguales

### Escenario: copia inválida
- **Dado** la app con datos
- **Cuando** la persona pega «hola» y toca «Restaurar copia» dos veces
- **Entonces** la app avisa «Esa copia no es válida» y los datos siguen iguales

### Escenario: guardar la copia en un archivo
- **Dado** que hoy es 2026-10-15 y un gasto guardado
- **Cuando** la persona toca «Guardar copia en un archivo»
- **Entonces** se guarda el archivo «mis-finanzas-2026-10-15.json» con los mismos datos que la copia de texto

### Escenario: restaurar desde un archivo
- **Dado** un archivo de copia con dos gastos y una cuenta
- **Cuando** la persona lo elige en Ajustes y toca «Restaurar copia» dos veces
- **Entonces** la app avisa «Copia restaurada» y aparecen los dos gastos y la cuenta

### Escenario: archivo inválido
- **Dado** la app con datos
- **Cuando** la persona elige un archivo que no es una copia y toca «Restaurar copia» dos veces
- **Entonces** la app avisa «Esa copia no es válida» y los datos siguen iguales

## Requisito: aviso de copia pendiente

Ajustes dice cuándo fue la última copia, ya sea de texto o de archivo, y advierte que borrar el ícono de
la app o limpiar los datos del navegador borra todo. Inicio avisa cuando hay datos cargados y pasaron 7
días o más desde la última copia, o nunca hubo ninguna. El aviso desaparece al hacer una copia.

### Escenario: última copia en Ajustes
- **Dado** que hoy es 2026-10-15 y una copia hecha el 2026-10-12
- **Cuando** la persona abre Ajustes
- **Entonces** ve «Última copia: hace 3 días»
- **Y** ve la advertencia de que borrar el ícono de la app borra todos los datos

### Escenario: ninguna copia todavía
- **Dado** un gasto guardado y ninguna copia hecha
- **Cuando** la persona abre Ajustes
- **Entonces** ve «Todavía no hiciste ninguna copia.»

### Escenario: aviso en Inicio a los 7 días
- **Dado** que hoy es 2026-10-15, un gasto guardado y una copia hecha el 2026-10-08
- **Cuando** la persona abre Inicio
- **Entonces** ve el aviso «Hace 7 días que no hacés una copia de seguridad»

### Escenario: sin aviso antes de los 7 días
- **Dado** que hoy es 2026-10-15, un gasto guardado y una copia hecha el 2026-10-09
- **Cuando** la persona abre Inicio
- **Entonces** no ve el aviso de copia

### Escenario: aviso si nunca hubo copia
- **Dado** un gasto guardado y ninguna copia hecha
- **Cuando** la persona abre Inicio
- **Entonces** ve el aviso «Todavía no hiciste ninguna copia de seguridad»

### Escenario: sin datos no hay aviso
- **Dado** la app sin cuentas ni movimientos
- **Cuando** la persona abre Inicio
- **Entonces** no ve el aviso de copia

### Escenario: hacer la copia quita el aviso
- **Dado** el aviso de copia en Inicio
- **Cuando** la persona toca «Copiar copia de seguridad» en Ajustes y vuelve a Inicio
- **Entonces** el aviso ya no está
- **Y** Ajustes dice «Última copia: hoy»

### Escenario: cancelar el guardado no cuenta como copia
- **Dado** el aviso de copia en Inicio
- **Cuando** la persona toca «Guardar copia en un archivo» y cancela la hoja de compartir
- **Entonces** el aviso sigue en Inicio y Ajustes no cambia la fecha de la última copia

## Requisito: respaldo de lo que había al restaurar

Antes de reemplazar los datos al restaurar, la app guarda el texto de lo que había. Ajustes lo muestra en
«Respaldo guardado», con su fecha, y permite copiarlo, restaurarlo o descartarlo. Restaurarlo también
guarda lo que había en ese momento.

### Escenario: lo anterior queda guardado
- **Dado** que hoy es 2026-10-15 y un gasto de 20 € en la app
- **Cuando** la persona restaura una copia con otros datos
- **Entonces** Ajustes muestra «Respaldo guardado» con «Datos de antes de restaurar, del 15/10»

### Escenario: volver a lo anterior
- **Dado** un respaldo guardado con el gasto de 20 €
- **Cuando** la persona toca «Restaurar este respaldo» dos veces
- **Entonces** la app avisa «Copia restaurada» y vuelve el gasto de 20 €
- **Y** lo que había antes queda como nuevo respaldo

### Escenario: descartar el respaldo
- **Dado** un respaldo guardado
- **Cuando** la persona toca «Descartar» dos veces
- **Entonces** Ajustes ya no muestra «Respaldo guardado»

### Escenario: copiar el texto del respaldo
- **Dado** un respaldo guardado
- **Cuando** la persona toca «Copiar texto»
- **Entonces** la app avisa «Respaldo copiado» y el portapapeles tiene el texto guardado

## Requisito: datos que no se pueden leer

Si hay datos guardados pero la app no puede leerlos, no los reemplaza por una app vacía sin guardar el
original: lo guarda como respaldo, Inicio avisa y Ajustes lo ofrece para copiar o restaurar. Sin datos
guardados (primer uso) no hay respaldo ni aviso.

### Escenario: texto guardado dañado
- **Dado** datos guardados que no son un texto válido
- **Cuando** la persona abre la app
- **Entonces** la app abre vacía y Inicio avisa «No pude leer tus datos guardados»
- **Y** Ajustes muestra «Respaldo guardado» con «Datos que no se pudieron leer» y el texto original, sin cambios

### Escenario: datos que no son de la app
- **Dado** datos guardados con un texto válido pero que no es de la app
- **Cuando** la persona abre la app
- **Entonces** la app abre vacía y el texto original queda en el respaldo

### Escenario: primer uso
- **Dado** que no hay nada guardado
- **Cuando** la persona abre la app
- **Entonces** no hay aviso de datos ilegibles ni respaldo

### Escenario: datos de versiones anteriores sin fecha de copia
- **Dado** datos guardados por la versión anterior, sin ninguna copia hecha
- **Cuando** la persona abre la app actualizada
- **Entonces** sus datos están intactos
- **Y** Ajustes dice «Todavía no hiciste ninguna copia.»

### Escenario: copia de seguridad vieja
- **Dado** una copia de seguridad anterior a este cambio
- **Cuando** la persona la restaura
- **Entonces** la app avisa «Copia restaurada» y funciona con normalidad
