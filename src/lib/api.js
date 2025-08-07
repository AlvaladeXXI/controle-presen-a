import { attendanceDB, isSupabaseConfigured } from '@/lib/supabaseClient';

export const apiService = {
  // Enviar novo registro para o Supabase
  async saveRecord(record) {
    try {
      console.log('Enviando dados para Supabase:', record);
      
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não está configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
      }
      
      const result = await attendanceDB.saveRecord(record);
      console.log('Resultado do Supabase:', result);
      
      return { 
        success: true, 
        message: 'Registro salvo com sucesso no Supabase',
        backend: 'supabase'
      };
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      throw error;
    }
  },

  // Buscar todos os registros do Supabase
  async getRecords() {
    try {
      console.log('Buscando registros do Supabase...');
      
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não está configurado');
      }
      
      const data = await attendanceDB.getRecords();
      console.log('Registros recebidos:', data);
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      throw error;
    }
  },

  // Limpar todos os registros do Supabase
  async clearAllRecords() {
    try {
      console.log('Limpando registros do Supabase...');
      
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não está configurado');
      }
      
      const result = await attendanceDB.clearAllRecords();
      console.log('Resultado da limpeza:', result);
      
      return { 
        success: true, 
        message: 'Todos os registros foram removidos do Supabase',
        backend: 'supabase'
      };
    } catch (error) {
      console.error('Erro ao limpar registros:', error);
      throw error;
    }
  },

  // Testar conexão com o Supabase
  async testConnection() {
    try {
      console.log('Testando conexão com Supabase...');
      
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não está configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
      }
      
      const result = await attendanceDB.testConnection();
      console.log('Resultado do teste:', result);
      
      return { 
        success: true, 
        message: 'Conexão com Supabase funcionando',
        backend: 'supabase'
      };
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      throw error;
    }
  }
}; 