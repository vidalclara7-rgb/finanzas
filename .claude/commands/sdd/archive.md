---
description: Cierra un cambio construido — funde su delta en openspec/specs/, lo mueve a openspec/changes/archive/ y prepara la publicación.
---

Cierras un cambio que ya pasó el Gate 3. Cambio, si lo indican: $ARGUMENTS (si no, el único en curso).

1. `python3 kit.py check`. En rojo no se archiva: se dice qué falla y se para.
2. `python3 kit.py archive <cambio>`: enseña, sin tocar nada, qué requisitos se añaden, se sustituyen
   o se retiran en cada especificación viva. Si el cambio no está `construida`, el script se niega.
3. **En el mensaje**, esa lista tal cual. `AskUserQuestion`: **Archivar** · **Todavía no**.
4. Al aprobar: `python3 kit.py archive <cambio> --aplicar`. Funde el delta en
   `openspec/specs/<capacidad>/spec.md` y mueve la carpeta entera a
   `openspec/changes/archive/AAAA-MM-DD-<cambio>/`.
5. `python3 kit.py check` otra vez: la especificación viva tiene que seguir con un test por escenario.
6. Commit y push a la rama de trabajo.
7. Resume en tres líneas: qué se construyó, qué capacidades cambiaron y qué quedó pendiente.

## Publicar es otra decisión

Archivar no publica. La app se publica desde `main` y **le llega a todas las personas que usan el
link**. Después de archivar, pregunta con `AskUserQuestion`: **Abrir PR a main** · **Todavía no**.
Sólo con la respuesta afirmativa se abre el PR; el merge lo decide la persona.

No fundas el delta a mano ni borras nada: la propuesta, el diseño, las tareas y el preview se
archivan, porque son la memoria de por qué la app es como es.
