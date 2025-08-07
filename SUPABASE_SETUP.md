# Configuração do Supabase

Este projeto usa exclusivamente o Supabase como backend para armazenamento de dados.

## Configuração do Supabase

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL e a chave anônima do projeto

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL do seu projeto Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co

# Chave anônima do seu projeto Supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 3. Criar tabela no Supabase

Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- Criar tabela de presenças
CREATE TABLE presencas (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  registration TEXT NOT NULL,
  course TEXT,
  photo TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Desabilitar RLS (Row Level Security) para permitir inserções
ALTER TABLE presencas DISABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações
CREATE POLICY "Permitir todas as operações" ON presencas
  FOR ALL USING (true);
```

### 4. Testar configuração

1. Inicie o servidor: `npm run dev`
2. Acesse o sistema
3. Tente registrar uma presença
4. Verifique no console do navegador se está usando Supabase

## Verificação

Para verificar se o Supabase está funcionando:

1. Abra o console do navegador (F12)
2. Procure por mensagens como:
   - "Enviando dados para Supabase..."
   - "Salvo no Supabase com sucesso"
   - "backend: 'supabase'"

## Troubleshooting

### Erro "Supabase não configurado"
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor após adicionar o arquivo .env
- Certifique-se de que o arquivo .env está na raiz do projeto

### Erro de RLS (Row Level Security)
- Execute: `ALTER TABLE presencas DISABLE ROW LEVEL SECURITY;`

### Erro de conexão
- Verifique se a URL e chave do Supabase estão corretas
- Verifique se a tabela `presencas` foi criada
- Verifique se a política de segurança foi criada

### Erro de CORS
- Verifique se o domínio está configurado nas configurações do Supabase
- Para desenvolvimento local, adicione `localhost:5173` nas configurações

## Estrutura da Tabela

A tabela `presencas` tem a seguinte estrutura:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | Chave primária auto-incrementada |
| full_name | TEXT | Nome completo da pessoa |
| registration | TEXT | Matrícula ou CPF |
| course | TEXT | Curso ou reunião |
| photo | TEXT | Foto em base64 (opcional) |
| date | TEXT | Data da presença |
| time | TEXT | Horário da presença |
| created_at | TIMESTAMP | Data/hora de criação do registro |

## Funcionalidades

- ✅ Registro de presença
- ✅ Upload de foto
- ✅ Listagem de registros
- ✅ Limpeza de dados
- ✅ Teste de conexão
- ✅ Interface administrativa 