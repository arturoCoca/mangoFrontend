import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff, Leaf, UserPlus } from 'lucide-react';

const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'agricultor',
    first_name: '',
    last_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = [
    { value: 'agricultor', label: 'Agricultor' },
    { value: 'operador', label: 'Operador del Sistema' },
    { value: 'administrador', label: 'Administrador' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      return 'El nombre de usuario es requerido';
    }

    if (formData.username.length < 3) {
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      return 'El email es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'El formato del email no es válido';
    }

    if (!formData.password) {
      return 'La contraseña es requerida';
    }

    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para enviar
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        first_name: formData.first_name.trim() || undefined,
        last_name: formData.last_name.trim() || undefined
      };

      const result = await register(userData);
      
      if (result.success) {
        onRegisterSuccess && onRegisterSuccess(result.user);
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
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Regístrate en el Sistema de Detección de Enfermedades
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Nombre"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Apellido"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Usuario *</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={handleRoleChange} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-green-600 hover:text-green-700 font-medium hover:underline"
                disabled={loading}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;

