# Guia de Solução de Problemas - "Failed to Fetch"

## 🔍 Diagnóstico do Problema

O erro "Failed to fetch" geralmente indica problemas de conectividade com a API do Google Sheets. Vamos diagnosticar e resolver:

### 1. **Verificar a URL da API**

A URL atual está configurada em `src/lib/config.js`:
```javascript
GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbzJOAwnTas5wOsx5R5LffjX5sQ7zxdHeLDGKno3DpMgxAaC0Jh6cRoUUsGQEaJaDUVw/exec'
```

**Teste a URL diretamente no navegador:**
- Abra a URL no navegador
- Deve retornar uma resposta (mesmo que seja um erro)
- Se não carregar, a URL está incorreta

### 2. **Problemas Comuns e Soluções**

#### ❌ **URL Incorreta**
**Sintomas:** Erro 404 ou página não encontrada
**Solução:** 
1. Verifique se a URL está correta
2. Confirme se o Google Apps Script está publicado
3. Teste a URL no navegador

#### ❌ **Problemas de CORS**
**Sintomas:** Erro de CORS no console do navegador
**Solução:**
1. No Google Apps Script, adicione:
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

function doPost(e) {
  // ... seu código ...
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

#### ❌ **Google Apps Script não publicado**
**Sintomas:** Erro 403 ou acesso negado
**Solução:**
1. Abra o Google Apps Script
2. Clique em "Deploy" > "New deployment"
3. Escolha "Web app"
4. Configure:
   - Execute as: "Me"
   - Who has access: "Anyone"
5. Copie a nova URL

#### ❌ **Problemas de Rede**
**Sintomas:** Timeout ou erro de conexão
**Solução:**
1. Verifique sua conexão com a internet
2. Teste em uma rede diferente
3. Verifique se há firewall bloqueando

### 3. **Usando o Diagnóstico Automático**

O sistema agora inclui ferramentas de diagnóstico:

1. **Acesse a área administrativa**
2. **Clique em "Diagnóstico"**
3. **Execute os testes**
4. **Siga as recomendações**

### 4. **Teste Manual da API**

Você pode testar a API manualmente:

```javascript
// No console do navegador
fetch('https://script.google.com/macros/s/AKfycbzJOAwnTas5wOsx5R5LffjX5sQ7zxdHeLDGKno3DpMgxAaC0Jh6cRoUUsGQEaJaDUVw/exec?action=test')
  .then(response => response.json())
  .then(data => console.log('Sucesso:', data))
  .catch(error => console.error('Erro:', error));
```

### 5. **Estrutura Esperada da API**

O Google Apps Script deve ter esta estrutura básica:

```javascript
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'test') {
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'API funcionando' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
  
  if (action === 'getRecords') {
    // Buscar registros da planilha
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: data }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, message: 'Ação não reconhecida' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  if (action === 'saveRecord') {
    // Salvar registro na planilha
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const record = data.data;
    
    sheet.appendRow([
      record.fullName,
      record.registration,
      record.course,
      record.date,
      record.time,
      record.hasPhoto ? 'Sim' : 'Não'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Registro salvo' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, message: 'Ação não reconhecida' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}
```

### 6. **Logs de Debug**

O sistema agora inclui logs detalhados. Abra o console do navegador (F12) e verifique:

1. **Logs de tentativa de conexão**
2. **Status da resposta HTTP**
3. **Detalhes de erros específicos**

### 7. **Fallback Local**

Se a API não funcionar, o sistema automaticamente:
1. Salva dados localmente (localStorage)
2. Continua funcionando offline
3. Tenta sincronizar quando possível

### 8. **Contato para Suporte**

Se os problemas persistirem:
1. Verifique os logs no console do navegador
2. Teste a URL da API diretamente
3. Confirme se o Google Apps Script está configurado corretamente
4. Verifique se a planilha do Google Sheets existe e está acessível 