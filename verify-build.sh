#!/bin/bash
# Pre-build verification - ensures source is correct before building.
# Resolves the project root from this script's location so it works in any
# environment (Replit, local dev, legacy server, etc.).
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAGES_DIR="$SCRIPT_DIR/client/src/pages"
COMPONENTS_DIR="$SCRIPT_DIR/client/src/components"

EXPECTED_PAGES=68
EXPECTED_COMPONENTS=33

PAGES=$(ls "$PAGES_DIR" 2>/dev/null | wc -l)
COMPONENTS=$(ls "$COMPONENTS_DIR" 2>/dev/null | wc -l)

if [ "$PAGES" -lt "$EXPECTED_PAGES" ]; then
    echo "[BLOCKED] Source code is outdated! Expected $EXPECTED_PAGES pages, found $PAGES"
    echo "Looked in: $PAGES_DIR"
    exit 1
fi

if [ "$COMPONENTS" -lt "$EXPECTED_COMPONENTS" ]; then
    echo "[BLOCKED] Source code is outdated! Expected $EXPECTED_COMPONENTS components, found $COMPONENTS"
    echo "Looked in: $COMPONENTS_DIR"
    exit 1
fi

echo "[OK] Source verified: $PAGES pages, $COMPONENTS components"
