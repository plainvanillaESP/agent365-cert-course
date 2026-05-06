#!/bin/bash
# Bootstrap script — Inicialización del repositorio GitHub
#
# Ejecuta este script una sola vez después de descomprimir el scaffold.
# Crea el repositorio en GitHub y hace el primer push.
#
# Prerrequisitos:
#   - GitHub CLI instalado (gh) — brew install gh / winget install GitHub.cli
#   - Autenticado en gh: gh auth login
#   - Git instalado
#
# Uso:
#   chmod +x scripts/bootstrap-repo.sh
#   ./scripts/bootstrap-repo.sh

set -e

REPO_NAME="agent365-cert-course"
REPO_DESCRIPTION="Curso de certificación para administradores IT sobre Microsoft Agent 365 y gobernanza de agentes en Microsoft 365"
VISIBILITY="private"  # cambia a "public" si quieres repo público

echo "=== Bootstrap repositorio: $REPO_NAME ==="
echo ""

# Verificar prerrequisitos
command -v git >/dev/null 2>&1 || { echo "❌ git no encontrado"; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "❌ gh CLI no encontrado. Instala desde https://cli.github.com"; exit 1; }

echo "✅ git y gh disponibles"

# Verificar autenticación gh
if ! gh auth status >/dev/null 2>&1; then
    echo "❌ No autenticado en gh. Ejecuta: gh auth login"
    exit 1
fi

echo "✅ Autenticado en GitHub"
echo ""

# Inicializar git si no está inicializado
if [ ! -d .git ]; then
    echo "📦 Inicializando git..."
    git init -b main
else
    echo "📦 git ya inicializado"
fi

# Configurar usuario si no está
if ! git config user.email >/dev/null; then
    echo "ℹ️  Configurando user.email y user.name (los toma de tu config global si existe)"
fi

# Primer commit
echo "📝 Haciendo commit inicial..."
git add .
git commit -m "Initial scaffold — estructura base del curso

- 17 módulos con plantillas (teoría, laboratorios, evaluación, recursos)
- Documentación de diseño en docs/ (arquitectura, convenciones, matriz competencias, changelog)
- Investigación deep-research base versionada
- CLAUDE.md para sesiones futuras de Claude Code
- README.md y PLAN.md con roadmap completo

Producido por Plain Vanilla Solutions SL — mayo 2026" || echo "ℹ️  Sin cambios para commit (¿ya commiteado?)"

# Crear repo en GitHub
echo "☁️  Creando repositorio en GitHub..."
if gh repo view "$REPO_NAME" >/dev/null 2>&1; then
    echo "⚠️  El repositorio $REPO_NAME ya existe en tu cuenta. Saltando creación."
else
    gh repo create "$REPO_NAME" \
        --"$VISIBILITY" \
        --description "$REPO_DESCRIPTION" \
        --source=. \
        --remote=origin \
        --push
    echo "✅ Repositorio creado y pusheado"
fi

# Si el repo ya existía pero el remote no está configurado, configurarlo
if ! git remote get-url origin >/dev/null 2>&1; then
    GH_USER=$(gh api user --jq .login)
    git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git"
    git push -u origin main
    echo "✅ Remote configurado y push hecho"
fi

echo ""
echo "=== Bootstrap completado ==="
echo ""
GH_USER=$(gh api user --jq .login)
echo "🔗 URL del repo: https://github.com/$GH_USER/$REPO_NAME"
echo ""
echo "Próximos pasos:"
echo "  1. Abre el repo en tu editor / Claude Code"
echo "  2. Revisa PLAN.md y dime cuándo arrancamos la Fase 1"
echo ""
