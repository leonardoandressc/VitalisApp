#!/bin/bash
# Nombre: auto-sync.sh
# Descripción: Sincroniza automáticamente cada 5 minutos

while true; do
  # Verifica cambios
  if [[ $(git status --porcelain) ]]; then
    git add .
    git commit -m "Auto-commit: $(date +'%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "[$(date)] Sincronizado con GitHub"
  else
    echo "[$(date)] Sin cambios"
  fi
  sleep 300  # Espera 5 minutos (300 segundos)
done
