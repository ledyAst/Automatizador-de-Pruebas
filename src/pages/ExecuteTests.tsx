
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Download, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeader from '@/components/ProjectHeader';

interface ExecutionResult {
  status: 'passed' | 'failed' | 'warning';
  executedAt: string;
  duration: number;
}

interface ExecutionResults {
  [testCaseId: string]: ExecutionResult;
}

const ExecuteTests = () => {
  const { activeProject } = useProject();
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState([]);
  const [executionResults, setExecutionResults] = useState<ExecutionResults>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!activeProject) {
      toast.warning('Selecciona un proyecto para ejecutar pruebas');
      navigate('/project-management');
    }
  }, [activeProject, navigate]);

  // Load test cases from localStorage on component mount and project change
  useEffect(() => {
    const loadTestCases = () => {
      const storedTestCases = JSON.parse(localStorage.getItem('testCases') || '[]');
      setTestCases(storedTestCases);
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

  // Filter test cases by active project
  const filteredTestCases = activeProject 
    ? testCases.filter(tc => tc.projectId === activeProject.id)
    : [];

  const executeTest = (testCaseId) => {
    setIsExecuting(true);
    
    // Simulate test execution with random results
    setTimeout(() => {
      const results: ('passed' | 'failed' | 'warning')[] = ['passed', 'failed', 'warning'];
      const randomResult = results[Math.floor(Math.random() * results.length)];
      
      setExecutionResults(prev => ({
        ...prev,
        [testCaseId]: {
          status: randomResult,
          executedAt: new Date().toISOString(),
          duration: Math.floor(Math.random() * 5000) + 1000 // 1-6 seconds
        }
      }));
      
      setIsExecuting(false);
      
      if (randomResult === 'passed') {
        toast.success('Prueba ejecutada correctamente');
      } else if (randomResult === 'failed') {
        toast.error('La prueba falló');
      } else {
        toast.warning('La prueba completó con advertencias');
      }
    }, 2000);
  };

  const executeAllTests = () => {
    if (filteredTestCases.length === 0) return;
    
    setIsExecuting(true);
    
    // Simulate executing all tests
    setTimeout(() => {
      const newResults: ExecutionResults = {};
      filteredTestCases.forEach(testCase => {
        const results: ('passed' | 'failed' | 'warning')[] = ['passed', 'failed', 'warning'];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        newResults[testCase.id] = {
          status: randomResult,
          executedAt: new Date().toISOString(),
          duration: Math.floor(Math.random() * 5000) + 1000
        };
      });
      
      setExecutionResults(newResults);
      setIsExecuting(false);
      
      const passedCount = Object.values(newResults).filter(r => r.status === 'passed').length;
      const totalCount = Object.values(newResults).length;
      
      toast.success(`Ejecución completada: ${passedCount}/${totalCount} pruebas exitosas`);
    }, 3000);
  };

  const downloadResults = () => {
    if (Object.keys(executionResults).length === 0) {
      toast.error('No hay resultados para descargar');
      return;
    }

    setIsDownloading(true);

    // Simulate download process with occasional failures
    setTimeout(() => {
      const shouldFail = Math.random() < 0.3; // 30% chance of failure
      
      if (shouldFail) {
        const errorCode = Math.floor(Math.random() * 9000) + 1000;
        toast.error(`No se pudo completar la acción. Intente nuevamente. Error ${errorCode}.`);
        setIsDownloading(false);
        return;
      }

      // Create mock Excel data
      const csvContent = [
        'ID,Descripción,Estado,Duración (ms),Fecha de Ejecución',
        ...filteredTestCases
          .filter(tc => executionResults[tc.id])
          .map(tc => {
            const result = executionResults[tc.id];
            return `${tc.id},"${tc.description}",${result.status},${result.duration},${new Date(result.executedAt).toLocaleString()}`;
          })
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `resultados_proyecto_${activeProject.name.replace(/\s+/g, '_')}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
      toast.success('Resultados descargados correctamente');
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Exitoso</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Fallido</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Advertencia</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  if (!activeProject) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ejecutar Tests</h1>
        <p className="text-muted-foreground">Ejecuta y gestiona los resultados de los casos de prueba</p>
      </div>

      <ProjectHeader />

      <div className="grid gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tests Disponibles</CardTitle>
              <CardDescription>
                {filteredTestCases.length} casos de prueba disponibles para {activeProject.name}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={executeAllTests}
                disabled={isExecuting || filteredTestCases.length === 0}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isExecuting ? 'Ejecutando...' : 'Ejecutar Todos'}
              </Button>
              <Button 
                onClick={downloadResults}
                disabled={isDownloading || Object.keys(executionResults).length === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? 'Descargando...' : 'Descargar Excel'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestCases.map((testCase) => {
                  const result = executionResults[testCase.id];
                  return (
                    <TableRow key={testCase.id}>
                      <TableCell className="font-mono">{testCase.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{testCase.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          testCase.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                          testCase.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {testCase.priority}
                        </span>
                      </TableCell>
                      <TableCell>{testCase.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result?.status)}
                          {getStatusBadge(result?.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          onClick={() => executeTest(testCase.id)}
                          disabled={isExecuting}
                          className="flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Ejecutar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredTestCases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No hay casos de prueba disponibles para este proyecto.</p>
                      <p className="text-sm">Crea casos de prueba en la sección correspondiente.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {Object.keys(executionResults).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Resultados</CardTitle>
              <CardDescription>
                Estadísticas de la última ejecución
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    {Object.values(executionResults).filter(r => r.status === 'passed').length}
                  </div>
                  <div className="text-sm text-green-600">Exitosos</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-700">
                    {Object.values(executionResults).filter(r => r.status === 'failed').length}
                  </div>
                  <div className="text-sm text-red-600">Fallidos</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-700">
                    {Object.values(executionResults).filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-sm text-yellow-600">Con Advertencias</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExecuteTests;
