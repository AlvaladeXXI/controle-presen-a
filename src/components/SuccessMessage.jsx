import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Wifi, WifiOff } from 'lucide-react';

const SuccessMessage = ({ isSavedLocally = false }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-6 success-animation"
      >
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-green-600">Presença Registrada!</h2>
          
          {isSavedLocally ? (
            <div className="space-y-3">
              <p className="text-gray-600">Obrigado por confirmar sua presença.</p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <WifiOff className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Dados salvos localmente
                  </span>
                </div>
                <p className="text-sm text-yellow-700">
                  Os dados foram salvos no seu dispositivo e serão sincronizados com a planilha quando a conexão for restaurada.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600">Obrigado por confirmar sua presença.</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Dados sincronizados
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Os dados foram enviados com sucesso para a planilha do Google Sheets.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessMessage; 