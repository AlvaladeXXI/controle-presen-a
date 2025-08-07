import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: verificar se as variáveis estão sendo carregadas
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Configurado' : 'Não configurado');

// Verificar se as variáveis estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas!');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl);
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Definido' : 'Não definido');
  console.warn('Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar o Supabase.');
}

// Criar cliente do Supabase (mesmo que as variáveis não estejam configuradas)
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Funções auxiliares para o banco de dados
export const attendanceDB = {
  // Buscar todos os registros de presença
  async getRecords() {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não configurado');
    }

    try {
      const { data, error } = await supabase
        .from('presencas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar registros:', error);
        throw error;
      }

      // Mapear dados do Supabase para o formato esperado pelo frontend
      const mappedData = (data || []).map(record => ({
        id: record.id,
        fullName: record.full_name, // Converter full_name para fullName
        registration: record.registration,
        course: record.course,
        photo: record.photo,
        hasPhoto: !!record.photo,
        date: record.date,
        time: record.time,
        created_at: record.created_at
      }));

      return mappedData;
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      throw error;
    }
  },

  // Salvar novo registro de presença
  async saveRecord(record) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não configurado');
    }

    try {
      const { data, error } = await supabase
        .from('presencas')
        .insert([{
          full_name: record.fullName,
          registration: record.registration,
          course: record.course,
          photo: record.photo || '',
          date: record.date,
          time: record.time
        }])
        .select();

      if (error) {
        console.error('Erro ao salvar registro:', error);
        throw error;
      }

      return { success: true, message: 'Registro salvo com sucesso', data: data[0] };
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      throw error;
    }
  },

  // Limpar todos os registros
  async clearAllRecords() {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não configurado');
    }

    try {
      const { error } = await supabase
        .from('presencas')
        .delete()
        .neq('id', 0); // Deletar todos os registros

      if (error) {
        console.error('Erro ao limpar registros:', error);
        throw error;
      }

      return { success: true, message: 'Todos os registros foram limpos' };
    } catch (error) {
      console.error('Erro ao limpar registros:', error);
      throw error;
    }
  },

  // Testar conexão com o banco
  async testConnection() {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não configurado');
    }

    try {
      const { data, error } = await supabase
        .from('presencas')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Erro ao testar conexão:', error);
        throw error;
      }

      return { success: true, message: 'Conexão com Supabase funcionando' };
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      throw error;
    }
  }
};

export default supabase; 