import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Leaf } from 'lucide-react';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones básicas
    if (!formData.usernameOrEmail.trim()) {
      setError('El nombre de usuario o email es requerido');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('La contraseña es requerida');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.usernameOrEmail.trim(), formData.password);
      
      if (result.success) {
        onLoginSuccess && onLoginSuccess(result.user);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Sistema Inteligente de Detección de Enfermedades en Mango
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Usuario o Email</Label>
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                placeholder="Ingrese su usuario o email"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                disabled={loading}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-green-600 hover:text-green-700 font-medium hover:underline"
                disabled={loading}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

