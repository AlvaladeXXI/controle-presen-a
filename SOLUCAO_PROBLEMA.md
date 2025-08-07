# Solução para Problemas de Conectividade

## Problema Identificado

O sistema está mostrando "Problemas de conexão - Dados salvos localmente" porque não consegue se conectar com a API do Google Sheets.

## Diagnóstico

### 1. Verificar a URL da API

A URL atual configurada é:
```
https://script.google.com/macros/s/AKfycbwE04qvYgq-PhVhfWF7YmJHhU3sHsDF2gBYcXecwvZcgA6oLSqpIdDqKAnYnDwrDUzmtA/exec
```

**Para testar:**
1. Abra o painel de diagnóstico no sistema
2. Clique no botão de link externo para testar a URL
3. Se a página não carregar, a URL está incorreta ou o script não está publicado

### 2. Configurar o Google Apps Script

#### Passo a Passo:

1. **Acesse o Google Apps Script:**
   - Vá para https://script.google.com
   - Faça login com sua conta Google

2. **Crie um novo projeto:**
   - Clique em "Novo projeto"
   - Dê um nome como "API Controle de Presença"

3. **Configure o código:**
   ```javascript
   function doGet(e) {
     return handleRequest(e);
   }
   
   function doPost(e) {
     return handleRequest(e);
   }
   
   function handleRequest(e) {
     // Configurar CORS
     const headers = {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
       'Access-Control-Allow-Headers': 'Content-Type',
       'Content-Type': 'application/json'
     };
     
     // Se for uma requisição OPTIONS (CORS preflight)
     if (e.parameter.action === 'test') {
       return ContentService.createTextOutput(JSON.stringify({
         success: true,
         message: 'API funcionando'
       })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
     }
     
     // Se for para buscar registros
     if (e.parameter.action === 'getRecords') {
       try {
         const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
         const data = sheet.getDataRange().getValues();
         
         return ContentService.createTextOutput(JSON.stringify({
           success: true,
           data: data
         })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
       } catch (error) {
         return ContentService.createTextOutput(JSON.stringify({
           success: false,
           message: error.toString()
         })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
       }
     }
     
     // Se for para salvar registro
     if (e.postData && e.postData.contents) {
       try {
         const data = JSON.parse(e.postData.contents);
         
         if (data.action === 'saveRecord') {
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
           
           return ContentService.createTextOutput(JSON.stringify({
             success: true,
             message: 'Registro salvo com sucesso'
           })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
         }
         
         if (data.action === 'clearAllRecords') {
           const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
           sheet.clear();
           
           return ContentService.createTextOutput(JSON.stringify({
             success: true,
             message: 'Registros limpos com sucesso'
           })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
         }
         
       } catch (error) {
         return ContentService.createTextOutput(JSON.stringify({
           success: false,
           message: error.toString()
         })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
       }
     }
     
     return ContentService.createTextOutput(JSON.stringify({
       success: false,
       message: 'Ação não reconhecida'
     })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
   }
   ```

4. **Publique o script:**
   - Clique em "Deploy" > "New deployment"
   - Escolha "Web app"
   - Configure:
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Clique em "Deploy"
   - Copie a URL gerada

5. **Atualize a configuração:**
   - Abra `src/lib/config.js`
   - Substitua a URL da API pela nova URL

### 3. Verificar a Planilha

1. **Criar uma planilha no Google Sheets**
2. **Compartilhar a planilha** com a conta que executa o script
3. **Configurar o script** para acessar a planilha correta

### 4. Testar a Conexão

1. **Use o painel de diagnóstico** no sistema
2. **Clique em "Executar Diagnóstico Completo"**
3. **Verifique os resultados** de cada teste

## Soluções Alternativas

### Se o Google Apps Script não funcionar:

1. **Usar uma API alternativa** (Firebase, Supabase, etc.)
2. **Configurar um servidor próprio** (Node.js, Python, etc.)
3. **Usar apenas armazenamento local** (sem sincronização)

### Para problemas de CORS:

1. **Adicionar headers CORS** no script
2. **Usar um proxy CORS** temporariamente
3. **Configurar um servidor intermediário**

## Logs e Debug

### Verificar logs no navegador:
1. Abra as ferramentas do desenvolvedor (F12)
2. Vá para a aba "Console"
3. Procure por erros relacionados à API

### Comandos úteis:
```javascript
// Testar a API diretamente no console
fetch('SUA_URL_AQUI?action=test')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Contato para Suporte

Se o problema persistir:
1. Execute o diagnóstico completo
2. Copie os logs de erro
3. Verifique se a URL da API está correta
4. Teste a URL diretamente no navegador

## Status do Sistema

- ✅ **Funcionamento offline**: Os dados são salvos localmente
- ✅ **Sincronização**: Quando a conexão for restaurada, os dados serão sincronizados
- ⚠️ **API**: Precisa ser configurada corretamente para funcionamento completo 