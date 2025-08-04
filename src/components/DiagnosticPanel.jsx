import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { API_CONFIG } from '@/lib/config';

const DiagnosticPanel = ({ isOpen, onClose }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setIsTesting(true);
    setTestResults(null);

    const results = {
      url: API_CONFIG.GOOGLE_SHEETS_URL,
      tests: []
    };

    try {
      // Teste 1: Verificar se a URL está acessível
      console.log('🔍 Testando URL:', results.url);
      
      const response = await fetch(results.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      results.tests.push({
        name: 'Acesso à URL',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'URL acessível' : `Erro ${response.status}: ${response.statusText}`
      });

      // Teste 2: Verificar se a API responde corretamente
      if (response.ok) {
        try {
          const data = await response.json();
          results.tests.push({
            name: 'Resposta da API',
            status: 'success',
            message: 'API responde corretamente'
          });
        } catch (parseError) {
          results.tests.push({
            name: 'Resposta da API',
            status: 'warning',
            message: 'API responde, mas não retorna JSON válido'
          });
        }
      }

      // Teste 3: Testar operação específica
      try {
        await apiService.testConnection();
        results.tests.push({
          name: 'Teste de Conexão',
          status: 'success',
          message: 'Conexão com Google Sheets funcionando'
        });
      } catch (error) {
        results.tests.push({
          name: 'Teste de Conexão',
          status: 'error',
          message: error.message
        });
      }

    } catch (error) {
      results.tests.push({
        name: 'Conexão Geral',
        status: 'error',
        message: error.message
      });
    }

    setTestResults(results);
    setIsTesting(false);

    // Mostrar resultado geral
    const hasErrors = results.tests.some(test => test.status === 'error');
    const hasWarnings = results.tests.some(test => test.status === 'warning');

    if (hasErrors) {
      toast({
        title: "Problemas Detectados",
        description: "Alguns testes falharam. Verifique os detalhes no painel de diagnóstico.",
        variant: "destructive"
      });
    } else if (hasWarnings) {
      toast({
        title: "Avisos Detectados",
        description: "Alguns testes apresentaram avisos. Verifique os detalhes.",
        variant: "default"
      });
    } else {
      toast({
        title: "Diagnóstico Concluído",
        description: "Todos os testes passaram com sucesso!",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wifi className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Diagnóstico de Conexão</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">URL da API:</h3>
            <code className="text-sm bg-white p-2 rounded border break-all">
              {API_CONFIG.GOOGLE_SHEETS_URL}
            </code>
          </div>

          <Button
            onClick={runDiagnostics}
            disabled={isTesting}
            className="w-full btn-primary"
          >
            {isTesting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Executando Testes...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                Executar Diagnóstico
              </div>
            )}
          </Button>

          {testResults && (
            <div className="space-y-3">
              <h3 className="font-semibold">Resultados dos Testes:</h3>
              
              {testResults.tests.map((test, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    test.status === 'success' ? 'bg-green-50 border-green-200' :
                    test.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {test.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {test.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {test.status === 'error' && <XCircle className="w-4 h-4 text-red-600" />}
                    
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <p className="text-sm mt-1 text-gray-600">{test.message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-900">Possíveis Soluções:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Verifique se a URL da API está correta</li>
              <li>• Confirme se o Google Apps Script está publicado</li>
              <li>• Verifique se há problemas de CORS</li>
              <li>• Teste a URL diretamente no navegador</li>
              <li>• Verifique a conexão com a internet</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DiagnosticPanel; 