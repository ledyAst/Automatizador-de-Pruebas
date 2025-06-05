
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, FileCheck, Edit, Trash, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject } from '../contexts/ProjectContext';
import ProjectHeader from '../components/ProjectHeader';
import { validateTestCaseField } from '@/utils/errorSimulation';

const TestCaseManagement = () => {
  const { activeProject, projects } = useProject();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!activeProject) {
      toast.warning('Selecciona un proyecto para gestionar casos de prueba');
      navigate('/project-management');
    }
  }, [activeProject, navigate]);

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testCases, setTestCases] = useState([
    { 
      id: 'TC001', 
      projectId: 'PRJ001',
      description: 'Verificar que un usuario puede iniciar sesión con credenciales válidas', 
      steps: [
        'Acceder a la página de login', 
        'Ingresar email válido', 
        'Ingresar contraseña válida', 
        'Hacer clic en el botón de login'
      ],
      expected: 'El usuario es redirigido al dashboard',
      priority: 'Alta',
      type: 'Funcional'
    },
    { 
      id: 'TC002', 
      projectId: 'PRJ001',
      description: 'Verificar que el sistema rechaza credenciales inválidas', 
      steps: [
        'Acceder a la página de login', 
        'Ingresar email inválido', 
        'Ingresar contraseña', 
        'Hacer clic en el botón de login'
      ],
      expected: 'Se muestra un mensaje de error',
      priority: 'Alta',
      type: 'Funcional'
    },
    { 
      id: 'TC003', 
      projectId: 'PRJ002',
      description: 'Verificar que el sistema permite recuperar contraseña', 
      steps: [
        'Acceder a la página de login', 
        'Hacer clic en el enlace "Olvidé mi contraseña"', 
        'Ingresar email registrado', 
        'Hacer clic en "Enviar"'
      ],
      expected: 'Se muestra confirmación de envío de email de recuperación',
      priority: 'Media',
      type: 'Funcional'
    },
  ]);

  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  const [editingTestCase, setEditingTestCase] = useState<any>(null);
  const [testCaseToDelete, setTestCaseToDelete] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formErrors, setFormErrors] = useState({
    description: '',
    steps: '',
    expected: '',
    priority: '',
    type: ''
  });

  useEffect(() => {
    if (activeProject) {
      setConversationHistory([
        { 
          role: 'assistant', 
          content: `¡Hola! Estoy listo para ayudarte a generar casos de prueba para el proyecto "${activeProject.name}". ¿Qué tipo de pruebas necesitas?` 
        }
      ]);
    }
  }, [activeProject]);

  const filteredTestCases = activeProject 
    ? testCases.filter(tc => tc.projectId === activeProject.id)
    : [];

  const handleSendPrompt = () => {
    if (!prompt.trim() || !activeProject) return;
    
    setConversationHistory([
      ...conversationHistory,
      { role: 'user', content: prompt }
    ]);
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const assistantResponse = `Basado en tu descripción para el proyecto "${activeProject.name}", he generado 2 nuevos casos de prueba.`;
      
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', content: assistantResponse }
      ]);
      
      const newTestCases = [
        { 
          id: `TC${String(testCases.length + 1).padStart(3, '0')}`,
          projectId: activeProject.id,
          description: 'Verificar que el sistema bloquea cuentas después de múltiples intentos fallidos', 
          steps: [
            'Acceder a la página de login', 
            'Intentar iniciar sesión con credenciales incorrectas 5 veces consecutivas'
          ],
          expected: 'La cuenta queda bloqueada temporalmente',
          priority: 'Media',
          type: 'Seguridad'
        },
        { 
          id: `TC${String(testCases.length + 2).padStart(3, '0')}`,
          projectId: activeProject.id,
          description: 'Verificar que el sistema implementa CAPTCHA después de intentos fallidos', 
          steps: [
            'Acceder a la página de login', 
            'Intentar iniciar sesión con credenciales incorrectas 3 veces consecutivas'
          ],
          expected: 'Se muestra un CAPTCHA en el siguiente intento',
          priority: 'Media',
          type: 'Seguridad'
        }
      ];
      
      setTestCases([...testCases, ...newTestCases]);
      setIsGenerating(false);
      setPrompt('');
      toast.success('Nuevos casos de prueba generados');
    }, 2000);
  };

  const validateEditForm = () => {
    if (!editingTestCase) return false;
    
    const errors = {
      description: validateTestCaseField(editingTestCase.description, 'La descripción') || '',
      steps: editingTestCase.steps.length === 0 || editingTestCase.steps.some((step: string) => !step.trim()) ? 'Los pasos son obligatorios' : '',
      expected: validateTestCaseField(editingTestCase.expected, 'El resultado esperado') || '',
      priority: !editingTestCase.priority ? 'La prioridad es obligatoria' : '',
      type: !editingTestCase.type ? 'El tipo es obligatorio' : ''
    };
    
    setFormErrors(errors);
    return Object.values(errors).every(error => !error);
  };

  const handleEditClick = (testCase: any) => {
    setEditingTestCase({...testCase});
    setFormErrors({
      description: '',
      steps: '',
      expected: '',
      priority: '',
      type: ''
    });
    setShowEditDialog(true);
  };

  const handleShowConfirmDialog = () => {
    if (!validateEditForm()) {
      return;
    }
    setShowEditDialog(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmUpdate = () => {
    if (!editingTestCase) return;
    
    setTestCases(testCases.map(tc => 
      tc.id === editingTestCase.id ? editingTestCase : tc
    ));
    
    setEditingTestCase(null);
    setShowConfirmDialog(false);
    toast.success('Caso de prueba editado correctamente', {
      style: {
        background: '#22c55e',
        color: 'white',
        fontSize: '16px',
        padding: '12px 16px'
      }
    });
  };

  const handleCancelUpdate = () => {
    setShowConfirmDialog(false);
    setEditingTestCase(null);
  };

  const handleDeleteTestCase = () => {
    if (!testCaseToDelete) return;
    
    setTestCases(testCases.filter(tc => tc.id !== testCaseToDelete.id));
    setTestCaseToDelete(null);
    toast.success('Caso de prueba eliminado');
  };

  const getPriorityExplanation = (priority: string) => {
    switch(priority) {
      case 'Alta': return 'Este test es crítico y debe ejecutarse primero.';
      case 'Media': return 'Este test es importante pero no crítico.';
      case 'Baja': return 'Este test puede ejecutarse al final del ciclo.';
      default: return '';
    }
  };

  const getTypeExplanation = (type: string) => {
    switch(type) {
      case 'Funcional': return 'Valida una funcionalidad clave del sistema.';
      case 'Rendimiento': return 'Evalúa la velocidad y eficiencia del sistema.';
      case 'Seguridad': return 'Verifica aspectos de seguridad y protección de datos.';
      case 'UI': return 'Prueba la interfaz de usuario y experiencia del usuario.';
      default: return 'Tipo de prueba específico del proyecto.';
    }
  };

  if (!activeProject) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generación y Gestión de Casos de Prueba</h1>
        <p className="text-muted-foreground">Interpreta instrucciones en lenguaje natural para generar y gestionar casos de prueba</p>
      </div>

      <ProjectHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Asistente IA</CardTitle>
              <CardDescription>
                Utiliza lenguaje natural para generar nuevos casos de prueba para el proyecto "{activeProject.name}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md h-[400px] p-4 overflow-y-auto flex flex-col space-y-4">
                {conversationHistory.map((message, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg max-w-[85%] ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {isGenerating && (
                  <div className="p-3 rounded-lg bg-secondary text-secondary-foreground max-w-[85%] flex items-center space-x-2">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder={`Ejemplo: Genera casos de prueba para ${activeProject.name}`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
                <Button 
                  onClick={handleSendPrompt}
                  disabled={!prompt.trim() || isGenerating}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Casos de Prueba</CardTitle>
                <CardDescription>
                  {filteredTestCases.length} casos de prueba para {activeProject.name}
                </CardDescription>
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
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell>{testCase.id}</TableCell>
                      <TableCell className="truncate max-w-xs">{testCase.description}</TableCell>
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
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleEditClick(testCase)}
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 text-destructive hover:text-destructive"
                                onClick={() => setTestCaseToDelete(testCase)}
                              >
                                <Trash className="h-4 w-4" />
                                Eliminar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará el caso de prueba {testCase.id} del proyecto {activeProject.name}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="p-4 border rounded-md bg-muted/50 mb-4">
                                <p className="font-medium">{testCase.description}</p>
                                <p className="text-sm text-muted-foreground mt-1">Resultado esperado: {testCase.expected}</p>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteTestCase}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <FileCheck className="h-4 w-4" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Caso de Prueba: {testCase.id}</DialogTitle>
                                <DialogDescription>
                                  Detalles completos del caso de prueba en proyecto {activeProject.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <h4 className="text-sm font-medium">Descripción</h4>
                                  <p className="mt-1 text-sm">{testCase.description}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium">Pasos</h4>
                                  <ol className="mt-1 text-sm space-y-1 list-decimal list-inside">
                                    {testCase.steps.map((step, i) => (
                                      <li key={i}>{step}</li>
                                    ))}
                                  </ol>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium">Resultado Esperado</h4>
                                  <p className="mt-1 text-sm">{testCase.expected}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium">Prioridad</h4>
                                    <p className="mt-1 text-sm font-medium">{testCase.priority}</p>
                                    <p className="text-xs text-muted-foreground">{getPriorityExplanation(testCase.priority)}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium">Tipo</h4>
                                    <p className="mt-1 text-sm font-medium">{testCase.type}</p>
                                    <p className="text-xs text-muted-foreground">{getTypeExplanation(testCase.type)}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTestCases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-muted-foreground">No hay casos de prueba disponibles para este proyecto.</p>
                        <p className="text-sm">Utiliza el asistente IA para generar casos de prueba.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Caso de Prueba</DialogTitle>
            <DialogDescription>
              Modifica los detalles del caso de prueba {editingTestCase?.id}
            </DialogDescription>
          </DialogHeader>
          {editingTestCase && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tc-description">
                  Descripción <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="tc-description"
                  value={editingTestCase.description}
                  onChange={(e) => {
                    setEditingTestCase({ ...editingTestCase, description: e.target.value });
                    if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                  }}
                  className={formErrors.description ? 'border-red-500' : ''}
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tc-steps">
                  Pasos <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="tc-steps"
                  value={editingTestCase.steps.join('\n')}
                  onChange={(e) => {
                    setEditingTestCase({ 
                      ...editingTestCase, 
                      steps: e.target.value.split('\n').filter(s => s.trim()) 
                    });
                    if (formErrors.steps) setFormErrors({ ...formErrors, steps: '' });
                  }}
                  rows={4}
                  className={formErrors.steps ? 'border-red-500' : ''}
                />
                {formErrors.steps && (
                  <p className="text-sm text-red-500">{formErrors.steps}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tc-expected">
                  Resultado Esperado <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="tc-expected"
                  value={editingTestCase.expected}
                  onChange={(e) => {
                    setEditingTestCase({ ...editingTestCase, expected: e.target.value });
                    if (formErrors.expected) setFormErrors({ ...formErrors, expected: '' });
                  }}
                  className={formErrors.expected ? 'border-red-500' : ''}
                />
                {formErrors.expected && (
                  <p className="text-sm text-red-500">{formErrors.expected}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tc-priority">
                    Prioridad <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={editingTestCase.priority}
                    onValueChange={(value) => {
                      setEditingTestCase({ ...editingTestCase, priority: value });
                      if (formErrors.priority) setFormErrors({ ...formErrors, priority: '' });
                    }}
                  >
                    <SelectTrigger id="tc-priority" className={formErrors.priority ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.priority && (
                    <p className="text-sm text-red-500">{formErrors.priority}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tc-type">
                    Tipo <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={editingTestCase.type}
                    onValueChange={(value) => {
                      setEditingTestCase({ ...editingTestCase, type: value });
                      if (formErrors.type) setFormErrors({ ...formErrors, type: '' });
                    }}
                  >
                    <SelectTrigger id="tc-type" className={formErrors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Funcional">Funcional</SelectItem>
                      <SelectItem value="Rendimiento">Rendimiento</SelectItem>
                      <SelectItem value="Seguridad">Seguridad</SelectItem>
                      <SelectItem value="UI">UI</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-sm text-red-500">{formErrors.type}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleShowConfirmDialog}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea editar este caso de prueba?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelUpdate} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate} className="gap-2">
              <Check className="h-4 w-4" />
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestCaseManagement;
