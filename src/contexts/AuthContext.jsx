import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configuración base de axios
const API_BASE_URL = 'http://localhost:5000/api';

// Configurar axios para incluir el token en todas las peticiones
axios.defaults.baseURL = API_BASE_URL;

// Interceptor para agregar el token a las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          // Validar el token con el servidor
          const response = await axios.get('/auth/validate-token');
          if (response.data.valid) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          } else {
            // Token inválido, limpiar datos
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error validando token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post('/auth/login', {
        username_or_email: usernameOrEmail,
        password: password
      });

      const { user: userData, access_token } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar estado
      setUser(userData);
      setToken(access_token);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.error || 'Error de conexión';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      
      const { user: newUser, access_token } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Actualizar estado
      setUser(newUser);
      setToken(access_token);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error en registro:', error);
      const errorMessage = error.response?.data?.error || 'Error de conexión';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;

