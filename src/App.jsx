
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import AttendanceForm from '@/components/AttendanceForm';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import { AttendanceProvider } from '@/contexts/AttendanceContext';

function App() {
  return (
    <AttendanceProvider>
      <Router>
        <div className="min-h-screen">
          <Helmet>
            <title>Sistema de Controle de Presença</title>
            <meta name="description" content="Sistema moderno de controle de presença via QR Code com interface responsiva e área administrativa." />
          </Helmet>
          
          <Routes>
            <Route path="/" element={<AttendanceForm />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </AttendanceProvider>
  );
}

export default App;
