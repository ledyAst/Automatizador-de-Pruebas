
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, XCircle, FileText, AlertTriangle, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useProject } from '../contexts/ProjectContext';
import ProjectHeader from '../components/ProjectHeader';

// Define the MCP validation criteria
interface MCPRequirements {
  name: boolean;
  description: boolean;
  method: boolean;
  url: boolean;
  headers: boolean;
  body?: boolean;
}

const ApiManagement = () => {
  const { activeProject } = useProject();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!activeProject) {
      toast.warning('Selecciona un proyecto para gestionar APIs');
      navigate('/project-management');
    }
  }, [activeProject, navigate]);

  const [apis, setApis] = useState([
    { id: 'API001', projectId: 'PRJ001', name: 'User Authentication API', version: 'v1.0', endpoints: 12, status: 'valid' },
    { id: 'API002', projectId: 'PRJ002', name: 'Payment Processing API', version: 'v2.1', endpoints: 8, status: 'warning' },
    { id: 'API003', projectId: 'PRJ003', name: 'Product Catalog API', version: 'v1.5', endpoints: 15, status: 'valid' },
  ]);
  
  const [uploadDetails, setUploadDetails] = useState({
    file: null as File | null,
    uploading: false,
    progress: 0,
    validationResults: null as any | null,
  });
  
  const [validationSteps, setValidationSteps] = useState([
    { id: 1, name: 'Estructura del Documento', status: 'pending' },
    { id: 2, name: 'Validación de Esquemas', status: 'pending' },
    { id: 3, name: 'Verificación de Endpoints', status: 'pending' },
    { id: 4, name: 'Validación de Seguridad', status: 'pending' },
    { id: 5, name: 'Validación de Protocolo MCP', status: 'pending' },
  ]);
  
  // Filter APIs by active project
  const filteredApis = activeProject 
    ? apis.filter(api => api.projectId === activeProject.id)
    : [];
  
  // Mock file selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadDetails({
        ...uploadDetails,
        file: e.target.files[0],
        progress: 0,
        validationResults: null,
      });
    }
  };
  
  // MCP validation function
  const validateMCPProtocol = (): { isValid: boolean; errorCode?: string; details?: MCPRequirements } => {
    // For simulation, alternate between success and error
    const simulateRandomOutcome = Math.random() > 0.5;

    if (simulateRandomOutcome) {
      return {
        isValid: true,
        details: {
          name: true,
          description: true,
          method: true,
          url: true,
          headers: true,
          body: true
        }
      };
    } else {
      // Generate a random error code
      const errorCodes = ['MCP001', 'MCP002', 'MCP003', 'MCP004'];
      const errorCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
      
      return {
        isValid: false,
        errorCode,
        details: {
          name: true,
          description: false,
          method: true,
          url: true, 
          headers: Math.random() > 0.5, 
          body: false
        }
      };
    }
  };
  
  // Mock upload and validation process
  const uploadAndValidateFile = () => {
    if (!uploadDetails.file || !activeProject) return;
    
    setUploadDetails({
      ...uploadDetails,
      uploading: true,
      progress: 0,
    });
    
    // Reset validation steps
    setValidationSteps(validationSteps.map(step => ({ ...step, status: 'pending' })));
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadDetails(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, progress: prev.progress + 10 };
      });
    }, 300);
    
    // After "upload" completes, start validation steps
    setTimeout(() => {
      clearInterval(interval);
      
      // First validation step
      setValidationSteps(steps => 
        steps.map(step => step.id === 1 ? { ...step, status: 'processing' } : step)
      );
      
      setTimeout(() => {
        setValidationSteps(steps => 
          steps.map(step => step.id === 1 ? { ...step, status: 'success' } : step)
        );
        
        // Second validation step
        setValidationSteps(steps => 
          steps.map(step => step.id === 2 ? { ...step, status: 'processing' } : step)
        );
        
        setTimeout(() => {
          setValidationSteps(steps => 
            steps.map(step => step.id === 2 ? { ...step, status: 'success' } : step)
          );
          
          // Third validation step
          setValidationSteps(steps => 
            steps.map(step => step.id === 3 ? { ...step, status: 'processing' } : step)
          );
          
          setTimeout(() => {
            setValidationSteps(steps => 
              steps.map(step => step.id === 3 ? { ...step, status: 'warning' } : step)
            );
            
            // Fourth validation step
            setValidationSteps(steps => 
              steps.map(step => step.id === 4 ? { ...step, status: 'processing' } : step)
            );
            
            setTimeout(() => {
              setValidationSteps(steps => 
                steps.map(step => step.id === 4 ? { ...step, status: 'success' } : step)
              );
              
              // Fifth validation step (MCP Protocol)
              setValidationSteps(steps => 
                steps.map(step => step.id === 5 ? { ...step, status: 'processing' } : step)
              );
              
              setTimeout(() => {
                // Validate against MCP protocol
                const mcpValidation = validateMCPProtocol();
                const mcpStatus = mcpValidation.isValid ? 'success' : 'error';
                
                setValidationSteps(steps => 
                  steps.map(step => step.id === 5 ? { ...step, status: mcpStatus } : step)
                );
                
                // Validation complete
                let validationResults;
                let apiStatus;
                
                if (mcpValidation.isValid) {
                  validationResults = {
                    valid: true,
                    warnings: 2,
                    errors: 0,
                    details: [
                      { type: 'warning', message: 'Faltan descripciones en 2 endpoints' },
                      { type: 'info', message: 'Se detectaron 15 endpoints válidos' },
                    ]
                  };
                  apiStatus = 'warning';
                  
                  // Show success toast
                  toast.success('API validada correctamente');
                } else {
                  validationResults = {
                    valid: false,
                    warnings: 1,
                    errors: 1,
                    details: [
                      { type: 'warning', message: 'Faltan descripciones en 2 endpoints' },
                      { type: 'error', message: `Validación MCP fallida: ${mcpValidation.details?.description === false ? 'Falta descripción' : 'Error en formato'}` }
                    ]
                  };
                  apiStatus = 'error';
                  
                  // Show error toast with format "Ocurrió un error [código]: por favor, intente nuevamente."
                  toast.error(`Ocurrió un error [${mcpValidation.errorCode}]: por favor, intente nuevamente.`);
                }
                
                setUploadDetails({
                  ...uploadDetails,
                  uploading: false,
                  progress: 100,
                  validationResults,
                });
                
                if (mcpValidation.isValid) {
                  // Add the new API to the list only if validation passed
                  const newApiId = `API${String(apis.length + 1).padStart(3, '0')}`;
                  const newApi = { 
                    id: newApiId, 
                    projectId: activeProject.id,
                    name: uploadDetails.file.name.replace('.json', '').replace('.yaml', ''), 
                    version: 'v1.0', 
                    endpoints: 15, 
                    status: apiStatus
                  };
                  
                  setApis([...apis, newApi]);
                }
                
              }, 1000);
            }, 1000);
          }, 1500);
        }, 1000);
      }, 1000);
    }, 3000);
  };
  
  // Render status badge based on status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" />
            <span>Válido</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-100 px-2 py-1 rounded-full text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span>Advertencias</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">
            <XCircle className="h-3 w-3" />
            <span>Error</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Render validation step status icon
  const renderStepStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <div className="h-4 w-4 rounded-full border-2 border-t-blue-600 border-blue-300 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full border border-gray-300" />;
    }
  };

  if (!activeProject) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Carga y Validación de APIs</h1>
        <p className="text-muted-foreground">Carga y valida documentación de API en formato Swagger/OpenAPI</p>
      </div>

      <ProjectHeader />

      <div className="flex justify-end mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Cargar API
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cargar Documentación de API</DialogTitle>
              <DialogDescription>
                Selecciona un archivo Swagger/OpenAPI en formato JSON o YAML para el proyecto "{activeProject.name}".
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="api-file">Archivo de Documentación</Label>
                <Input
                  id="api-file"
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">Formatos soportados: JSON, YAML</p>
              </div>
              
              {uploadDetails.file && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Archivo seleccionado:</p>
                  <p className="text-sm text-muted-foreground">{uploadDetails.file.name} ({Math.round(uploadDetails.file.size / 1024)} KB)</p>
                </div>
              )}
              
              {uploadDetails.uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Subiendo archivo...</span>
                    <span>{uploadDetails.progress}%</span>
                  </div>
                  <Progress value={uploadDetails.progress} className="h-2" />
                </div>
              )}
              
              {uploadDetails.progress === 100 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium">Validación en progreso:</p>
                  <div className="space-y-3">
                    {validationSteps.map(step => (
                      <div key={step.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {renderStepStatusIcon(step.status)}
                          <span className="text-sm">{step.name}</span>
                        </div>
                        <span className="text-xs capitalize text-muted-foreground">
                          {step.status === 'pending' ? 'Pendiente' : 
                           step.status === 'processing' ? 'Procesando' :
                           step.status === 'success' ? 'Éxito' :
                           step.status === 'warning' ? 'Advertencia' : 'Error'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {uploadDetails.validationResults && (
                <div className="space-y-2 border-t pt-2">
                  <p className="text-sm font-medium">Resultado de la validación:</p>
                  {uploadDetails.validationResults.details.map((detail: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      {detail.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                      )}
                      <span className="text-sm">{detail.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                onClick={uploadAndValidateFile} 
                disabled={!uploadDetails.file || uploadDetails.uploading}
              >
                {uploadDetails.uploading ? 'Procesando...' : 'Cargar y Validar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>APIs Cargadas</CardTitle>
          <CardDescription>
            APIs disponibles para el proyecto "{activeProject.name}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Endpoints</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.map((api) => (
                <TableRow key={api.id}>
                  <TableCell>{api.id}</TableCell>
                  <TableCell>{api.name}</TableCell>
                  <TableCell>{api.version}</TableCell>
                  <TableCell>{api.endpoints}</TableCell>
                  <TableCell>{renderStatusBadge(api.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredApis.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No hay APIs disponibles para este proyecto.</p>
                    <p className="text-sm">Utiliza el botón "Cargar API" para añadir una nueva.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiManagement;
