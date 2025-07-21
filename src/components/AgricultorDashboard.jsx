import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LogOut,
  User,
  Camera,
  MapPin,
  BarChart3,
  FileText,
  Download,
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Leaf,
  TrendingUp,
  Globe,
  Info
} from 'lucide-react';
import axios from 'axios';

const AgricultorDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedParcela, setSelectedParcela] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
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

  const parcelas = [
    { value: 'P001', label: 'Parcela P001' },
    { value: 'P002', label: 'Parcela P002' },
    { value: 'P003', label: 'Parcela P003' },
    { value: 'P004', label: 'Parcela P004' },
    { value: 'P005', label: 'Parcela P005' }
  ];

  const provincias = [
    { value: 'huancayo', label: 'Huancayo' },
    { value: 'chupaca', label: 'Chupaca' },
    { value: 'concepcion', label: 'Concepción' }
  ];

  const languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'qu', label: 'Quechua' }
  ];

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

  const getHealthRecommendation = (predictedClass, isHealthy) => {
    if (isHealthy) {
      return {
        title: "¡Excelente! Tu planta está saludable",
        message: "Continúa con las prácticas de cuidado actuales. Mantén un riego adecuado y monitoreo regular.",
        color: "text-green-700"
      };
    } else {
      const recommendations = {
        'antracnosis': 'Aplica fungicidas preventivos y mejora la ventilación del cultivo.',
        'chancro bacteriano': 'Elimina las partes afectadas y aplica bactericidas específicos.',
        'cortar gorgojo': 'Usa trampas para gorgojos y aplica insecticidas orgánicos.',
        'die back': 'Poda las ramas afectadas y mejora el drenaje del suelo.',
        'ball Midge': 'Controla la humedad y aplica tratamientos específicos para ácaros.',
        'moho polvoriento': 'Mejora la circulación de aire y aplica fungicidas preventivos.',
        'moho hollín': 'Controla las plagas que producen melaza y mejora la ventilación.'
      };
      
      return {
        title: `Enfermedad detectada: ${predictedClass}`,
        message: recommendations[predictedClass] || 'Consulta con un especialista para el tratamiento adecuado.',
        color: "text-red-700"
      };
    }
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
                  Panel del Agricultor
                </h1>
                <p className="text-sm text-gray-500">Sistema de Detección de Enfermedades</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username}
                </p>
                <Badge variant="default" className="text-xs bg-green-600">
                  Agricultor
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
                  Sube una foto de la hoja de tu planta de mango para detectar posibles enfermedades
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
                          Toma o selecciona una foto de la hoja
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
                            {result.predicted_class}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Nivel de confianza: {result.confidence}%
                          </p>
                          <Progress value={result.confidence} className="mt-2" />
                        </div>
                        
                        {/* Desglose de Confianza por Clase */}
                        {result.all_predictions && result.all_predictions.length > 0 && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Desglose de Confianza por Clase
                            </h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {result.all_predictions.map((prediction, index) => (
                                <li key={index} className="flex justify-between items-center">
                                  <span className="font-normal">{prediction.class}:</span>
                                  <span className="font-semibold">{prediction.probability.toFixed(2)}%</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recomendaciones */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                            <Info className="w-4 h-4 mr-2" />
                            Recomendaciones
                          </h4>
                          <div className={getHealthRecommendation(result.predicted_class, result.is_healthy).color}>
                            <p className="font-medium mb-1">
                              {getHealthRecommendation(result.predicted_class, result.is_healthy).title}
                            </p>
                            <p className="text-sm">
                              {getHealthRecommendation(result.predicted_class, result.is_healthy).message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Información del usuario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Mi Información</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Agricultor:</strong> {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Parcelas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Mis Parcelas</span>
                </CardTitle>
                <CardDescription>
                  Gestiona y monitorea tus cultivos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parcela:</label>
                  <Select value={selectedParcela} onValueChange={setSelectedParcela}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar parcela" />
                    </SelectTrigger>
                    <SelectContent>
                      {parcelas.map((parcela) => (
                        <SelectItem key={parcela.value} value={parcela.value}>
                          {parcela.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Provincia:</label>
                  <Select value={selectedProvincia} onValueChange={setSelectedProvincia}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {provincias.map((provincia) => (
                        <SelectItem key={provincia.value} value={provincia.value}>
                          {provincia.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reportes y Funciones */}
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Herramientas</CardTitle>
                <CardDescription>
                  Accede a reportes de tu cultivo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Mapa de Calor Detección')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Mapa de Calor Detección
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Reporte de Plagas Detectadas')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reporte de Plagas
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Reporte de Enfermedades Detectadas')}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Reporte de Enfermedades
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Generar reporte PDF')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Reporte PDF
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => showDevelopmentModal('Exportar resultados (Excel)')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar a Excel
                </Button>
              </CardContent>
            </Card>

            {/* Configuración de idioma */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Configuración</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Idioma de la interfaz:</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Información del sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Información del Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Enfermedades detectables:</strong></p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-4">
                    <li>• Antracnosis</li>
                    <li>• Chancro bacteriano</li>
                    <li>• Cortar gorgojo</li>
                    <li>• Die back</li>
                    <li>• Ball Midge</li>
                    <li>• Moho polvoriento</li>
                    <li>• Moho hollín</li>
                    <li>• Saludable</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgricultorDashboard;





