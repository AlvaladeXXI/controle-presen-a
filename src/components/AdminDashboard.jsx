
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Download, 
  Users, 
  Calendar, 
  Image, 
  Trash2, 
  Search,
  Filter,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAttendance } from '@/contexts/AttendanceContext';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { records, logoutAdmin, isAdmin, clearAllRecords } = useAttendance();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.registration.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCourse) {
      filtered = filtered.filter(record =>
        record.course.toLowerCase().includes(filterCourse.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [records, searchTerm, filterCourse]);

  const handleLogout = () => {
    logoutAdmin();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
    navigate('/admin');
  };

  const downloadPhoto = (record) => {
    if (!record.photo) {
      toast({
        title: "Foto não disponível",
        description: "Esta pessoa não enviou foto.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Converter base64 para blob
      const base64Response = fetch(record.photo);
      base64Response.then(res => res.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Criar nome do arquivo baseado nos dados da pessoa
        const fileName = `foto_${record.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_${record.registration}_${record.date.replace(/\//g, '-')}.jpg`;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Foto baixada!",
          description: `Foto de ${record.fullName} foi baixada com sucesso.`
        });
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar foto",
        description: "Não foi possível baixar a foto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    if (records.length === 0) {
      toast({
        title: "Nenhum registro encontrado",
        description: "Não há dados para exportar.",
        variant: "destructive"
      });
      return;
    }

    const exportData = records.map(record => ({
      'Nome': record.fullName,
      'Matrícula/CPF': record.registration,
      'Curso/Reunião': record.course,
      'Data': record.date,
      'Horário': record.time,
      'Possui Foto': record.hasPhoto ? 'Sim' : 'Não',
      'ID do Registro': record.id
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registros de Presença');

    const fileName = `registros_presenca_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Exportação concluída!",
      description: `Arquivo ${fileName} baixado com sucesso. As fotos podem ser baixadas individualmente na tabela.`
    });
  };

  const handleClearAllRecords = () => {
    if (window.confirm('Tem certeza que deseja excluir todos os registros? Esta ação não pode ser desfeita.')) {
      clearAllRecords();
      toast({
        title: "Registros excluídos",
        description: "Todos os registros foram removidos com sucesso."
      });
    }
  };

  const uniqueCourses = [...new Set(records.map(record => record.course))];

  const stats = {
    total: records.length,
    withPhoto: records.filter(r => r.hasPhoto).length,
    today: records.filter(r => r.date === new Date().toLocaleDateString('pt-BR')).length
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie os registros de presença</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl card-shadow p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl card-shadow p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Com Foto</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withPhoto}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl card-shadow p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Todos os cursos</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={exportToExcel}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar Excel
              </Button>
              
              {records.length > 0 && (
                <Button
                  onClick={handleClearAllRecords}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Tudo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Registros de Presença ({filteredRecords.length})
            </h2>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {records.length === 0 ? 'Nenhum registro encontrado' : 'Nenhum resultado para os filtros aplicados'}
              </h3>
              <p className="text-gray-600">
                {records.length === 0 
                  ? 'Os registros de presença aparecerão aqui conforme forem sendo enviados.'
                  : 'Tente ajustar os filtros de busca para encontrar os registros desejados.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matrícula/CPF
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso/Reunião
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foto
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {record.registration}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {record.course}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{record.date}</div>
                          <div className="text-gray-500">{record.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.hasPhoto ? (
                          <div className="flex items-center space-x-3">
                            {record.photo && (
                              <img
                                src={record.photo}
                                alt="Foto do participante"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-green-600 font-medium">
                                Disponível
                              </span>
                              <Button
                                onClick={() => downloadPhoto(record)}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                Baixar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Não enviada
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
