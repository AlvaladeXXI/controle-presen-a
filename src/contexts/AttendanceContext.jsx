
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { APP_CONFIG } from '@/lib/config';

const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance deve ser usado dentro de AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem(APP_CONFIG.LOCAL_STORAGE_KEYS.ADMIN_LOGIN);
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Carregar registros da API
  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getRecords();
      setRecords(data);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      // Em caso de erro, manter registros locais como fallback
      const savedRecords = localStorage.getItem(APP_CONFIG.LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS);
      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar registros quando o admin fizer login
  useEffect(() => {
    if (isAdmin) {
      loadRecords();
    }
  }, [isAdmin]);

  const saveRecord = async (record) => {
  const newRecord = {
    ...record,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('pt-BR'),
    time: new Date().toLocaleTimeString('pt-BR')
  };

  try {
    const result = await apiService.saveRecord(newRecord);

    if (!result.success) {
      return result;
    }

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);

    localStorage.setItem(
      APP_CONFIG.LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS,
      JSON.stringify(updatedRecords)
    );

    return result;

  } catch (error) {
    console.error('Erro ao salvar registro na API:', error);

    if (
      error?.code === '23505' ||
      error?.message?.toLowerCase().includes('duplicate') ||
      error?.message?.toLowerCase().includes('unique')
    ) {
      return {
        success: false,
        message: 'Presença já registrada para hoje.'
      };
    }

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);

    localStorage.setItem(
      APP_CONFIG.LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS,
      JSON.stringify(updatedRecords)
    );

    return {
      success: true,
      message: 'Registro salvo localmente. Os dados serão sincronizados quando a conexão for restaurada.',
      savedLocally: true
    };
  }
};


  const clearAllRecords = async () => {
    try {
      // Limpar na API
      await apiService.clearAllRecords();
      setRecords([]);
      localStorage.removeItem(APP_CONFIG.LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS);
    } catch (error) {
      console.error('Erro ao limpar registros na API:', error);
      // Fallback: limpar apenas localmente
      setRecords([]);
      localStorage.removeItem(APP_CONFIG.LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS);
      throw error;
    }
  };

  // Funções de login/logout
  const loginAdmin = (username, password) => {
    if (username === APP_CONFIG.ADMIN_USERNAME && password === APP_CONFIG.ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(APP_CONFIG.LOCAL_STORAGE_KEYS.ADMIN_LOGIN, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(APP_CONFIG.LOCAL_STORAGE_KEYS.ADMIN_LOGIN);
  };

  // Função para testar conexão
  const testConnection = async () => {
    try {
      const result = await apiService.testConnection();
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, message: 'Erro na conexão: ' + error.message };
    }
  };

  return (
    <AttendanceContext.Provider value={{
      records,
      saveRecord,
      isAdmin,
      setIsAdmin,
      clearAllRecords,
      isLoading,
      loadRecords,
      loginAdmin,
      logoutAdmin,
      testConnection
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};
