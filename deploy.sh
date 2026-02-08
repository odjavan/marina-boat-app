#!/bin/bash
set -e

echo "🚀 Iniciando deploy da Marina Boat App..."

# Pull latest changes
echo "📥 Baixando atualizações do repositório..."
git pull origin main

# Install dependencies
echo "📦 Instalando dependências..."
npm install

# Build application
echo "🔨 Compilando aplicação para produção..."
npm run build

# Reload Nginx
echo "🔄 Recarregando Nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Deploy concluído com sucesso!"
echo "🌐 Aplicação disponível em: http://seu-dominio.com"
