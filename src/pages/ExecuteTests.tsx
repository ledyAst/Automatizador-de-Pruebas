import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Square, Download, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { useProject } from '../contexts/ProjectContext';
import ProjectHeader from '../components/ProjectHeader';

const ExecuteTests = () => {
  const { activeProject } = useProject();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!activeProject) {
      toast.warning('Selecciona un proyecto para ejecutar pruebas');
      navigate('/project-management');
    }
  }, [activeProject, navigate]);

  const [testCases, setTestCases] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [executionProgress, setExecutionProgress] = useState(0);

  // Load test cases from localStorage on component mount and project change
  useEffect(() => {
    const loadTestCases = () => {
      const storedTestCases = JSON.parse(localStorage.getItem('testCases') || '[]');
      
      // Filter by active project and add execution status
      const projectTestCases = activeProject 
        ? storedTestCases
            .filter(tc => tc.projectId === activeProject.id)
            .map(tc => ({ ...tc, status: 'pending', output: '' }))
        : [];
      
      setTestCases(projectTestCases);
    };
    
    loadTestCases();
    
    // Set up storage event listener to update when localStorage changes
    const handleStorageChange = () => {
      loadTestCases();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [activeProject]);

  // Calculate execution statistics
  const executionStats = {
    total: testCases.length,
    executed: testCases.filter(test => test.status !== 'pending').length,
    passed: testCases.filter(test => test.status === 'success').length,
    failed: testCases.filter(test => test.status === 'failed').length,
    pending: testCases.filter(test => test.status === 'pending').length
  };

  const simulateTestExecution = (testCase: any) => {
    return new Promise((resolve) => {
      const randomDuration = Math.random() * (5000 - 1000) + 1000;
      const randomSuccess = Math.random() < 0.8;

      setConsoleOutput(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Ejecutando prueba ${testCase.id}: ${testCase.description}`
      ]);

      setTimeout(() => {
        const status = randomSuccess ? 'success' : 'failed';
        const output = randomSuccess
          ? `[${new Date().toLocaleTimeString()}] ✅ Prueba ${testCase.id} completada exitosamente.`
          : `[${new Date().toLocaleTimeString()}] ❌ Prueba ${testCase.id} fallida.`;

        setConsoleOutput(prev => [...prev, output]);
        resolve({ status, output });
      }, randomDuration);
    });
  };

  const runNextTest = async () => {
    if (currentTestIndex < testCases.length && isExecuting) {
      const currentTest = testCases[currentTestIndex];
      
      setTestCases(prev => prev.map((test, index) =>
        index === currentTestIndex ? { ...test, status: 'running' } : test
      ));

      const result: any = await simulateTestExecution(currentTest);
      
      setTestCases(prev => prev.map((test, index) =>
        index === currentTestIndex ? { ...test, status: result.status, output: result.output } : test
      ));
      
      setCurrentTestIndex(prev => prev + 1);
      setExecutionProgress(((currentTestIndex + 1) / testCases.length) * 100);
    } else {
      setIsExecuting(false);
      setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Ejecución de pruebas completada.`]);
      toast.success('Ejecución de pruebas completada');
    }
  };

  useEffect(() => {
    if (isExecuting) {
      runNextTest();
    }
  }, [isExecuting, currentTestIndex, testCases]);

  const startTestExecution = () => {
    if (testCases.length === 0) {
      toast.warning('No hay casos de prueba para ejecutar');
      return;
    }
    setIsExecuting(true);
    setCurrentTestIndex(0);
    setExecutionProgress(0);
    setConsoleOutput([`[${new Date().toLocaleTimeString()}] 🚀 Iniciando ejecución de pruebas...`]);
    
    // Reset test statuses
    setTestCases(prev => prev.map(test => ({ ...test, status: 'pending', output: '' })));
  };

  const stopTestExecution = () => {
    setIsExecuting(false);
    setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🛑 Ejecución de pruebas interrumpida.`]);
    toast.warning('Ejecución de pruebas interrumpida');
  };

  const resetTests = () => {
    setIsExecuting(false);
    setCurrentTestIndex(0);
    setExecutionProgress(0);
    setConsoleOutput([]);
    setTestCases(prev => prev.map(test => ({ ...test, status: 'pending', output: '' })));
    toast.info('Estados de las pruebas reiniciados');
  };

  // Updated function to actually download an Excel file
  const downloadResults = () => {
    if (!activeProject) {
      toast.error('No hay proyecto activo');
      return;
    }

    // Simulate occasional failure (20% chance)
    if (Math.random() < 0.2) {
      const errorCode = Math.floor(Math.random() * 900) + 100;
      toast.error(`No se pudo completar la acción. Intente nuevamente. Error ${errorCode}.`, {
        className: '!bg-red-50 !border-red-200 !text-red-600',
      });
      return;
    }

    // Clean project name for filename
    const cleanProjectName = activeProject.name.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `resultados_proyecto_${cleanProjectName}.xlsx`;
    
    // Add console log for download start
    setConsoleOutput(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Descargando resultados de pruebas en formato Excel...`
    ]);
    
    // Create Excel-like content (CSV format that Excel can open)
    const executedTests = testCases.filter(test => test.status !== 'pending');
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Descripción,Resultado Esperado,Estado,Salida\n";
    
    executedTests.forEach(test => {
      const status = test.status === 'success' ? 'Exitoso' : 'Fallido';
      const output = test.output || '';
      csvContent += `"${test.id}","${test.description}","${test.expected}","${status}","${output}"\n`;
    });
    
    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message and update console
    setTimeout(() => {
      toast.success('Resultados descargados correctamente en formato Excel');
      
      setConsoleOutput(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ✅ Descarga completada: ${fileName}`
      ]);
    }, 500);
  };

  if (!activeProject) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ejecutar Tests</h1>
        <p className="text-muted-foreground">Ejecuta los casos de prueba definidos para el proyecto seleccionado</p>
      </div>

      <ProjectHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Casos de Prueba</CardTitle>
                <CardDescription>
                  {testCases.length} casos de prueba para {activeProject.name}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={isExecuting}
                  onClick={startTestExecution}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Ejecutar
                </Button>
                <Button
                  variant="secondary"
                  disabled={!isExecuting}
                  onClick={stopTestExecution}
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Detener
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetTests}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={executionProgress} className="mb-4" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell>{testCase.id}</TableCell>
                      <TableCell className="truncate max-w-xs">{testCase.description}</TableCell>
                      <TableCell>
                        {testCase.status === 'pending' && (
                          <Badge variant="outline" className="text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            Pendiente
                          </Badge>
                        )}
                        {testCase.status === 'running' && (
                          <Badge variant="secondary">
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Ejecutando...
                          </Badge>
                        )}
                        {testCase.status === 'success' && (
                          <Badge variant="success">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Exitoso
                          </Badge>
                        )}
                        {testCase.status === 'failed' && (
                          <Badge variant="destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Fallido
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {testCases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <p className="text-muted-foreground">No hay casos de prueba disponibles para este proyecto.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Consola</CardTitle>
              <CardDescription>
                Registro de la ejecución de pruebas
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ScrollArea className="h-full">
                <div className="flex flex-col space-y-2">
                  {consoleOutput.map((log, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {log}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>
                Resumen de la ejecución
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl">{executionStats.total}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ejecutados</p>
                  <p className="text-2xl">{executionStats.executed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Exitosos</p>
                  <p className="text-2xl">{executionStats.passed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fallidos</p>
                  <p className="text-2xl">{executionStats.failed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Pendientes</p>
                  <p className="text-2xl">{executionStats.pending}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 flex items-center gap-2"
                onClick={downloadResults}
              >
                <Download className="h-4 w-4" />
                Descargar Resultados
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExecuteTests;
