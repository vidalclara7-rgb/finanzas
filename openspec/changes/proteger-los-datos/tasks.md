# Tareas: proteger-los-datos

## Preview
- [x] Crear el esqueleto del preview
- [x] Pantalla «ajustes»: tarjeta «Copia de seguridad» (última copia, advertencia, copiar, guardar en archivo, elegir archivo, restaurar con confirmación) y tarjeta «Respaldo guardado»
- [x] Pantalla «inicio»: aviso de copia pendiente y aviso de datos que no se pudieron leer
- [x] Comprobar el preview y sacar capturas a 390 px, claro y oscuro
- [x] Gate 2: la persona aprueba el diseño

## Datos y migración
- [ ] Claves nuevas `finanzas-copia` y `finanzas-respaldo`, separadas de `finanzas-v1` (que no cambia); leerlas con tolerancia a lo inválido
- [ ] `load()`: guardar el texto original como respaldo (motivo «ilegible») antes de caer en la app vacía; sin nada guardado, no hay respaldo
- [ ] Datos y copias anteriores siguen valiendo sin las claves nuevas

## Pantallas
- [ ] Fecha de la última copia en Ajustes («hoy», «hace N días», «Todavía no hiciste ninguna copia.») y la advertencia
- [ ] Aviso en Inicio con datos cargados y 7 días o más sin copia (o nunca); desaparece al copiar
- [ ] «Guardar copia en un archivo» (hoja de compartir y, si no hay, descarga) con nombre «mis-finanzas-AAAA-MM-DD.json»; cancelar no cuenta
- [ ] «Copiar copia de seguridad» registra la fecha
- [ ] Elegir un archivo para restaurar: carga el texto en el cuadro de pegar
- [ ] «Restaurar copia» con segundo toque; copia inválida se rechaza antes de guardar nada
- [ ] Antes de reemplazar, guardar lo anterior como respaldo (motivo «restaurar»)
- [ ] Tarjeta «Respaldo guardado» en Ajustes: copiar texto, restaurar este respaldo (con confirmación y guardando lo que había), descartar (dos toques)
- [ ] Aviso en Inicio de datos que no se pudieron leer
- [ ] Subir la versión de `CACHE` en `sw.js`

## Tests
- [ ] Un test por escenario de `datos` (23)
- [ ] Pruebas extra: texto del respaldo con HTML sin interpretarse, respaldo sin espacio en el almacenamiento, 390 px en claro y oscuro sin desbordes

## Prueba en el navegador
- [ ] `python3 kit.py check` en verde
- [ ] `python3 kit.py capturas` y comparar con el preview aprobado, claro y oscuro

## Documentación
- [ ] Actualizar la copia de seguridad, las claves de almacenamiento y las pantallas en `CLAUDE.md`
