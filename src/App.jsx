import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import OperatorDashboard from './components/OperatorDashboard';
import AgricultorDashboard from './components/AgricultorDashboard';
import { Loader2 } from 'lucide-react';
import './App.css';

// Componente para manejar la autenticación y mostrar el dashboard correcto
const AppContent = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar login o registro
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onSwitchToLogin={() => setShowRegister(false)}
          onRegisterSuccess={() => {
            // El usuario será redirigido automáticamente al dashboard
            // después del registro exitoso
          }}
        />
      );
    } else {
      return (
        <Login
          onSwitchToRegister={() => setShowRegister(true)}
          onLoginSuccess={() => {
            // El usuario será redirigido automáticamente al dashboard
            // después del login exitoso
          }}
        />
      );
    }
  }

  // Si está autenticado, mostrar el dashboard correspondiente según el rol
  const renderDashboard = () => {
    switch (user?.role) {
      case 'administrador':
        return <AdminDashboard />;
      case 'operador':
        return <OperatorDashboard />;
      case 'agricultor':
        return <AgricultorDashboard />;
      default:
        // Por defecto, mostrar dashboard de agricultor
        return <AgricultorDashboard />;
    }
  };

  return renderDashboard();
};

// Componente principal de la aplicación
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
