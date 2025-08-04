#!/bin/bash

echo "🚀 Preparando deploy do Sistema de Controle de Presença..."

# Verificar se o build funciona
echo "📦 Fazendo build do projeto..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build realizado com sucesso!"
else
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi

# Testar preview
echo "🔍 Testando preview..."
npm run preview &
PREVIEW_PID=$!

# Aguardar um pouco para o servidor iniciar
sleep 3

# Verificar se o servidor está rodando
if curl -s http://localhost:4173 > /dev/null; then
    echo "✅ Preview funcionando em http://localhost:4173"
else
    echo "⚠️ Preview não está acessível"
fi

# Parar o servidor de preview
kill $PREVIEW_PID 2>/dev/null

echo ""
echo "🎉 Projeto pronto para deploy!"
echo ""
echo "📋 Próximos passos:"
echo "1. Faça push para o GitHub: git push origin main"
echo "2. Acesse vercel.com e conecte seu repositório"
echo "3. Configure o projeto no Vercel"
echo "4. Deploy automático acontecerá!"
echo ""
echo "🌐 URLs que você terá:"
echo "- Formulário: https://seu-projeto.vercel.app"
echo "- Admin: https://seu-projeto.vercel.app/admin"
echo ""
echo "📱 Teste em produção:"
echo "- Acesse a URL do seu site"
echo "- Teste o formulário de presença"
echo "- Verifique a área administrativa"
echo "- Confirme que os dados chegam na planilha" 