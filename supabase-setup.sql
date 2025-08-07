-- Configuração da tabela de presenças para o Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase

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

-- Verificar se a tabela foi criada corretamente
SELECT * FROM presencas LIMIT 1; 