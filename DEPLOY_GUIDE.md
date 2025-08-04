# 🚀 Guia de Deploy - Sistema de Controle de Presença

## 📋 **Pré-requisitos**

1. **Conta no GitHub** (para hospedar o código)
2. **Conta no Vercel** (para hospedar o site)
3. **Google Apps Script** já configurado (que você já tem)

## 🎯 **Opção 1: Vercel (Recomendado)**

### **Passo 1: Preparar o Projeto**

1. **Certifique-se de que tudo está funcionando:**
   ```bash
   npm run build
   ```

2. **Teste localmente:**
   ```bash
   npm run preview
   ```

### **Passo 2: Deploy no Vercel**

1. **Acesse:** [vercel.com](https://vercel.com)
2. **Faça login** com sua conta GitHub
3. **Clique em "New Project"**
4. **Importe seu repositório** do GitHub
5. **Configure o projeto:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Clique em "Deploy"**

### **Passo 3: Configurar Variáveis de Ambiente (Opcional)**

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```
VITE_API_URL=https://script.google.com/macros/s/AKfycbzJOAwnTas5wOsx5R5LffjX5sQ7zxdHeLDGKno3DpMgxAaC0Jh6cRoUUsGQEaJaDUVw/exec
```

## 🎯 **Opção 2: Netlify**

### **Passo 1: Deploy no Netlify**

1. **Acesse:** [netlify.com](https://netlify.com)
2. **Faça login** com sua conta GitHub
3. **Clique em "New site from Git"**
4. **Selecione seu repositório**
5. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Clique em "Deploy site"**

## 🎯 **Opção 3: GitHub Pages**

### **Passo 1: Configurar GitHub Pages**

1. **No seu repositório GitHub, vá em Settings > Pages**
2. **Source:** Deploy from a branch
3. **Branch:** main
4. **Folder:** / (root)
5. **Clique em Save**

### **Passo 2: Configurar Build**

Crie um arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔧 **Configurações Importantes**

### **1. Atualizar URL da API (se necessário)**

Se você quiser usar variáveis de ambiente, atualize `src/lib/config.js`:

```javascript
export const API_CONFIG = {
  GOOGLE_SHEETS_URL: import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbzJOAwnTas5wOsx5R5LffjX5sQ7zxdHeLDGKno3DpMgxAaC0Jh6cRoUUsGQEaJaDUVw/exec',
  // ...
};
```

### **2. Configurar CORS no Google Apps Script**

Certifique-se de que seu Google Apps Script tem os headers CORS:

```javascript
function doGet(e) {
  // ... seu código ...
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

## 🌐 **URLs de Acesso**

Após o deploy, você terá URLs como:

- **Vercel:** `https://seu-projeto.vercel.app`
- **Netlify:** `https://seu-projeto.netlify.app`
- **GitHub Pages:** `https://seu-usuario.github.io/seu-repositorio`

## 📱 **Testando em Produção**

1. **Acesse a URL do seu site**
2. **Teste o formulário de presença**
3. **Verifique a área administrativa**
4. **Confirme que os dados chegam na planilha**

## 🔄 **Deploy Automático**

Todas as opções acima configuram **deploy automático**:
- Quando você fizer push para o GitHub
- O site será atualizado automaticamente

## 🛠️ **Comandos Úteis**

```bash
# Build local para testar
npm run build

# Preview do build
npm run preview

# Verificar se tudo está OK
npm run lint
```

## 🎉 **Pronto!**

Seu sistema estará online e funcionando para todos os usuários! 🚀 