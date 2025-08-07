
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle, QrCode, User, WalletCards as IdCard, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAttendance } from '@/contexts/AttendanceContext';
import { APP_CONFIG } from '@/lib/config';
import SuccessMessage from './SuccessMessage';

const AttendanceForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    registration: '',
    course: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [backend, setBackend] = useState(null);
  const { saveRecord } = useAttendance();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseFromUrl = urlParams.get('curso') || urlParams.get('course') || urlParams.get('reuniao');
    if (courseFromUrl) {
      setFormData(prev => ({ ...prev, course: decodeURIComponent(courseFromUrl) }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > APP_CONFIG.MAX_PHOTO_SIZE) {
        toast({
          title: "Arquivo muito grande",
          description: `A foto deve ter no máximo ${APP_CONFIG.MAX_PHOTO_SIZE / (1024 * 1024)}MB.`,
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target.result;
        setFormData(prev => ({ ...prev, photo: photoData }));
        setPhotoPreview(photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.registration.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome completo e matrícula/CPF.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveRecord({
        fullName: formData.fullName.trim(),
        registration: formData.registration.trim(),
        course: formData.course.trim() || 'Não informado',
        photo: formData.photo,
        hasPhoto: !!formData.photo
      });

      // Mostrar mensagem apropriada baseada no resultado
      if (result.savedLocally) {
        setIsSavedLocally(true);
        toast({
          title: "Registro salvo com sucesso!",
          description: result.message,
          variant: "default"
        });
      } else {
        setIsSavedLocally(false);
        setBackend(result.backend);
        toast({
          title: "Presença registrada!",
          description: result.message,
        });
      }

      setShowSuccess(true);
      
      setTimeout(() => {
        setFormData({
          fullName: '',
          registration: '',
          course: formData.course,
          photo: null
        });
        setPhotoPreview(null);
        setShowSuccess(false);
        setIsSavedLocally(false);
      }, 3000);

    } catch (error) {
      console.error('Erro inesperado ao salvar registro:', error);
      
      toast({
        title: "Erro ao registrar presença",
        description: "Ocorreu um erro inesperado. Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return <SuccessMessage isSavedLocally={isSavedLocally} backend={backend} />;
  }

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
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Controle de Presença</h1>
            <p className="text-gray-600">Preencha os dados para confirmar sua presença</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                Nome Completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <IdCard className="w-4 h-4 mr-2" />
                Matrícula ou CPF *
              </label>
              <input
                type="text"
                name="registration"
                value={formData.registration}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite sua matrícula ou CPF"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Curso ou Reunião
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nome do curso ou reunião"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Camera className="w-4 h-4 mr-2" />
                Foto (Opcional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {photoPreview ? (
                    <div className="text-center">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                      />
                      <span className="text-sm text-green-600">Foto carregada</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Clique para adicionar foto</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-lg py-4"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Registrando...
                </div>
              ) : (
                'Confirmar Presença'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Área Administrativa
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AttendanceForm;
