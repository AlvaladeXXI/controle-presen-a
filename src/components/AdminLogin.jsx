
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAttendance } from '@/contexts/AttendanceContext';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin, isAdmin } = useAttendance();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const success = loginAdmin(credentials.username, credentials.password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel administrativo..."
        });
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Usuário ou senha incorretos.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl card-shadow p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 primary-gradient rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Área Administrativa</h1>
            <p className="text-gray-600">Faça login para acessar o painel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                Usuário
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="form-input pr-12"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-lg py-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar ao formulário
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
