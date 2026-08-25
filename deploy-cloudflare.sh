#!/bin/bash
# Script para desplegar Notification FX Studio en Cloudflare Pages

echo "🚀 Iniciando despliegue en Cloudflare Pages..."
cd "$(dirname "$0")"

# Ejecutar wrangler pages deploy
npx wrangler pages deploy . --project-name=notification-fx-studio

if [ $? -eq 0 ]; then
  echo "✅ ¡Despliegue completado con éxito en Cloudflare Pages!"
else
  echo "⚠️ Si es tu primera vez usando Wrangler, asegúrate de iniciar sesión con:"
  echo "npx wrangler login"
fi
