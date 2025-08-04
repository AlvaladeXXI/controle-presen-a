// Configurações da API do Google Sheets
export const API_CONFIG = {
  GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbzJOAwnTas5wOsx5R5LffjX5sQ7zxdHeLDGKno3DpMgxAaC0Jh6cRoUUsGQEaJaDUVw/exec',
  
  // Configurações de timeout
  REQUEST_TIMEOUT: 30000, // 30 segundos
  
  // Configurações de retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// Configurações do aplicativo
export const APP_CONFIG = {
  // Credenciais do admin (em produção, isso deveria estar em variáveis de ambiente)
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'crc@123',
  
  // Configurações de armazenamento local
  LOCAL_STORAGE_KEYS: {
    ATTENDANCE_RECORDS: 'attendanceRecords',
    ADMIN_LOGIN: 'isAdminLoggedIn',
  },
  
  // Configurações de validação
  MAX_PHOTO_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_PHOTO_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
}; 