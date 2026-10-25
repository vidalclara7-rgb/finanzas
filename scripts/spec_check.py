"""Comprueba openspec/: los cambios en curso, las especificaciones vivas y su
relación con los tests.

Cambio en curso (openspec/changes/<cambio>/):
  - proposal.md con `cambio:` igual al nombre de la carpeta y un `estado:` válido
  - al menos un specs/<capacidad>/spec.md (el delta), con requisitos y escenarios
  - `datos:` en proposal.md (sin-cambios, amplia, migra); si no es sin-cambios,
    requisitos en specs/datos/ que digan qué pasa con lo ya guardado
  - en `construida`: tasks.md sin tareas pendientes y un test por escenario

Especificación viva (openspec/specs/<capacidad>/spec.md): describe lo que la
app hace hoy, así que cada escenario tiene que tener su test, salvo los de los
requisitos que un cambio ya en construcción sustituye o retira (los prueba el delta).

Un requisito dice QUÉ hace la app, no CÓMO: sin ficheros, funciones ni
tecnologías. Y una app sin ninguna especificación también falla.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import openspec_lib as os_  # noqa: E402

DE_OTRA_CAPA = re.compile(
    r"\blocalStorage\b|\bsessionStorage\b|\bIndexedDB\b|\bservice worker\b|\bsw\.js\b|"
    r"\.html\b|\.js\b|\.css\b|\bJSON\b|\binnerHTML\b|\bCSS\b|\bDOM\b|"
    r"\b[a-z]+[A-Z]\w*\(\)|`[^`]*\(\)`"
)


DATOS = ("sin-cambios", "amplia", "migra")


def _rel(p: Path) -> str:
    return p.relative_to(os_.RAIZ).as_posix()


def sustituidos() -> dict[str, set[str]]:
    """Requisitos de la viva que un cambio ya en construcción (diseño aprobado o construido)
    sustituye o retira: sus escenarios los prueba el delta, no hace falta que conserven su test."""
    out: dict[str, set[str]] = {}
    for c in os_.cambios_activos():
        if not os_.al_menos(c, "diseno-aprobado"):
            continue
        for d in (c / "specs").glob("*/spec.md"):
            out.setdefault(d.parent.name, set()).update(r.nombre for r in os_.leer_spec(d).requisitos)
    return out


def revisar_spec(spec: os_.Spec, exigir_tests: bool, con_test: set[str], vivas: dict,
                 exentos: set[str] = frozenset()) -> tuple[list, int, int]:
    fallos, n_req, n_esc = [], 0, 0
    rel = _rel(spec.ruta)
    if not spec.requisitos:
        fallos.append(f"{rel}: no tiene ningún «## Requisito:» ni «## Retirado:»")
    for r in spec.requisitos:
        if r.retirado:
            viva = vivas.get(spec.capacidad)
            if not viva or r.nombre not in {x.nombre for x in viva.requisitos}:
                fallos.append(f"{rel}: retira «{r.nombre}», que no está en la especificación viva")
            continue
        n_req += 1
        if m := DE_OTRA_CAPA.search(r.cuerpo):
            fallos.append(f"{rel}: «{r.nombre}» habla de implementación («{m.group(0)}»): di qué hace, no cómo")
        if not r.escenarios:
            fallos.append(f"{rel}: «{r.nombre}» no tiene ningún «### Escenario:»")
        for titulo, cuerpo in r.escenarios:
            n_esc += 1
            for palabra in ("Dado", "Cuando", "Entonces"):
                if not re.search(rf"\*\*{palabra}\*\*", cuerpo):
                    fallos.append(f"{rel}: al escenario «{titulo}» le falta «**{palabra}**»")
            if exigir_tests and r.nombre not in exentos and titulo.lower() not in con_test:
                fallos.append(f"{rel}: el escenario «{titulo}» no tiene test (// Escenario: {titulo})")
    return fallos, n_req, n_esc


def revisar() -> tuple[list[str], list[str]]:
    fallos, notas = [], []
    con_test = os_.escenarios_con_test()
    vivas = {p.parent.name: os_.leer_spec(p) for p in sorted(os_.VIVAS.glob("*/spec.md"))}
    cambios = os_.cambios_activos()

    if not vivas and not cambios:
        if os_.APP.exists():
            fallos.append("La app existe (index.html) y no hay ninguna especificación en openspec/")
        else:
            notas.append("openspec/ vacío y sin app: nada que comprobar")
        return fallos, notas

    en_cambio = sustituidos()
    for cap, spec in vivas.items():
        f, nr, ne = revisar_spec(spec, True, con_test, {}, en_cambio.get(cap, set()))
        fallos += f
        notas.append(f"openspec/specs/{cap}: {nr} requisitos, {ne} escenarios")

    for c in cambios:
        fm = os_.frontmatter(c / "proposal.md")
        if not fm:
            fallos.append(f"{_rel(c)}: falta proposal.md con su cabecera (cambio:, estado:)")
            continue
        if fm.get("cambio") != c.name:
            fallos.append(f"{_rel(c)}/proposal.md: «cambio: {fm.get('cambio', '')}» no coincide con la carpeta")
        e = fm.get("estado", "")
        if e not in os_.ESTADOS[:-1]:
            fallos.append(f"{_rel(c)}/proposal.md: estado «{e}» no es uno de {', '.join(os_.ESTADOS[:-1])}")
            continue
        deltas = sorted((c / "specs").glob("*/spec.md"))
        if not deltas:
            fallos.append(f"{_rel(c)}: no tiene especificación (specs/<capacidad>/spec.md)")
        # Lo usan otras personas con sus datos guardados: todo cambio dice qué les pasa
        datos = fm.get("datos", "")
        if datos not in DATOS:
            fallos.append(f"{_rel(c)}/proposal.md: falta «datos:» ({', '.join(DATOS)}): "
                          "qué le pasa a lo que ya tienen guardado quienes usan la app")
        elif datos != "sin-cambios" and not (c / "specs" / "datos" / "spec.md").exists():
            fallos.append(f"{_rel(c)}: «datos: {datos}» y sin requisitos en specs/datos/spec.md "
                          "que digan qué pasa con lo ya guardado")
        construida = e == "construida"
        n_req = n_esc = 0
        for d in deltas:
            f, nr, ne = revisar_spec(os_.leer_spec(d), construida, con_test, vivas)
            fallos += f
            n_req, n_esc = n_req + nr, n_esc + ne
        if os_.al_menos(c, "diseno-aprobado") and not (c / "tasks.md").exists():
            fallos.append(f"{_rel(c)}: en «{e}» y sin tasks.md")
        if construida and (c / "tasks.md").exists():
            pendientes = re.findall(r"^\s*- \[ \]\s*(.+)$", (c / "tasks.md").read_text(encoding="utf-8"), re.M)
            for t in pendientes:
                fallos.append(f"{_rel(c)}/tasks.md: tarea sin cerrar en un cambio construido: «{t.strip()}»")
        notas.append(f"{_rel(c)}: {e}, {len(deltas)} capacidades, {n_req} requisitos, {n_esc} escenarios")
    return fallos, notas


if __name__ == "__main__":
    fallos, notas = revisar()
    for n in notas:
        print("  ·", n)
    for f in fallos:
        print("  ✗", f)
    if not fallos:
        print("  ✓ especificaciones correctas")
    sys.exit(1 if fallos else 0)
