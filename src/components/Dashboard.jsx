import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Camera, 
  Leaf, 
  LogOut, 
  User, 
  BarChart3, 
  FileText, 
  Settings, 
  MapPin,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Función para mostrar modal de función en desarrollo
  const showDevelopmentModal = (functionName) => {
    alert(`Función "${functionName}" en desarrollo.\n\nEsta funcionalidad será implementada en futuras versiones del sistema.`);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de archivo no permitido. Use JPG, PNG, GIF o BMP.');
        return;
      }

      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('La imagen es demasiado grande. Tamaño máximo: 10MB.');
        return;
      }

      setSelectedImage(file);
      setError('');
      setResult(null);

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('Por favor selecciona una imagen primero.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post('/disease/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResult(response.data.result);
      } else {
        setError('Error en el análisis de la imagen.');
      }
    } catch (error) {
      console.error('Error analizando imagen:', error);
      const errorMessage = error.response?.data?.error || 'Error de conexión con el servidor.';
      setError(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'administrador': 'Administrador',
      'operador': 'Operador del Sistema',
      'agricultor': 'Agricultor'
    };
    return roleNames[role] || role;
  };

  const getResultIcon = (isHealthy) => {
    return isHealthy ? (
      <CheckCircle className="w-6 h-6 text-green-600" />
    ) : (
      <AlertTriangle className="w-6 h-6 text-red-600" />
    );
  };

  const getResultColor = (isHealthy) => {
    return isHealthy ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Sistema de Detección de Enfermedades
                </h1>
                <p className="text-sm text-gray-500">Mango Disease Detection</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {getRoleDisplayName(user?.role)}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel principal de detección */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-green-600" />
                  <span>Detección de Enfermedades en Hojas de Mango</span>
                </CardTitle>
                <CardDescription>
                  Sube una imagen de una hoja de mango para detectar posibles enfermedades
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Área de carga de imagen */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Imagen seleccionada"
                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <div className="flex justify-center space-x-3">
                        <Button
                          onClick={analyzeImage}
                          disabled={analyzing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {analyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analizando...
                            </>
                          ) : (
                            <>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analizar Imagen
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={clearAnalysis}>
                          Limpiar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Selecciona una imagen
                        </p>
                        <p className="text-sm text-gray-500">
                          JPG, PNG, GIF o BMP hasta 10MB
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Subir Imagen
                      </Button>
                    </div>
                  )}
                </div>

                {/* Resultados del análisis */}
                {result && (
                  <Card className={`border-2 ${result.is_healthy ? 'border-green-200' : 'border-red-200'}`}>
                    <CardHeader className={`${getResultColor(result.is_healthy)} rounded-t-lg`}>
                      <CardTitle className="flex items-center space-x-2">
                        {getResultIcon(result.is_healthy)}
                        <span>Resultado del Análisis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Diagnóstico: {result.predicted_class}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Confianza: {result.confidence}%
                          </p>
                          <Progress value={result.confidence} className="mt-2" />
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Desglose de Probabilidades:
                          </h4>
                          <div className="space-y-2">
                            {result.all_predictions.slice(0, 5).map((pred, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">{pred.class}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full"
                                      style={{ width: `${pred.probability}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 w-12">
                                    {pred.probability}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral con funciones */}
          <div className="space-y-6">
            {/* Información del usuario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Mi Perfil</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Usuario:</strong> {user?.username}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Rol:</strong> {getRoleDisplayName(user?.role)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Funciones del sistema */}
            <Card>
              <CardHeader>
                <CardTitle>Funciones del Sistema</CardTitle>
                <CardDescription>
                  Herramientas y reportes disponibles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Mapa de Calor')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Mapa de Calor Detección
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Reporte de Plagas')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reporte de Plagas
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Reporte de Enfermedades')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Reporte de Enfermedades
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Generar PDF')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Reporte PDF
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Exportar Excel')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar a Excel
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Configuración')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Button>
              </CardContent>
            </Card>

            {/* Información del modelo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Información del Modelo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Modelo:</strong> MobileNetV2</p>
                  <p><strong>Clases detectables:</strong> 8</p>
                  <p><strong>Resolución:</strong> 224x224 px</p>
                  <div>
                    <strong>Enfermedades:</strong>
                    <ul className="mt-1 text-xs text-gray-600 space-y-1">
                      <li>• Antracnosis</li>
                      <li>• Chancro bacteriano</li>
                      <li>• Cortar gorgojo</li>
                      <li>• Die back</li>
                      <li>• Ball Midge</li>
                      <li>• Saludable</li>
                      <li>• Moho polvoriento</li>
                      <li>• Moho hollín</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

