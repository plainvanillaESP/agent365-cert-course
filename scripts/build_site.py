#!/usr/bin/env python3
"""
Build script para preparar el contenido del sitio MkDocs.

MkDocs no permite usar la raíz del repo como docs_dir. Este script
copia el contenido relevante a `docs_site/` con la estructura que
mkdocs.yml espera, manteniendo los enlaces relativos funcionales.

Uso:
    python scripts/build_site.py

Output: carpeta `docs_site/` lista para que `mkdocs build` la consuma.
"""
from __future__ import annotations
import shutil
import sys
from pathlib import Path

# Raíz del repo
ROOT = Path(__file__).parent.parent

# Carpeta de salida (docs_dir de MkDocs)
OUT = ROOT / "docs_site"

# Mapping: origen relativo a ROOT → destino relativo a OUT
# Si el origen es un directorio, se copia recursivamente.
COPIES: list[tuple[str, str]] = [
    ("index.md", "index.md"),
    ("PLAN.md", "PLAN.md"),
    ("docs", "docs"),
    ("investigacion", "investigacion"),
    ("modulos", "modulos"),
    ("assets", "assets"),
]


def main() -> int:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    for src_rel, dst_rel in COPIES:
        src = ROOT / src_rel
        dst = OUT / dst_rel
        if not src.exists():
            print(f"  ⚠  origen no encontrado: {src_rel} (saltando)", file=sys.stderr)
            continue
        if src.is_dir():
            shutil.copytree(src, dst)
            print(f"  ✓  dir  {src_rel}/ → docs_site/{dst_rel}/")
        else:
            shutil.copy2(src, dst)
            print(f"  ✓  file {src_rel}  → docs_site/{dst_rel}")

    print(f"\nListo. Sitio fuente preparado en {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
