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
  Play,
  MapPin,
  BarChart3,
  FileText,
  Download,
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Zap,
  Activity,
  Globe
} from 'lucide-react';
import axios from 'axios';

const OperatorDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedParcela, setSelectedParcela] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [diagnosisProgress, setDiagnosisProgress] = useState(0);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
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

  const cameraTypes = [
    { value: 'frontal', label: 'Cámara frontal' },
    { value: 'inferior', label: 'Cámara inferior' },
    { value: 'lateral', label: 'Cámara lateral' },
    { value: 'panoramica', label: 'Cámara panorámica' }
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

  const startDiagnosis = () => {
    setIsDiagnosing(true);
    setDiagnosisProgress(0);
    
    // Simular progreso del diagnóstico
    const interval = setInterval(() => {
      setDiagnosisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDiagnosing(false);
          showDevelopmentModal('Diagnóstico completado');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Panel de Operador
                </h1>
                <p className="text-sm text-gray-500">Sistema Inteligente de Detección</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username}
                </p>
                <Badge variant="default" className="text-xs bg-orange-600">
                  Operador
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Panel de Control Principal */}
          <Card className="shadow-lg xl:col-span-2">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-orange-600" />
                <span>Sistema Inteligente de Detección de Plagas y Enfermedades</span>
              </CardTitle>
              <CardDescription>
                Control operacional del sistema de detección
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Selección de Parcelas y Provincias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parcelas:</label>
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
              </div>

              {/* Diagnóstico */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Diagnóstico del Sistema</h3>
                  <Button
                    onClick={startDiagnosis}
                    disabled={isDiagnosing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isDiagnosing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Diagnosticando...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Iniciar Diagnóstico
                      </>
                    )}
                  </Button>
                </div>
                
                {isDiagnosing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso del diagnóstico</span>
                      <span>{diagnosisProgress}%</span>
                    </div>
                    <Progress value={diagnosisProgress} className="w-full" />
                  </div>
                )}
              </div>

              {/* Botones de Funciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => showDevelopmentModal('Mapa de Calor Detección')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Mapa de Calor Detección
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => showDevelopmentModal('Reporte de Plagas Detectadas')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reporte de Plagas Detectadas
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => showDevelopmentModal('Reporte de Enfermedades Detectadas')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Reporte de Enfermedades Detectadas
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => showDevelopmentModal('Generar reporte PDF')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generar reporte PDF
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => showDevelopmentModal('Exportar resultados (Excel)')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar resultados (Excel)
                </Button>
                
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
              </div>
            </CardContent>
          </Card>

          {/* Módulo de Percepción - Captura de Imágenes por DRONE */}
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-blue-600" />
                <span>Captura de Imágenes por DRONE</span>
              </CardTitle>
              <CardDescription>
                Control de drones y captura de imágenes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Conectar DRONE')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Conectar DRONE
              </Button>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de cámara:</label>
                <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cámara" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameraTypes.map((camera) => (
                      <SelectItem key={camera.value} value={camera.value}>
                        {camera.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Cargar imágenes de plantas')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Cargar imágenes de plantas
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Importar datos desde archivo')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Importar datos desde archivo
              </Button>
            </CardContent>
          </Card>

          {/* Panel de Análisis de Imágenes */}
          <Card className="shadow-lg xl:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-green-600" />
                <span>Análisis de Imágenes de Hojas de Mango</span>
              </CardTitle>
              <CardDescription>
                Sube una imagen para detectar enfermedades en tiempo real
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
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
                        className="bg-orange-600 hover:bg-orange-700"
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
                        Selecciona una imagen de hoja de mango
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
                      className="bg-orange-600 hover:bg-orange-700"
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
                                    className="bg-orange-600 h-2 rounded-full"
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
      </div>
    </div>
  );
};

export default OperatorDashboard;

