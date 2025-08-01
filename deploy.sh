#!/bin/bash

# Script de Deploy - Gestão Aruanda
echo "🚀 Iniciando deploy do Gestão Aruanda..."

# Verificar se as variáveis de ambiente estão configuradas
if [ ! -f ".env.production" ]; then
    echo "❌ Arquivo .env.production não encontrado!"
    echo "Crie o arquivo com as configurações necessárias."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Executar testes (se houver)
echo "🧪 Executando testes..."
npm run lint

# Build da aplicação
echo "🔨 Construindo aplicação..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    echo "❌ Erro no build da aplicação!"
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Instruções para deploy
echo ""
echo "📋 Próximos passos para deploy:"
echo "1. Configure seu projeto no Supabase"
echo "2. Execute as migrations SQL"
echo "3. Configure as variáveis de ambiente"
echo "4. Faça upload da pasta 'dist' para seu servidor"
echo ""
echo "🎉 Sistema pronto para produção!"