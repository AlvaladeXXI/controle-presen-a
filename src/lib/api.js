import { API_CONFIG } from './config';

export const apiService = {
  // Enviar novo registro para a planilha
  async saveRecord(record) {
    try {
      console.log('Tentando salvar registro na API:', API_CONFIG.GOOGLE_SHEETS_URL);
      
      const response = await fetch(API_CONFIG.GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveRecord',
          data: {
            fullName: record.fullName,
            registration: record.registration,
            course: record.course,
            photo: record.photo || '',
            hasPhoto: record.hasPhoto || false,
            date: record.date,
            time: record.time,
            timestamp: record.timestamp
          }
        })
      });

      console.log('Resposta da API:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', errorText);
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      // Tentar fazer parse da resposta como JSON
      let result;
      try {
        result = await response.json();
        console.log('Resultado da API (JSON):', result);
      } catch (parseError) {
        // Se não conseguir fazer parse como JSON, considerar como sucesso se a resposta foi 200
        console.log('Resposta não é JSON válido, mas status é OK:', response.status);
        result = { success: true, message: 'Registro salvo com sucesso' };
      }
      
      // Verificar se a resposta indica sucesso
      if (result && (result.success === true || result.success === false)) {
        if (!result.success) {
          throw new Error(result.message || 'Erro ao salvar registro');
        }
      } else {
        // Se não tem campo success, considerar como sucesso se chegou até aqui
        console.log('Resposta não tem campo success, considerando como sucesso');
      }

      return result;
    } catch (error) {
      console.error('Erro detalhado ao salvar registro:', error);
      
      // Verificar se é um erro de CORS ou conexão
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão com a API. Os dados podem ter sido salvos, mas não foi possível confirmar. Verifique se a URL está correta e se há problemas de CORS.');
      }
      
      // Se chegou até aqui e não conseguiu salvar, mas não é erro de rede, pode ser problema de resposta
      if (error.message && !error.message.includes('conexão') && !error.message.includes('CORS')) {
        throw new Error('Problema na resposta da API. Os dados podem ter sido salvos, mas houve um erro na confirmação.');
      }
      
      throw error;
    }
  },

  // Buscar todos os registros da planilha
  async getRecords() {
    try {
      console.log('Tentando buscar registros da API:', `${API_CONFIG.GOOGLE_SHEETS_URL}?action=getRecords`);
      
      const response = await fetch(`${API_CONFIG.GOOGLE_SHEETS_URL}?action=getRecords`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Resposta da API (GET):', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API (GET):', errorText);
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      // Tentar fazer parse da resposta como JSON
      let result;
      try {
        result = await response.json();
        console.log('Resultado da API (GET):', result);
      } catch (parseError) {
        console.error('Erro ao fazer parse da resposta JSON:', parseError);
        throw new Error('Resposta da API não é um JSON válido');
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Erro ao buscar registros');
      }

      return result.data || [];
    } catch (error) {
      console.error('Erro detalhado ao buscar registros:', error);
      
      // Verificar se é um erro de CORS
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão com a API. Verifique se a URL está correta e se há problemas de CORS.');
      }
      
      throw error;
    }
  },

  // Limpar todos os registros da planilha
  async clearAllRecords() {
    try {
      console.log('Tentando limpar registros da API:', API_CONFIG.GOOGLE_SHEETS_URL);
      
      const response = await fetch(API_CONFIG.GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'clearAllRecords'
        })
      });

      console.log('Resposta da API (CLEAR):', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API (CLEAR):', errorText);
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      // Tentar fazer parse da resposta como JSON
      let result;
      try {
        result = await response.json();
        console.log('Resultado da API (CLEAR):', result);
      } catch (parseError) {
        // Se não conseguir fazer parse como JSON, considerar como sucesso se a resposta foi 200
        console.log('Resposta não é JSON válido, mas status é OK:', response.status);
        result = { success: true, message: 'Registros limpos com sucesso' };
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Erro ao limpar registros');
      }

      return result;
    } catch (error) {
      console.error('Erro detalhado ao limpar registros:', error);
      
      // Verificar se é um erro de CORS
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão com a API. Verifique se a URL está correta e se há problemas de CORS.');
      }
      
      throw error;
    }
  },

  // Testar conexão com a API
  async testConnection() {
    try {
      console.log('Testando conexão com a API...');
      
      const response = await fetch(`${API_CONFIG.GOOGLE_SHEETS_URL}?action=test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Teste de conexão:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Erro no teste: ${response.status} ${response.statusText}`);
      }

      // Tentar fazer parse da resposta como JSON
      let result;
      try {
        result = await response.json();
        console.log('Resultado do teste:', result);
      } catch (parseError) {
        // Se não conseguir fazer parse como JSON, mas status é OK, considerar como sucesso
        console.log('Teste retornou status OK, mas não é JSON válido');
        result = { success: true, message: 'API funcionando' };
      }
      
      return result;
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      throw error;
    }
  }
}; 