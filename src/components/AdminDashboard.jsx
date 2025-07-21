import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  LogOut, 
  User, 
  Camera,
  Database,
  Brain,
  BookOpen,
  Play,
  Settings,
  MessageSquare,
  FileText,
  Download,
  Upload,
  Leaf,
  Droplets,
  Thermometer,
  Bug,
  TreePine,
  Search,
  RefreshCw,
  Zap,
  BarChart3,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedSensor, setSelectedSensor] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  // Función para mostrar modal de función en desarrollo
  const showDevelopmentModal = (functionName) => {
    alert(`Función "${functionName}" en desarrollo.\n\nEsta funcionalidad será implementada en futuras versiones del sistema.`);
  };

  const sensorTypes = [
    { value: 'camera', label: 'Cámara' },
    { value: 'humidity', label: 'Humedad' },
    { value: 'temperature', label: 'Temperatura' },
    { value: 'ph', label: 'pH del suelo' },
    { value: 'light', label: 'Sensor de luz' }
  ];

  const crops = [
    { value: 'mango', label: 'Mango' },
    { value: 'maiz', label: 'Maíz' },
    { value: 'papa', label: 'Papa' },
    { value: 'cafe', label: 'Café' },
    { value: 'tomate', label: 'Tomate' }
  ];

  const algorithms = [
    { value: 'rules', label: 'Reglas de Inferencia' },
    { value: 'decision_tree', label: 'Árbol de Decisión' },
    { value: 'neural_network', label: 'Red Neuronal' },
    { value: 'svm', label: 'SVM' },
    { value: 'random_forest', label: 'Random Forest' }
  ];

  const techniques = [
    { value: 'svm', label: 'SVM' },
    { value: 'cnn', label: 'CNN' },
    { value: 'random_forest', label: 'Random Forest' },
    { value: 'mobilenet', label: 'MobileNet' },
    { value: 'resnet', label: 'ResNet' }
  ];

  const actionTypes = [
    { value: 'fumigation', label: 'Fumigación' },
    { value: 'irrigation', label: 'Riego' },
    { value: 'alert', label: 'Alerta' },
    { value: 'fertilization', label: 'Fertilización' }
  ];

  const languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'qu', label: 'Quechua' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Panel de Administrador
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
                <Badge variant="default" className="text-xs bg-blue-600">
                  Administrador
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
          
          {/* 1. Módulo de Percepción */}
          <Card className="shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-green-600" />
                <span>Captura de Datos Ambientales</span>
              </CardTitle>
              <CardDescription>
                Gestión de sensores y captura de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Conectar sensores')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Conectar sensores
              </Button>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de sensor:</label>
                <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sensor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensorTypes.map((sensor) => (
                      <SelectItem key={sensor.value} value={sensor.value}>
                        {sensor.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                placeholder="Ingreso manual de datos (en caso de fallos de sensores)"
                className="min-h-[80px]"
              />
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Cargar imagen de planta')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Cargar imagen de planta
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

          {/* 2. Módulo de Conocimiento */}
          <Card className="shadow-lg">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span>Base de Conocimiento Fitopatológica</span>
              </CardTitle>
              <CardDescription>
                Gestión de conocimiento sobre enfermedades
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Selección de cultivo:</label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cultivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Consultar enfermedades asociadas')}
              >
                <Search className="mr-2 h-4 w-4" />
                Consultar enfermedades asociadas
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Ver ontología de plagas')}
              >
                <Bug className="mr-2 h-4 w-4" />
                Ver ontología de plagas
              </Button>
              
              <Input
                placeholder="Búsqueda por nombre de plaga o síntoma"
                className="w-full"
              />
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Actualizar base de datos')}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar base de datos
              </Button>
            </CardContent>
          </Card>

          {/* 3. Módulo de Razonamiento */}
          <Card className="shadow-lg">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-orange-600" />
                <span>Diagnóstico Inteligente</span>
              </CardTitle>
              <CardDescription>
                Motor de inferencia y diagnóstico
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Button
                variant="default"
                className="w-full justify-start bg-orange-600 hover:bg-orange-700"
                onClick={() => showDevelopmentModal('Ejecutar diagnóstico')}
              >
                <Play className="mr-2 h-4 w-4" />
                Ejecutar diagnóstico
              </Button>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Algoritmo:</label>
                <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar algoritmo" />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        {algo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                placeholder="Mostrar inferencias o hipótesis generadas"
                className="min-h-[80px]"
                readOnly
              />
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Ver historial de decisiones')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Ver historial de decisiones
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Sugerir tratamiento')}
              >
                <Leaf className="mr-2 h-4 w-4" />
                Sugerir tratamiento
              </Button>
            </CardContent>
          </Card>

          {/* 4. Módulo de Aprendizaje */}
          <Card className="shadow-lg">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <span>Entrenamiento y Adaptación</span>
              </CardTitle>
              <CardDescription>
                Gestión de modelos de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Entrenar nuevo modelo')}
              >
                <Brain className="mr-2 h-4 w-4" />
                Entrenar nuevo modelo
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Cargar dataset de entrenamiento')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Cargar dataset de entrenamiento
              </Button>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Técnica:</label>
                <Select value={selectedTechnique} onValueChange={setSelectedTechnique}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar técnica" />
                  </SelectTrigger>
                  <SelectContent>
                    {techniques.map((tech) => (
                      <SelectItem key={tech.value} value={tech.value}>
                        {tech.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                placeholder="Métricas de rendimiento (precisión, recall, etc.)"
                className="min-h-[60px]"
                readOnly
              />
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Actualizar modelo')}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar modelo
              </Button>
            </CardContent>
          </Card>

          {/* 5. Módulo de Acción */}
          <Card className="shadow-lg">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-red-600" />
                <span>Ejecución de Respuestas</span>
              </CardTitle>
              <CardDescription>
                Control de actuadores y acciones
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Enviar comando a actuador')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Enviar comando a actuador
              </Button>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de acción:</label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar acción" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                placeholder="Parámetros de acción (dosis, zona, tiempo)"
                className="min-h-[80px]"
              />
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Simular acción')}
              >
                <Play className="mr-2 h-4 w-4" />
                Simular acción
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Ver historial de acciones')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Ver historial de acciones
              </Button>
            </CardContent>
          </Card>

          {/* 6. Interfaz Hombre-Máquina */}
          <Card className="shadow-lg">
            <CardHeader className="bg-teal-50">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <span>Centro de Interacción con el Usuario</span>
              </CardTitle>
              <CardDescription>
                Comunicación y reportes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Textarea
                placeholder="Chat o asistente virtual"
                className="min-h-[80px]"
              />
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Solicitar ayuda')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Solicitar ayuda
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Generar reporte')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generar reporte
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => showDevelopmentModal('Exportar resultados (PDF/Excel)')}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar resultados (PDF/Excel)
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

