
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const savedRecords = localStorage.getItem('attendanceRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }

    const adminStatus = localStorage.getItem('isAdminLoggedIn');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const saveRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR')
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
  };

  const loginAdmin = (username, password) => {
    if (username === 'admin' && password === 'crc@123') {
      setIsAdmin(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdminLoggedIn');
  };

  const clearAllRecords = () => {
    setRecords([]);
    localStorage.removeItem('attendanceRecords');
  };

  return (
    <AttendanceContext.Provider value={{
      records,
      saveRecord,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      clearAllRecords
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};
