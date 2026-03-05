#!/bin/bash

CYAN="\033[0;36m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

MAX_RETRY=5
RETRY=0

trap 'echo -e "\n${RED}  Bot dihentikan.${NC}"; exit 0' SIGINT SIGTERM

clear
echo -e "${CYAN}"
echo "  ██╗    ██╗██╗  ██╗ █████╗ ████████╗███████╗ █████╗ ██████╗ ██████╗ "
echo "  ██║    ██║██║  ██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗"
echo "  ██║ █╗ ██║███████║███████║   ██║   ███████╗███████║██████╔╝██████╔╝ "
echo "  ██║███╗██║██╔══██║██╔══██║   ██║   ╚════██║██╔══██║██╔═══╝ ██╔═══╝  "
echo "  ╚███╔███╔╝██║  ██║██║  ██║   ██║   ███████║██║  ██║██║     ██║      "
echo "   ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝      "
echo -e "${NC}"
echo -e "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  WhatsApp Forward Bot  │  Cellyn Store | Community  │  Built by Equality"
echo -e "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Auto git pull
CURRENT=$(git rev-parse HEAD 2>/dev/null)
git fetch origin main -q 2>/dev/null
LATEST=$(git rev-parse origin/main 2>/dev/null)

if [ "$CURRENT" != "$LATEST" ]; then
    echo -e "  ${YELLOW}UPDATE TERSEDIA!${NC}"
    echo ""
    echo -e "  Changelog:"
    git log $CURRENT..origin/main --oneline --no-merges | while read line; do
        echo -e "     $line"
    done
    echo ""
    echo -e "  Mengunduh update otomatis..."
    git pull origin main -q
    echo -e "  ${GREEN}v Update selesai!${NC}"
else
    echo -e "  ${GREEN}v Bot sudah versi terbaru!${NC}"
fi

echo ""
echo -e "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  [$(date '+%Y-%m-%d %H:%M:%S')] ${CYAN}i${NC}  Auto-restart aktif — max retry: ${MAX_RETRY}x"
echo -e "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

while [ $RETRY -lt $MAX_RETRY ]; do
    echo -e "  [$(date '+%Y-%m-%d %H:%M:%S')] ${CYAN}i${NC}  Menjalankan bot... (percobaan ke-$((RETRY + 1)))"
    node index.js
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
        RETRY=0
        echo -e "  [$(date '+%Y-%m-%d %H:%M:%S')] ${GREEN}v${NC}  Bot restart disengaja (exit 0), counter direset."
    else
        RETRY=$((RETRY + 1))
        echo -e "  [$(date '+%Y-%m-%d %H:%M:%S')] ${RED}x${NC}  Bot mati! (exit: $EXIT_CODE) — Percobaan $RETRY/$MAX_RETRY"
    fi

    if [ $RETRY -ge $MAX_RETRY ]; then
        echo -e "  [$(date '+%Y-%m-%d %H:%M:%S')] ${RED}x${NC}  Max retry tercapai! Butuh intervensi manual."
        exit 1
    fi

    echo -e "  [$(date '+%Y-%m-%d %H:%M:%S')] ${YELLOW}!${NC}  Restart dalam 10 detik..."
    sleep 10
    echo -e "  [$(date '+%Y-%m-%d %H:%M:%S')] ${GREEN}v${NC}  Restart ke-$RETRY..."
done
