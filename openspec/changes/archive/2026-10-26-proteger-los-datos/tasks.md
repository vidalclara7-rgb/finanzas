# Tareas: proteger-los-datos

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «ajustes»: tarjeta «Copia de seguridad» (última copia, advertencia, copiar, guardar en archivo, elegir archivo, restaurar con confirmación) y tarjeta «Respaldo guardado»
- [x] Pantalla «inicio»: aviso de copia pendiente y aviso de datos que no se pudieron leer
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [x] Claves nuevas `finanzas-copia` y `finanzas-respaldo`, separadas de `finanzas-v1` (que no cambia); leerlas con tolerancia a lo inválido
- [x] `load()`: guardar el texto original como respaldo (motivo «ilegible») antes de caer en la app vacía; sin nada guardado, no hay respaldo
- [x] Datos y copias anteriores siguen valiendo sin las claves nuevas

## Pantallas
- [x] Fecha de la última copia en Ajustes («hoy», «hace N días», «Todavía no hiciste ninguna copia.») y la advertencia
- [x] Aviso en Inicio con datos cargados y 7 días o más sin copia (o nunca); desaparece al copiar
- [x] «Guardar copia en un archivo» (hoja de compartir y, si no hay, descarga) con nombre «mis-finanzas-AAAA-MM-DD.json»; cancelar no cuenta
- [x] «Copiar copia de seguridad» registra la fecha
- [x] Elegir un archivo para restaurar: carga el texto en el cuadro de pegar
- [x] «Restaurar copia» con segundo toque; copia inválida se rechaza antes de guardar nada
- [x] Antes de reemplazar, guardar lo anterior como respaldo (motivo «restaurar»)
- [x] Tarjeta «Respaldo guardado» en Ajustes: copiar texto, restaurar este respaldo (con confirmación y guardando lo que había), descartar (dos toques)
- [x] Aviso en Inicio de datos que no se pudieron leer
- [x] Subir la versión de `CACHE` en `sw.js`

## Tests
- [x] Un test por escenario de `datos` (23)
- [x] Pruebas extra: texto del respaldo con HTML sin interpretarse, respaldo sin espacio en el almacenamiento, 390 px en claro y oscuro sin desbordes

## Prueba en el navegador
- [x] `python3 kit.py check` en verde
- [x] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [x] Actualizar la copia de seguridad, las claves de almacenamiento y las pantallas en `CLAUDE.md`
