import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, AlertTriangle, CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { API_CONFIG } from '@/lib/config';

const DiagnosticPanel = ({ isOpen, onClose }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const { toast } = useToast();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência.",
    });
  };

  const openUrlInNewTab = (url) => {
    window.open(url, '_blank');
  };

  const runDiagnostics = async () => {
    setIsTesting(true);
    setTestResults(null);

    const results = {
      url: 'Supabase',
      tests: [],
      networkInfo: {
        online: navigator.onLine,
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    };

    try {
      // Teste 1: Verificar conectividade básica
      console.log('🔍 Testando conectividade básica...');
      
      try {
        const response = await fetch(results.url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        results.tests.push({
          name: 'Acesso à URL',
          status: response.ok ? 'success' : 'error',
          message: response.ok ? 'URL acessível' : `Erro ${response.status}: ${response.statusText}`,
          details: `Status: ${response.status}, Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`
        });

        // Teste 2: Verificar se a API responde corretamente
        if (response.ok) {
          try {
            const data = await response.json();
            results.tests.push({
              name: 'Resposta da API',
              status: 'success',
              message: 'API responde corretamente',
              details: `Dados recebidos: ${JSON.stringify(data).substring(0, 100)}...`
            });
          } catch (parseError) {
            results.tests.push({
              name: 'Resposta da API',
              status: 'warning',
              message: 'API responde, mas não retorna JSON válido',
              details: `Erro de parse: ${parseError.message}`
            });
          }
        }
      } catch (fetchError) {
        results.tests.push({
          name: 'Acesso à URL',
          status: 'error',
          message: 'Erro de rede ao acessar a URL',
          details: `Erro: ${fetchError.message}`
        });
      }

      // Teste 3: Testar operação específica
      try {
        await apiService.testConnection();
        results.tests.push({
          name: 'Teste de Conexão',
          status: 'success',
          message: 'Conexão com Supabase funcionando',
          details: 'API respondeu corretamente ao teste de conexão'
        });
      } catch (error) {
        results.tests.push({
          name: 'Teste de Conexão',
          status: 'error',
          message: error.message,
          details: `Erro detalhado: ${error.stack || error.message}`
        });
      }

      // Teste 4: Verificar CORS
      try {
        const corsTest = await fetch(results.url, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
          }
        });
        
        results.tests.push({
          name: 'Teste CORS',
          status: corsTest.ok ? 'success' : 'warning',
          message: corsTest.ok ? 'CORS configurado corretamente' : 'Possível problema de CORS',
          details: `Status: ${corsTest.status}, Headers: ${JSON.stringify(Object.fromEntries(corsTest.headers.entries()))}`
        });
      } catch (corsError) {
        results.tests.push({
          name: 'Teste CORS',
          status: 'error',
          message: 'Erro ao testar CORS',
          details: `Erro: ${corsError.message}`
        });
      }

    } catch (error) {
      results.tests.push({
        name: 'Conexão Geral',
        status: 'error',
        message: error.message,
        details: `Erro completo: ${error.stack || error.message}`
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
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
            <div className="flex items-center gap-2">
              <code className="text-sm bg-white p-2 rounded border break-all flex-1">
                Supabase
              </code>
              <Button
                onClick={() => copyToClipboard('Supabase')}
                size="sm"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => openUrlInNewTab('https://supabase.com')}
                size="sm"
                variant="outline"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {testResults && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-blue-900">Informações do Sistema:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Online: {testResults.networkInfo.online ? 'Sim' : 'Não'}</p>
                <p>• Plataforma: {testResults.networkInfo.platform}</p>
                <p>• Navegador: {testResults.networkInfo.userAgent.split(' ').slice(-2).join(' ')}</p>
              </div>
            </div>
          )}

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
                Executar Diagnóstico Completo
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
                  {test.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Ver detalhes</summary>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                        {test.details}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-yellow-900">Soluções Recomendadas:</h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li><strong>1. Verificar URL da API:</strong> Clique no botão de link externo para testar a URL diretamente no navegador</li>
              <li><strong>2. Google Apps Script:</strong> Verifique se o script está publicado e acessível publicamente</li>
              <li><strong>3. CORS:</strong> O Google Apps Script pode ter problemas de CORS. Tente adicionar headers CORS no script</li>
              <li><strong>4. Rede:</strong> Verifique sua conexão com a internet e firewall</li>
              <li><strong>5. Timeout:</strong> A API pode estar demorando para responder. Tente novamente</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-900">Como Configurar o Google Apps Script:</h3>
            <ol className="text-sm text-green-800 space-y-1">
              <li>1. Acesse <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="underline">script.google.com</a></li>
              <li>2. Crie um novo projeto</li>
              <li>3. Configure o código para receber requisições POST/GET</li>
              <li>4. Publique como aplicativo web</li>
              <li>5. Configure o acesso como "Anyone"</li>
              <li>6. Copie a URL gerada e atualize no arquivo config.js</li>
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DiagnosticPanel; 