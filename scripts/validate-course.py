#!/usr/bin/env python3
"""
Validador de paquetes de curso PV-Learn.

Uso:
    python3 scripts/validate-course.py {slug-curso}
    python3 scripts/validate-course.py agent365-cert

Valida un paquete de curso contra la especificación documentada en
`docs/course-package-spec.md`. Comprueba estructura de carpetas,
manifests YAML válidos, archivos referenciados existentes, IDs únicos,
sumas que cuadran y conformidad básica de bloques inline.

Devuelve código de salida 0 si todo OK, 1 si hay errores.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any

import yaml


REPO_ROOT = Path(__file__).resolve().parents[1]
SPEC_VERSION_SUPPORTED = ["1.0"]


# ────────────────────────────────────────────────────────────────────
#  Reporting
# ────────────────────────────────────────────────────────────────────

class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.checks_passed: int = 0

    def err(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def ok(self, _msg: str) -> None:
        self.checks_passed += 1

    def has_errors(self) -> bool:
        return bool(self.errors)

    def print_summary(self, slug: str) -> None:
        print()
        print(f"  Paquete:  cursos/{slug}/")
        print(f"  Checks:   {self.checks_passed} OK · {len(self.warnings)} warnings · {len(self.errors)} errors")
        print()
        for w in self.warnings:
            print(f"  [WARN]  {w}")
        for e in self.errors:
            print(f"  [ERR]   {e}")
        if not self.has_errors():
            print(f"  Resultado: OK")
        else:
            print(f"  Resultado: FAILED")
        print()


# ────────────────────────────────────────────────────────────────────
#  YAML loading helpers
# ────────────────────────────────────────────────────────────────────

def load_yaml(path: Path, report: Report, label: str) -> dict[str, Any] | None:
    if not path.exists():
        report.err(f"{label}: archivo no encontrado en {path}")
        return None
    try:
        with path.open("r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        report.ok(f"{label} parsea OK")
        return data
    except yaml.YAMLError as e:
        report.err(f"{label}: YAML inválido — {e}")
        return None


def extract_frontmatter(md_path: Path) -> dict[str, Any]:
    if not md_path.exists():
        return {}
    text = md_path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return {}
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        return {}


# ────────────────────────────────────────────────────────────────────
#  Validations
# ────────────────────────────────────────────────────────────────────

def validate_course_yaml(course: dict[str, Any], course_dir: Path, report: Report) -> None:
    REQUIRED = [
        "spec_version", "id", "slug", "nombre", "descripcion_corta",
        "idioma", "duracion_total_min", "editor", "version_curso",
        "modalidad_predominante", "branding", "areas_examen",
        "criterios_finalizacion_modulo", "modo_navegacion",
        "examen_final", "modulos",
    ]
    for k in REQUIRED:
        if k not in course:
            report.err(f"course.yaml: falta campo obligatorio '{k}'")
        else:
            report.ok(f"course.yaml tiene '{k}'")

    if course.get("spec_version") not in SPEC_VERSION_SUPPORTED:
        report.err(
            f"course.yaml: spec_version '{course.get('spec_version')}' no soportada. "
            f"Soportadas: {SPEC_VERSION_SUPPORTED}"
        )

    if course.get("modalidad_predominante") not in ("markdown", "video", "mixto"):
        report.err(f"course.yaml: modalidad_predominante inválida")

    if course.get("modo_navegacion") not in ("secuencial-con-override", "secuencial-estricto", "libre"):
        report.err(f"course.yaml: modo_navegacion inválido")

    # Suma de pesos = 100
    areas = course.get("areas_examen", [])
    total_peso = sum(a.get("peso_pct", 0) for a in areas)
    if total_peso != 100:
        report.err(f"course.yaml: suma de areas_examen[].peso_pct = {total_peso}, debe ser 100")
    else:
        report.ok("course.yaml: suma de pesos de áreas = 100")

    # Examen final y banco existen
    examen = course.get("examen_final", {})
    if examen:
        archivo = course_dir / examen.get("archivo", "")
        if not archivo.exists():
            report.warn(f"course.yaml: examen_final.archivo no existe — '{archivo}' (esperable hasta producir M17)")
        else:
            report.ok(f"banco-examen existe en {archivo.name}")

    # Cada slug de módulo es una carpeta existente
    modulos_dir = course_dir / "modulos"
    for mod_slug in course.get("modulos", []):
        if not (modulos_dir / mod_slug).is_dir():
            report.err(f"course.yaml: el módulo '{mod_slug}' no existe como carpeta")
        else:
            report.ok(f"módulo '{mod_slug}' tiene carpeta")


def validate_module_yaml(
    mod_yaml: dict[str, Any],
    module_dir: Path,
    course: dict[str, Any],
    report: Report,
) -> None:
    REQUIRED = [
        "spec_version", "id", "slug", "titulo", "duracion_min",
        "area_examen", "secciones", "objetivos_aprendizaje",
    ]
    label = f"module.yaml ({module_dir.name})"
    for k in REQUIRED:
        if k not in mod_yaml:
            report.err(f"{label}: falta campo obligatorio '{k}'")
        else:
            report.ok(f"{label} tiene '{k}'")

    if mod_yaml.get("spec_version") not in SPEC_VERSION_SUPPORTED:
        report.err(f"{label}: spec_version '{mod_yaml.get('spec_version')}' no soportada")

    # area_examen referenciada existe
    area_id = mod_yaml.get("area_examen")
    valid_areas = {a.get("id") for a in course.get("areas_examen", [])}
    if area_id not in valid_areas:
        report.err(f"{label}: area_examen={area_id} no existe en course.yaml")
    else:
        report.ok(f"{label}: area_examen referenciada existe")

    # Cada sección apunta a un archivo que existe
    for seccion in mod_yaml.get("secciones", []):
        archivo = module_dir / seccion.get("archivo", "")
        if not archivo.exists():
            report.err(f"{label}: sección tipo '{seccion.get('tipo')}' apunta a archivo inexistente — {archivo}")
        else:
            report.ok(f"{label}: sección '{seccion.get('tipo')}' OK")

    # OAs con formato esperado
    oa_re = re.compile(r"^OA-\d{2}\.\d+$")
    for oa in mod_yaml.get("objetivos_aprendizaje", []):
        oa_id = oa.get("id", "") if isinstance(oa, dict) else str(oa)
        if not oa_re.match(oa_id):
            report.warn(f"{label}: OA con formato inesperado '{oa_id}' (esperado OA-NN.M)")


def validate_oas_unique(course_dir: Path, course: dict[str, Any], report: Report) -> None:
    """Comprueba que no hay OAs duplicados entre módulos."""
    seen: dict[str, str] = {}  # oa_id → modulo_slug donde aparece primero
    duplicates: list[str] = []

    for mod_slug in course.get("modulos", []):
        mod_yaml = load_yaml(course_dir / "modulos" / mod_slug / "module.yaml", Report(), "tmp")
        if not mod_yaml:
            continue
        for oa in mod_yaml.get("objetivos_aprendizaje", []):
            oa_id = oa.get("id", "") if isinstance(oa, dict) else str(oa)
            if oa_id in seen:
                duplicates.append(f"OA '{oa_id}' aparece en {seen[oa_id]} y en {mod_slug}")
            else:
                seen[oa_id] = mod_slug

    if duplicates:
        for d in duplicates:
            report.err(d)
    else:
        report.ok(f"OAs únicos: {len(seen)} OAs sin duplicados")


def validate_question_distribution(course_dir: Path, course: dict[str, Any], report: Report) -> None:
    """Comprueba que la suma de preguntas_aporta_examen_final cuadra con examen_final.numero_preguntas."""
    expected = course.get("examen_final", {}).get("numero_preguntas", 0)
    total = 0
    for mod_slug in course.get("modulos", []):
        mod_yaml = load_yaml(course_dir / "modulos" / mod_slug / "module.yaml", Report(), "tmp")
        if not mod_yaml:
            continue
        total += mod_yaml.get("preguntas_aporta_examen_final", 0)

    if total != expected:
        report.err(
            f"Suma de preguntas_aporta_examen_final = {total}, "
            f"course.yaml > examen_final.numero_preguntas = {expected}"
        )
    else:
        report.ok(f"Distribución de preguntas: {total} cuadran con {expected}")


def validate_quiz_min_questions(course_dir: Path, course: dict[str, Any], report: Report) -> None:
    """Comprueba que cada módulo con quiz-practica tiene mínimo 3 preguntas."""
    pregunta_re = re.compile(r"^:::\s*pregunta\b", re.MULTILINE)

    for mod_slug in course.get("modulos", []):
        mod_dir = course_dir / "modulos" / mod_slug
        quiz_path = mod_dir / "quiz-practica.md"
        if not quiz_path.exists():
            # Aceptable si el módulo está pendiente o si tiene evaluacion-legacy.
            # Sólo es error en módulos con estado=producido y sin evaluacion-legacy.
            mod_yaml = load_yaml(mod_dir / "module.yaml", Report(), "tmp")
            if not mod_yaml:
                continue
            tipos = {s.get("tipo") for s in mod_yaml.get("secciones", [])}
            if mod_yaml.get("estado") == "producido" and "quiz-practica" not in tipos and "evaluacion-legacy" not in tipos:
                report.err(f"{mod_slug}: módulo producido sin quiz-practica.md ni evaluacion-legacy")
            continue

        text = quiz_path.read_text(encoding="utf-8")
        n = len(pregunta_re.findall(text))
        if n < 3:
            report.err(f"{mod_slug}/quiz-practica.md: {n} preguntas, mínimo requerido es 3")
        else:
            report.ok(f"{mod_slug}/quiz-practica.md: {n} preguntas (>=3 OK)")


# ────────────────────────────────────────────────────────────────────
#  Main
# ────────────────────────────────────────────────────────────────────

def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Valida un paquete de curso PV-Learn.")
    parser.add_argument("slug", help="Slug del curso a validar (ej: agent365-cert)")
    args = parser.parse_args(argv[1:])

    course_dir = REPO_ROOT / "cursos" / args.slug
    if not course_dir.is_dir():
        print(f"  [ERR] No existe el paquete cursos/{args.slug}/")
        return 1

    print()
    print(f"  PV-Learn — Validador de paquete de curso")
    print(f"  Spec version soportada: {', '.join(SPEC_VERSION_SUPPORTED)}")
    print()

    report = Report()

    # 1. course.yaml
    course = load_yaml(course_dir / "course.yaml", report, "course.yaml")
    if not course:
        report.print_summary(args.slug)
        return 1

    validate_course_yaml(course, course_dir, report)

    # 2. module.yaml de cada módulo
    for mod_slug in course.get("modulos", []):
        mod_dir = course_dir / "modulos" / mod_slug
        if not mod_dir.is_dir():
            continue
        mod_yaml = load_yaml(mod_dir / "module.yaml", report, f"module.yaml ({mod_slug})")
        if mod_yaml:
            validate_module_yaml(mod_yaml, mod_dir, course, report)

    # 3. OAs únicos
    validate_oas_unique(course_dir, course, report)

    # 4. Distribución de preguntas
    validate_question_distribution(course_dir, course, report)

    # 5. Mínimo de preguntas por quiz
    validate_quiz_min_questions(course_dir, course, report)

    report.print_summary(args.slug)
    return 1 if report.has_errors() else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
