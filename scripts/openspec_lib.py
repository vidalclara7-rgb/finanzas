"""Lectura de openspec/: cambios, especificaciones y estados. Lo usan
spec_check.py, preview_check.py y archive.py, y nada de aquí escribe."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
OPENSPEC = RAIZ / "openspec"
VIVAS = OPENSPEC / "specs"
CAMBIOS = OPENSPEC / "changes"
ARCHIVO = CAMBIOS / "archive"
TESTS = RAIZ / "tests"
APP = RAIZ / "index.html"

# El orden importa: un cambio sólo avanza.
ESTADOS = ["propuesta", "aprobada", "diseno-aprobado", "construida", "archivado"]

REQ = re.compile(r"^## (Requisito|Retirado):\s*(.+?)\s*$", re.M)
ESC = re.compile(r"^### Escenario:\s*(.+?)\s*$", re.M)


@dataclass
class Requisito:
    nombre: str
    texto: str  # el bloque entero, desde su cabecera
    retirado: bool = False

    @property
    def escenarios(self) -> list[tuple[str, str]]:
        partes = ESC.split(self.texto)
        return [(partes[i].strip(), partes[i + 1]) for i in range(1, len(partes) - 1, 2)]

    @property
    def cuerpo(self) -> str:
        """El texto del requisito antes del primer escenario."""
        return ESC.split(self.texto)[0]


@dataclass
class Spec:
    ruta: Path
    cabecera: str  # lo que hay antes del primer requisito
    requisitos: list[Requisito] = field(default_factory=list)

    @property
    def capacidad(self) -> str:
        return self.ruta.parent.name


def leer_spec(ruta: Path) -> Spec:
    texto = ruta.read_text(encoding="utf-8")
    marcas = list(REQ.finditer(texto))
    cab = texto[: marcas[0].start()] if marcas else texto
    reqs = []
    for i, m in enumerate(marcas):
        fin = marcas[i + 1].start() if i + 1 < len(marcas) else len(texto)
        reqs.append(Requisito(m.group(2), texto[m.start() : fin], retirado=m.group(1) == "Retirado"))
    return Spec(ruta, cab, reqs)


def escribir_spec(spec: Spec) -> str:
    cuerpo = spec.cabecera.rstrip() + "\n\n"
    cuerpo += "\n".join(r.texto.rstrip() + "\n" for r in spec.requisitos)
    return cuerpo


def frontmatter(ruta: Path) -> dict[str, str]:
    if not ruta.exists():
        return {}
    m = re.match(r"---\n(.*?)\n---\n", ruta.read_text(encoding="utf-8"), re.S)
    if not m:
        return {}
    pares = (linea.partition(":") for linea in m.group(1).splitlines())
    return {k.strip(): v.strip() for k, _, v in pares if k.strip()}


def fijar_estado(cambio: Path, estado: str, **extra: str) -> None:
    ruta = cambio / "proposal.md"
    texto = ruta.read_text(encoding="utf-8")
    texto = re.sub(r"^estado:.*$", f"estado: {estado}", texto, count=1, flags=re.M)
    for k, v in extra.items():
        if re.search(rf"^{k}:", texto, re.M):
            texto = re.sub(rf"^{k}:.*$", f"{k}: {v}", texto, count=1, flags=re.M)
        else:
            texto = texto.replace("\n---\n", f"\n{k}: {v}\n---\n", 1)
    ruta.write_text(texto, encoding="utf-8")


def cambios_activos() -> list[Path]:
    if not CAMBIOS.is_dir():
        return []
    return sorted(d for d in CAMBIOS.iterdir() if d.is_dir() and d.name != "archive")


def estado(cambio: Path) -> str:
    return frontmatter(cambio / "proposal.md").get("estado", "")


def al_menos(cambio: Path, minimo: str) -> bool:
    e = estado(cambio)
    return e in ESTADOS and ESTADOS.index(e) >= ESTADOS.index(minimo)


def resolver_cambio(nombre: str | None) -> Path:
    """El cambio pedido, o el único activo. Si no se puede decidir, sale con
    un mensaje: nunca elige uno al azar."""
    if nombre:
        c = CAMBIOS / nombre
        if not c.is_dir() or nombre == "archive":
            raise SystemExit(f"No existe el cambio «{nombre}» en openspec/changes/")
        return c
    activos = cambios_activos()
    if len(activos) == 1:
        return activos[0]
    if not activos:
        raise SystemExit("No hay ningún cambio en curso en openspec/changes/. Empieza con /sdd:propose.")
    raise SystemExit("Hay varios cambios en curso; indica cuál: " + ", ".join(c.name for c in activos))


def escenarios_con_test() -> set[str]:
    """Títulos marcados en tests/ con `// Escenario: <título>`."""
    vistos = set()
    if not TESTS.is_dir():
        return vistos
    for p in TESTS.rglob("*.cjs"):
        for m in re.finditer(r"//\s*Escenario:\s*(.+)", p.read_text(encoding="utf-8")):
            vistos.add(m.group(1).strip().lower())
    return vistos
