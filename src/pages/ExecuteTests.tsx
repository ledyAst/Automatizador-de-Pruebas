import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Play, Check, X, Circle, CircleAlert, Download } from "lucide-react";
import { useProject } from '../contexts/ProjectContext';
import ProjectHeader from '../components/ProjectHeader';
import { simulateDownloadError } from '@/utils/errorSimulation';

interface TestCase {
  id: string;
  projectId: string;
  description: string;
  expected: string;
  status: 'pending' | 'success' | 'error' | 'running';
  output?: string;
}

const ExecuteTests = () => {
  const { activeProject } = useProject();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!activeProject) {
      toast.warning('Selecciona un proyecto para ejecutar pruebas');
      navigate('/project-management');
    }
  }, [activeProject, navigate]);

  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'CT-001',
      projectId: 'PRJ001',
      description: 'Verificar que el sistema permita el inicio de sesión con credenciales válidas',
      expected: 'El usuario debe ser redirigido al dashboard después de un inicio de sesión exitoso',
      status: 'pending',
    },
    {
      id: 'CT-002',
      projectId: 'PRJ001',
      description: 'Comprobar que se muestre un mensaje de error cuando se ingresen credenciales inválidas',
      expected: 'Debe mostrarse un mensaje de error indicando que las credenciales son incorrectas',
      status: 'pending',
    },
    {
      id: 'CT-003',
      projectId: 'PRJ001',
      description: 'Verificar que el sistema bloquee la cuenta después de 3 intentos fallidos de inicio de sesión',
      expected: 'La cuenta debe ser bloqueada temporalmente y mostrar un mensaje adecuado',
      status: 'pending',
    },
    {
      id: 'CT-004',
      projectId: 'PRJ002',
      description: 'Comprobar que el tiempo de respuesta del inicio de sesión no exceda 1 segundo',
      expected: 'El tiempo de respuesta debe ser menor a 1 segundo en condiciones normales',
      status: 'pending',
    },
    {
      id: 'CT-005',
      projectId: 'PRJ002',
      description: 'Verificar que el sistema mantenga la sesión activa durante el periodo configurado',
      expected: 'La sesión debe permanecer activa durante el tiempo configurado sin cerrar automáticamente',
      status: 'pending',
    },
  ]);
  
  // Filter test cases by active project
  const filteredTestCases = activeProject 
    ? testCases.filter(test => test.projectId === activeProject.id)
    : [];
  
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedTests, setCompletedTests] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  useEffect(() => {
    // Reset selected tests when project changes
    setSelectedTests([]);
  }, [activeProject]);
  
  const toggleSelectAll = () => {
    if (selectedTests.length === filteredTestCases.length) {
      setSelectedTests([]);
    } else {
      setSelectedTests(filteredTestCases.map(test => test.id));
    }
  };
  
  const toggleTestSelection = (testId: string) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    } else {
      setSelectedTests([...selectedTests, testId]);
    }
  };
  
  const runTests = () => {
    if (selectedTests.length === 0) {
      toast.error('Por favor, selecciona al menos un caso de prueba');
      return;
    }
    
    setIsRunning(true);
    setProgress(0);
    setCompletedTests(0);
    setConsoleOutput([]);
    
    // Reset all test statuses
    setTestCases(testCases.map(test => ({
      ...test,
      status: selectedTests.includes(test.id) ? 'pending' : test.status,
      output: selectedTests.includes(test.id) ? undefined : test.output
    })));
    
    // Run tests sequentially with simulated delays
    let currentIndex = 0;
    const selectedTestCases = testCases.filter(test => selectedTests.includes(test.id));
    
    const runNextTest = () => {
      if (currentIndex >= selectedTestCases.length) {
        setIsRunning(false);
        toast.success(`Ejecución completada: ${completedTests} pruebas ejecutadas`);
        return;
      }
      
      const currentTest = selectedTestCases[currentIndex];
      
      // Update current test to running status
      setTestCases(prevTests => prevTests.map(test => 
        test.id === currentTest.id ? { ...test, status: 'running' } : test
      ));
      
      // Add console output log
      setConsoleOutput(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] Ejecutando prueba ${currentTest.id}: ${currentTest.description}`
      ]);
      
      // Simulate test execution time (between 1-3 seconds)
      const executionTime = Math.floor(Math.random() * 2000) + 1000;
      
      setTimeout(() => {
        // Generate random success/error with 80% success rate
        const isSuccess = Math.random() < 0.8;
        const status = isSuccess ? 'success' : 'error';
        let output = '';
        
        if (isSuccess) {
          output = `Test pasado correctamente. La acción se completó como se esperaba.`;
        } else {
          output = `Error: No se pudo completar la acción. Código de error: AUTH-${Math.floor(Math.random() * 1000)}`;
        }
        
        // Update test case with results
        setTestCases(prevTests => prevTests.map(test => 
          test.id === currentTest.id ? { 
            ...test, 
            status, 
            output 
          } : test
        ));
        
        // Add result to console output
        setConsoleOutput(prev => [
          ...prev, 
          `[${new Date().toLocaleTimeString()}] Prueba ${currentTest.id} ${isSuccess ? 'EXITOSA ✓' : 'FALLIDA ✕'}: ${output}`
        ]);
        
        // Update progress
        const newCompletedTests = completedTests + 1;
        setCompletedTests(newCompletedTests);
        setProgress((newCompletedTests / selectedTestCases.length) * 100);
        
        // Run next test
        currentIndex++;
        runNextTest();
      }, executionTime);
    };
    
    // Start the process
    runNextTest();
  };

  // Updated function to download test results with proper validation
  const downloadResults = () => {
    // Validate that there are executed tests to download
    const executedTests = testCases.filter(test => test.status !== 'pending');
    
    if (executedTests.length === 0) {
      toast.error("No hay datos disponibles para exportar. Ejecuta al menos una prueba antes de descargar los resultados.", {
        className: '!bg-red-50 !border-red-200 !text-red-600',
      });
      return;
    }

    const { hasError, errorMessage } = simulateDownloadError();
    
    if (hasError) {
      toast.error(errorMessage);
      return;
    }
    
    if (!activeProject) {
      toast.error('No hay proyecto activo seleccionado');
      return;
    }
    
    // Add console log for successful download start
    setConsoleOutput(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Iniciando descarga de resultados para proyecto "${activeProject.name}"...`
    ]);
    
    // Create filename with project name
    const projectNameForFile = activeProject.name.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `resultados_proyecto_${projectNameForFile}.xlsx`;
    
    // Simulate download process
    setTimeout(() => {
      // Create a simple CSV content (simulating Excel export)
      let csvContent = "ID,Descripción,Estado,Resultado,Proyecto\n";
      
      executedTests.forEach(test => {
        const status = test.status === 'success' ? 'Exitoso' : test.status === 'error' ? 'Fallido' : 'Pendiente';
        const result = test.output || 'N/A';
        csvContent += `"${test.id}","${test.description}","${status}","${result}","${activeProject.name}"\n`;
      });
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Resultados descargados correctamente');
      
      setConsoleOutput(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Descarga completada: ${fileName}`
      ]);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      case 'running': return <CircleAlert className="h-5 w-5 text-yellow-500 animate-pulse" />;
      default: return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  // Check if there are any executed tests to enable download button
  const hasExecutedTests = testCases.some(test => test.status !== 'pending');

  if (!activeProject) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Ejecución de Casos de Prueba</h1>
        <p className="text-muted-foreground mt-2">
          Selecciona y ejecuta casos de prueba para validar el comportamiento del sistema.
        </p>
      </div>
      
      <ProjectHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Casos de Prueba ({filteredTestCases.length})</h2>
              <Button 
                onClick={runTests}
                disabled={isRunning || selectedTests.length === 0}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Ejecutar Seleccionados ({selectedTests.length})
              </Button>
            </div>
            
            {filteredTestCases.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedTests.length === filteredTestCases.length && filteredTestCases.length > 0}
                            onCheckedChange={toggleSelectAll}
                            className="mr-2"
                          />
                          <span>Seleccionar</span>
                        </div>
                      </th>
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Descripción</th>
                      <th className="p-2 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTestCases.map((test, index) => (
                      <tr key={test.id} className={index % 2 ? 'bg-muted/20' : ''}>
                        <td className="p-2">
                          <Checkbox
                            checked={selectedTests.includes(test.id)}
                            onCheckedChange={() => toggleTestSelection(test.id)}
                            disabled={isRunning}
                          />
                        </td>
                        <td className="p-2 font-medium">{test.id}</td>
                        <td className="p-2">{test.description}</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            {getStatusIcon(test.status)}
                            <span className="ml-2 capitalize">
                              {test.status === 'pending' ? '-' : test.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">No hay casos de prueba disponibles para este proyecto.</p>
                <p className="text-sm mt-2">Primero debes generar casos de prueba en la sección correspondiente.</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => navigate('/test-case-management')}
                >
                  Ir a Gestión de Casos de Prueba
                </Button>
              </div>
            )}

            {isRunning && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{completedTests} de {selectedTests.length} completados</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Resultados de Ejecución</h2>
              <Button 
                variant="outline" 
                onClick={downloadResults}
                disabled={!hasExecutedTests}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar Excel
              </Button>
            </div>
            
            <Tabs defaultValue="console" className="flex-1 flex flex-col">
              <TabsList className="mb-4">
                <TabsTrigger value="console">Consola</TabsTrigger>
                <TabsTrigger value="results">Resumen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="console" className="flex-1 flex flex-col">
                <div className="bg-black rounded-md p-2 flex-1 overflow-auto">
                  <pre className="text-white font-mono text-sm h-full min-h-[300px]">
                    {consoleOutput.length > 0 
                      ? consoleOutput.join('\n\n')
                      : 'La salida de la consola aparecerá aquí cuando ejecutes los tests...'}
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="results" className="flex-1">
                <div className="space-y-4">
                  {testCases.filter(t => t.status !== 'pending').length > 0 ? (
                    <>
                      <div className="flex justify-around text-center">
                        <div>
                          <div className="text-3xl font-bold text-green-500">
                            {testCases.filter(t => t.status === 'success').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Exitosos</div>
                        </div>
                        <Separator orientation="vertical" />
                        <div>
                          <div className="text-3xl font-bold text-red-500">
                            {testCases.filter(t => t.status === 'error').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Fallidos</div>
                        </div>
                        <Separator orientation="vertical" />
                        <div>
                          <div className="text-3xl font-bold">
                            {testCases.filter(t => t.status !== 'pending').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h3 className="font-medium">Detalle de Resultados</h3>
                        {testCases
                          .filter(t => t.status !== 'pending')
                          .map(test => (
                            <div key={test.id} className={`p-3 rounded-md ${
                              test.status === 'success' ? 'bg-green-50 border border-green-100' : 
                              test.status === 'error' ? 'bg-red-50 border border-red-100' :
                              'bg-gray-50 border border-gray-100'
                            }`}>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <span className="font-medium">{test.id}</span>
                              </div>
                              {test.output && (
                                <p className={`text-sm mt-1 ${
                                  test.status === 'error' ? 'text-red-700' : 'text-muted-foreground'
                                }`}>
                                  {test.output}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay resultados disponibles. Ejecuta algunas pruebas para ver el resumen.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExecuteTests;
