# Sistema de Controle de Presença

Este é um sistema de controle de presença que integra com Google Sheets para armazenamento de dados.

## Funcionalidades

### Formulário de Presença
- Registro de nome completo e matrícula/CPF
- Campo opcional para curso/reunião
- Upload de foto (opcional, máximo 5MB)
- Integração automática com Google Sheets
- Fallback para armazenamento local em caso de erro

### Área Administrativa
- Login com credenciais configuráveis
- Visualização de todos os registros
- Busca e filtros por nome, matrícula e curso
- Exportação para Excel
- Download individual de fotos
- Limpeza de registros
- Indicadores de status da conexão

## Integração com Google Sheets

### Configuração da API
A URL da API do Google Sheets está configurada em `src/lib/config.js`:

```javascript
export const API_CONFIG = {
  GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbzJOAwnTas5wOsx5R5LffjX5sQ7zxdHeLDGKno3DpMgxAaC0Jh6cRoUUsGQEaJaDUVw/exec',
  // ...
};
```

### Endpoints da API

#### 1. Salvar Registro (POST)
```javascript
// Envia novo registro para a planilha
await apiService.saveRecord({
  fullName: "Nome Completo",
  registration: "123456789",
  course: "Curso/Reunião",
  photo: "base64_ou_url",
  hasPhoto: true,
  date: "01/01/2024",
  time: "10:30:00",
  timestamp: "2024-01-01T10:30:00.000Z"
});
```

#### 2. Buscar Registros (GET)
```javascript
// Busca todos os registros da planilha
const records = await apiService.getRecords();
```

#### 3. Limpar Registros (POST)
```javascript
// Remove todos os registros da planilha
await apiService.clearAllRecords();
```

### Estrutura de Dados

Cada registro contém:
- `id`: Identificador único
- `fullName`: Nome completo
- `registration`: Matrícula ou CPF
- `course`: Curso ou reunião
- `photo`: Foto em base64 (opcional)
- `hasPhoto`: Boolean indicando se tem foto
- `date`: Data do registro (formato brasileiro)
- `time`: Horário do registro
- `timestamp`: Timestamp ISO

### Tratamento de Erros

O sistema implementa fallback robusto:
1. **Tenta salvar na API do Google Sheets**
2. **Se falhar, salva localmente** (localStorage)
3. **Mantém sincronização** quando possível
4. **Exibe mensagens de erro** apropriadas

### Configurações

As configurações estão centralizadas em `src/lib/config.js`:

```javascript
export const APP_CONFIG = {
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'crc@123',
  MAX_PHOTO_SIZE: 5 * 1024 * 1024, // 5MB
  // ...
};
```

## Instalação e Uso

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar o sistema:**
   - Formulário: `http://localhost:5173/`
   - Admin: `http://localhost:5173/admin`

## Estrutura do Projeto

```
src/
├── components/
│   ├── AttendanceForm.jsx    # Formulário de presença
│   ├── AdminDashboard.jsx    # Painel administrativo
│   └── AdminLogin.jsx        # Login administrativo
├── contexts/
│   └── AttendanceContext.jsx # Contexto de dados
├── lib/
│   ├── api.js               # Serviço da API
│   └── config.js            # Configurações
└── main.jsx                 # Ponto de entrada
```

## Segurança

- Credenciais do admin configuráveis
- Validação de tamanho de arquivo
- Sanitização de dados
- Fallback para operação offline

## Manutenção

Para alterar a URL da API do Google Sheets:
1. Edite `src/lib/config.js`
2. Atualize `API_CONFIG.GOOGLE_SHEETS_URL`
3. Reinicie o aplicativo

Para alterar credenciais do admin:
1. Edite `src/lib/config.js`
2. Atualize `APP_CONFIG.ADMIN_USERNAME` e `APP_CONFIG.ADMIN_PASSWORD`
3. Limpe o localStorage se necessário 