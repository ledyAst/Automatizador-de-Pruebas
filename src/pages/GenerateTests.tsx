
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Check, X, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeader from '@/components/ProjectHeader';
import { useNavigate } from 'react-router-dom';

// Form schema for manual test case creation
const formSchema = z.object({
  description: z.string().min(1, {
    message: "La descripción es obligatoria.",
  }),
  steps: z.string().min(1, {
    message: "Los pasos son obligatorios.",
  }),
  expected: z.string().min(1, {
    message: "El resultado esperado es obligatorio.",
  }),
  priority: z.string().min(1, {
    message: "La prioridad es obligatoria.",
  }),
  type: z.string().min(1, {
    message: "El tipo es obligatorio.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const GenerateTests = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [testCases, setTestCases] = useState([]);
  const [editingTestCase, setEditingTestCase] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEditConfirmDialog, setShowEditConfirmDialog] = useState(false);
  const [testCaseToDelete, setTestCaseToDelete] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { activeProject } = useProject();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!activeProject) {
      toast.warning('Selecciona un proyecto para crear casos de prueba', {
        className: '!bg-amber-50 !border-amber-200 !text-amber-600',
      });
      navigate('/project-management');
    }
  }, [activeProject, navigate]);

  // Load test cases from localStorage
  useEffect(() => {
    const loadTestCases = () => {
      const storedTestCases = JSON.parse(localStorage.getItem('testCases') || '[]');
      setTestCases(storedTestCases);
    };
    
    loadTestCases();
    
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

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      steps: "",
      expected: "",
      priority: "",
      type: "",
    },
  });

  // Validation function that allows accented characters
  const validateField = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) {
      return `${fieldName} es obligatorio`;
    }
    
    // Allow letters (including accented), numbers, spaces, and basic punctuation
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.\,\;\:\!\?\-\(\)]+$/.test(value)) {
      return `${fieldName} no debe contener caracteres especiales no válidos`;
    }
    
    return undefined;
  };

  // Function to validate all form data
  const validateFormData = (data: FormValues) => {
    const errors: any = {};
    
    errors.description = validateField(data.description, 'La descripción');
    errors.steps = validateField(data.steps, 'Los pasos');
    errors.expected = validateField(data.expected, 'El resultado esperado');
    
    if (!data.priority) {
      errors.priority = 'La prioridad es obligatoria';
    }
    
    if (!data.type) {
      errors.type = 'El tipo es obligatorio';
    }
    
    return errors;
  };

  // Function to validate test case for editing
  const validateTestCase = (testCase: any) => {
    const errors: any = {};
    
    errors.description = validateField(testCase.description, 'La descripción');
    errors.expected = validateField(testCase.expected, 'El resultado esperado');
    
    if (!testCase.steps || testCase.steps.length === 0 || testCase.steps.every((s: string) => !s.trim())) {
      errors.steps = 'Los pasos son obligatorios';
    } else {
      const stepErrors = testCase.steps.map((step: string, index: number) => 
        validateField(step, `El paso ${index + 1}`)
      ).filter(Boolean);
      
      if (stepErrors.length > 0) {
        errors.steps = stepErrors[0];
      }
    }
    
    if (!testCase.priority) {
      errors.priority = 'La prioridad es obligatoria';
    }
    
    if (!testCase.type) {
      errors.type = 'El tipo es obligatorio';
    }
    
    return errors;
  };

  // Function to handle form submission for creating new test cases
  const onSubmit = (values: FormValues) => {
    const errors = validateFormData(values);
    const hasErrors = Object.values(errors).some(error => error);
    
    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setPendingData(values);
    setShowConfirmDialog(true);
  };

  // Function to confirm saving the test case
  const handleConfirmSave = () => {
    if (!pendingData || !activeProject) return;
    
    // Get existing test cases from localStorage
    const existingTestCases = JSON.parse(localStorage.getItem('testCases') || '[]');
    
    // Generate new test case ID
    const newId = `TC${String(existingTestCases.length + 1).padStart(3, '0')}`;
    
    // Create new test case
    const newTestCase = {
      id: newId,
      projectId: activeProject.id,
      description: pendingData.description.trim(),
      steps: pendingData.steps.trim().split('\n').filter(s => s.trim()),
      expected: pendingData.expected.trim(),
      priority: pendingData.priority,
      type: pendingData.type
    };
    
    // Save to localStorage
    const updatedTestCases = [...existingTestCases, newTestCase];
    localStorage.setItem('testCases', JSON.stringify(updatedTestCases));
    setTestCases(updatedTestCases);
    
    // Reset form and close dialog
    form.reset();
    setShowConfirmDialog(false);
    setPendingData(null);
    
    // Show success toast
    toast.success('Caso de prueba creado correctamente', {
      className: '!bg-green-50 !border-green-200 !text-green-600',
    });
  };

  // Function to cancel saving
  const handleCancelSave = () => {
    setShowConfirmDialog(false);
    setPendingData(null);
  };

  // Function to start editing a test case
  const startEditingTestCase = (testCase: any) => {
    setEditingTestCase({...testCase});
    setShowEditDialog(true);
    setValidationErrors({});
  };

  // Function to show edit confirmation dialog
  const handleShowEditConfirmDialog = () => {
    if (!editingTestCase) return;
    
    const errors = validateTestCase(editingTestCase);
    const hasErrors = Object.values(errors).some(error => error);
    
    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setShowEditConfirmDialog(true);
  };

  // Function to confirm editing
  const handleConfirmEdit = () => {
    if (!editingTestCase) return;
    
    const updatedTestCases = testCases.map(tc => 
      tc.id === editingTestCase.id ? editingTestCase : tc
    );
    
    setTestCases(updatedTestCases);
    localStorage.setItem('testCases', JSON.stringify(updatedTestCases));
    
    setEditingTestCase(null);
    setShowEditDialog(false);
    setShowEditConfirmDialog(false);
    setValidationErrors({});
    
    toast.success('Caso de prueba editado correctamente', {
      className: '!bg-green-50 !border-green-200 !text-green-600',
    });
    
    // Navigate to test case management
    navigate('/test-case-management');
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setShowEditConfirmDialog(false);
    setValidationErrors({});
  };

  // Function to delete a test case
  const handleDeleteTestCase = () => {
    if (!testCaseToDelete) return;
    
    const updatedTestCases = testCases.filter(tc => tc.id !== testCaseToDelete.id);
    setTestCases(updatedTestCases);
    localStorage.setItem('testCases', JSON.stringify(updatedTestCases));
    
    setTestCaseToDelete(null);
    setShowDeleteDialog(false);
    toast.success('Caso de prueba eliminado');
  };

  if (!activeProject) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Crear test manuales</h1>
        <p className="text-muted-foreground">Crea y gestiona casos de prueba manualmente para el proyecto seleccionado</p>
      </div>

      <ProjectHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Caso de Prueba</CardTitle>
            <CardDescription>
              Completa los campos para crear un nuevo caso de prueba para el proyecto "{activeProject.name}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Descripción <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe qué debe verificar este caso de prueba"
                          className={validationErrors.description ? 'border-red-500' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe claramente qué funcionalidad o comportamiento debe verificar este caso de prueba.
                      </FormDescription>
                      {validationErrors.description && (
                        <p className="text-sm text-red-500">{validationErrors.description}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="steps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pasos a seguir <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe cada paso en una línea nueva&#10;Ejemplo:&#10;1. Acceder a la página de login&#10;2. Ingresar email válido&#10;3. Hacer clic en enviar"
                          className={`min-h-[120px] ${validationErrors.steps ? 'border-red-500' : ''}`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Lista los pasos que debe seguir el usuario para ejecutar este caso de prueba. Escribe cada paso en una línea nueva.
                      </FormDescription>
                      {validationErrors.steps && (
                        <p className="text-sm text-red-500">{validationErrors.steps}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Resultado Esperado <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe qué debe suceder cuando se ejecuten los pasos correctamente"
                          className={validationErrors.expected ? 'border-red-500' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Especifica claramente cuál debe ser el resultado cuando se ejecuten todos los pasos correctamente.
                      </FormDescription>
                      {validationErrors.expected && (
                        <p className="text-sm text-red-500">{validationErrors.expected}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Prioridad <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={validationErrors.priority ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Seleccionar prioridad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Media">Media</SelectItem>
                            <SelectItem value="Baja">Baja</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Define la importancia de este caso de prueba
                        </FormDescription>
                        {validationErrors.priority && (
                          <p className="text-sm text-red-500">{validationErrors.priority}</p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tipo <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={validationErrors.type ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Funcional">Funcional</SelectItem>
                            <SelectItem value="Rendimiento">Rendimiento</SelectItem>
                            <SelectItem value="Seguridad">Seguridad</SelectItem>
                            <SelectItem value="UI">UI</SelectItem>
                            <SelectItem value="Integración">Integración</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Categoriza este caso de prueba
                        </FormDescription>
                        {validationErrors.type && (
                          <p className="text-sm text-red-500">{validationErrors.type}</p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Limpiar Formulario
                  </Button>
                  <Button type="submit" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Crear Caso de Prueba
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Test Cases List */}
        <Card>
          <CardHeader>
            <CardTitle>Casos de Prueba Existentes</CardTitle>
            <CardDescription>
              {filteredTestCases.length} casos de prueba para {activeProject.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestCases.map((testCase) => (
                  <TableRow key={testCase.id}>
                    <TableCell className="font-mono">{testCase.id}</TableCell>
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
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => startEditingTestCase(testCase)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setTestCaseToDelete(testCase);
                            setShowDeleteDialog(true);
                          }}
                          className="flex items-center gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTestCases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-muted-foreground">No hay casos de prueba disponibles para este proyecto.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea crear este caso de prueba?</AlertDialogTitle>
            <AlertDialogDescription>
              Se creará un nuevo caso de prueba para el proyecto "{activeProject.name}" con la información proporcionada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSave} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave} className="gap-2">
              <Check className="h-4 w-4" />
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                <Label htmlFor="edit-description">
                  Descripción <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingTestCase.description}
                  onChange={(e) => setEditingTestCase({ ...editingTestCase, description: e.target.value })}
                  className={validationErrors.description ? 'border-red-500' : ''}
                />
                {validationErrors.description && (
                  <p className="text-sm text-red-500">{validationErrors.description}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-steps">
                  Pasos <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-steps"
                  value={editingTestCase.steps.join('\n')}
                  onChange={(e) => setEditingTestCase({ 
                    ...editingTestCase, 
                    steps: e.target.value.split('\n').filter(s => s.trim()) 
                  })}
                  rows={4}
                  className={validationErrors.steps ? 'border-red-500' : ''}
                  placeholder="Escribe cada paso en una línea nueva"
                />
                {validationErrors.steps && (
                  <p className="text-sm text-red-500">{validationErrors.steps}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expected">
                  Resultado Esperado <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-expected"
                  value={editingTestCase.expected}
                  onChange={(e) => setEditingTestCase({ ...editingTestCase, expected: e.target.value })}
                  className={validationErrors.expected ? 'border-red-500' : ''}
                />
                {validationErrors.expected && (
                  <p className="text-sm text-red-500">{validationErrors.expected}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">
                    Prioridad <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={editingTestCase.priority}
                    onValueChange={(value) => setEditingTestCase({ ...editingTestCase, priority: value })}
                  >
                    <SelectTrigger id="edit-priority" className={validationErrors.priority ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.priority && (
                    <p className="text-sm text-red-500">{validationErrors.priority}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">
                    Tipo <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={editingTestCase.type}
                    onValueChange={(value) => setEditingTestCase({ ...editingTestCase, type: value })}
                  >
                    <SelectTrigger id="edit-type" className={validationErrors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Funcional">Funcional</SelectItem>
                      <SelectItem value="Rendimiento">Rendimiento</SelectItem>
                      <SelectItem value="Seguridad">Seguridad</SelectItem>
                      <SelectItem value="UI">UI</SelectItem>
                      <SelectItem value="Integración">Integración</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.type && (
                    <p className="text-sm text-red-500">{validationErrors.type}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleShowEditConfirmDialog}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Confirmation Dialog */}
      <AlertDialog open={showEditConfirmDialog} onOpenChange={setShowEditConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea editar este caso de prueba?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelEdit} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEdit} className="gap-2">
              <Check className="h-4 w-4" />
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el caso de prueba {testCaseToDelete?.id} del proyecto {activeProject.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
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
    </div>
  );
};

export default GenerateTests;
