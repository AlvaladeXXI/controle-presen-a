import React, { useState, useEffect } from 'react';
import { Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '@/lib/api';

const StatusIndicator = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      await apiService.testConnection();
      setStatus('connected');
    } catch (error) {
      console.log('Status check failed:', error.message);
      setStatus('error');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: 'Conectado ao Google Sheets',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'error':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
          text: 'Problemas de conexão - Dados salvos localmente',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
      case 'checking':
        return {
          icon: <Wifi className="w-4 h-4 text-blue-600 animate-pulse" />,
          text: 'Verificando conexão...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      default:
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          text: 'Erro de conexão',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusInfo.bgColor}`}>
      {statusInfo.icon}
      <span className={`text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
      {lastCheck && (
        <span className="text-xs text-gray-500">
          (última verificação: {lastCheck.toLocaleTimeString()})
        </span>
      )}
      <button
        onClick={checkConnection}
        className="ml-2 text-xs text-gray-500 hover:text-gray-700"
        title="Verificar novamente"
      >
        ↻
      </button>
    </div>
  );
};

export default StatusIndicator; 