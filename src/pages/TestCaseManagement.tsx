
import React, { useState, useEffect } from 'react';
import { MessageSquare, FileCheck, Edit, Trash, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TestCaseManagement = () => {
  // Projects state
  const [projects, setProjects] = useState([
    { id: 'PRJ001', name: 'Proyecto de Autenticación', description: 'Pruebas del sistema de autenticación y autorización' },
    { id: 'PRJ002', name: 'Proyecto de Pagos', description: 'Pruebas para el módulo de procesamiento de pagos' },
    { id: 'PRJ003', name: 'Proyecto API REST', description: 'Pruebas de endpoints para la API REST' },
  ]);
  
  // Selected project state
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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

  const [conversationHistory, setConversationHistory] = useState([
    { role: 'user', content: 'Generar casos de prueba para autenticación de usuarios' },
    { role: 'assistant', content: 'He generado 3 casos de prueba para el módulo de autenticación de usuarios. ¿Quieres que añada algún caso más específico?' },
  ]);

  const [editingTestCase, setEditingTestCase] = useState<any>(null);
  const [testCaseToDelete, setTestCaseToDelete] = useState<any>(null);

  // Set default project on first load
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects]);

  // Filter test cases by selected project
  const filteredTestCases = selectedProject 
    ? testCases.filter(tc => tc.projectId === selectedProject)
    : testCases;

  const handleSendPrompt = () => {
    if (!prompt.trim() || !selectedProject) return;
    
    // Add to conversation history with project context
    const projectName = projects.find(p => p.id === selectedProject)?.name;
    
    setConversationHistory([
      ...conversationHistory,
      { role: 'user', content: `[Proyecto: ${projectName}] ${prompt}` }
    ]);
    
    setIsGenerating(true);
    
    // Simulate AI response
    setTimeout(() => {
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', content: `Basado en tu descripción para el proyecto "${projectName}", he generado 2 nuevos casos de prueba.` }
      ]);
      
      // Add mock generated test cases
      const newTestCases = [
        { 
          id: `TC${String(testCases.length + 1).padStart(3, '0')}`,
          projectId: selectedProject,
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
          projectId: selectedProject,
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

  const handleUpdateTestCase = () => {
    if (!editingTestCase) return;
    
    setTestCases(testCases.map(tc => 
      tc.id === editingTestCase.id ? editingTestCase : tc
    ));
    
    setEditingTestCase(null);
    toast.success('Caso de prueba actualizado');
  };

  const handleDeleteTestCase = () => {
    if (!testCaseToDelete) return;
    
    setTestCases(testCases.filter(tc => tc.id !== testCaseToDelete.id));
    setTestCaseToDelete(null);
    toast.success('Caso de prueba eliminado');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generación y Gestión de Casos de Prueba</h1>
        <p className="text-muted-foreground">Interpreta instrucciones en lenguaje natural para generar y gestionar casos de prueba</p>
      </div>

      {/* Project Selection */}
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Proyecto Seleccionado</CardTitle>
            <CardDescription>
              Selecciona el proyecto para el que quieres gestionar los casos de prueba
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedProject || ''} 
              onValueChange={setSelectedProject}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Seleccionar proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProject && (
              <p className="mt-2 text-sm text-muted-foreground">
                {projects.find(p => p.id === selectedProject)?.description}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Asistente IA</CardTitle>
              <CardDescription>
                Utiliza lenguaje natural para generar nuevos casos de prueba
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
                  placeholder="Ejemplo: Genera casos de prueba para validación de correo electrónico" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating || !selectedProject}
                />
                <Button 
                  onClick={handleSendPrompt}
                  disabled={!prompt.trim() || isGenerating || !selectedProject}
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
                  {filteredTestCases.length} casos de prueba {selectedProject ? `para ${projects.find(p => p.id === selectedProject)?.name}` : ''}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {selectedProject ? (
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => setEditingTestCase({...testCase})}
                                >
                                  <Edit className="h-4 w-4" />
                                  Editar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-xl">
                                <DialogHeader>
                                  <DialogTitle>Editar Caso de Prueba</DialogTitle>
                                  <DialogDescription>
                                    Modifica los detalles del caso de prueba {testCase.id}
                                  </DialogDescription>
                                </DialogHeader>
                                {editingTestCase && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="tc-description">Descripción</Label>
                                      <Textarea
                                        id="tc-description"
                                        value={editingTestCase.description}
                                        onChange={(e) => setEditingTestCase({ ...editingTestCase, description: e.target.value })}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="tc-steps">Pasos</Label>
                                      <Textarea
                                        id="tc-steps"
                                        value={editingTestCase.steps.join('\n')}
                                        onChange={(e) => setEditingTestCase({ 
                                          ...editingTestCase, 
                                          steps: e.target.value.split('\n').filter(s => s.trim()) 
                                        })}
                                        rows={4}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="tc-expected">Resultado Esperado</Label>
                                      <Textarea
                                        id="tc-expected"
                                        value={editingTestCase.expected}
                                        onChange={(e) => setEditingTestCase({ ...editingTestCase, expected: e.target.value })}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="tc-priority">Prioridad</Label>
                                        <Select 
                                          value={editingTestCase.priority}
                                          onValueChange={(value) => setEditingTestCase({ ...editingTestCase, priority: value })}
                                        >
                                          <SelectTrigger id="tc-priority">
                                            <SelectValue placeholder="Seleccionar prioridad" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Alta">Alta</SelectItem>
                                            <SelectItem value="Media">Media</SelectItem>
                                            <SelectItem value="Baja">Baja</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="tc-type">Tipo</Label>
                                        <Select 
                                          value={editingTestCase.type}
                                          onValueChange={(value) => setEditingTestCase({ ...editingTestCase, type: value })}
                                        >
                                          <SelectTrigger id="tc-type">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Funcional">Funcional</SelectItem>
                                            <SelectItem value="Rendimiento">Rendimiento</SelectItem>
                                            <SelectItem value="Seguridad">Seguridad</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button onClick={handleUpdateTestCase}>Guardar Cambios</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

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
                                    Esta acción eliminará el caso de prueba {testCase.id}.
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
                                    Detalles completos del caso de prueba
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
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium">Prioridad</h4>
                                      <p className="mt-1 text-sm">{testCase.priority}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Tipo</h4>
                                      <p className="mt-1 text-sm">{testCase.type}</p>
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Selecciona un proyecto para ver sus casos de prueba</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestCaseManagement;
