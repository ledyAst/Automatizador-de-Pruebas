
import React, { useState } from 'react';
import { Plus, Edit, Trash, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([
    { id: 'PRJ001', name: 'Proyecto de Autenticación', description: 'Pruebas del sistema de autenticación y autorización', createdAt: '2023-05-10', updatedAt: '2023-05-12' },
    { id: 'PRJ002', name: 'Proyecto de Pagos', description: 'Pruebas para el módulo de procesamiento de pagos', createdAt: '2023-05-11', updatedAt: '2023-05-11' },
    { id: 'PRJ003', name: 'Proyecto API REST', description: 'Pruebas de endpoints para la API REST', createdAt: '2023-05-13', updatedAt: '2023-05-14' },
  ]);

  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState<null | { id: string, name: string, description: string }>(null);

  const handleCreateProject = () => {
    const id = `PRJ${String(projects.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().split('T')[0];
    
    setProjects([
      ...projects, 
      { 
        id, 
        name: newProject.name, 
        description: newProject.description, 
        createdAt: now, 
        updatedAt: now 
      }
    ]);
    
    setNewProject({ name: '', description: '' });
    toast.success('Proyecto creado con éxito');
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;
    
    setProjects(projects.map(project => 
      project.id === editingProject.id 
        ? { 
            ...project, 
            name: editingProject.name, 
            description: editingProject.description,
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : project
    ));
    
    setEditingProject(null);
    toast.success('Proyecto actualizado con éxito');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    toast.success('Proyecto eliminado con éxito');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
        <p className="text-muted-foreground">Crea y administra proyectos de pruebas</p>
      </div>

      <div className="flex justify-end mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
              <DialogDescription>
                Completa la información para crear un nuevo proyecto de pruebas.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del Proyecto</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Ej: Pruebas de API de Usuarios"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe el propósito y alcance del proyecto de pruebas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject} disabled={!newProject.name}>Crear Proyecto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos de Pruebas</CardTitle>
          <CardDescription>
            Lista de proyectos de pruebas existentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Última Modificación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell className="truncate max-w-xs">{project.description}</TableCell>
                  <TableCell>{project.createdAt}</TableCell>
                  <TableCell>{project.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => setEditingProject({ 
                              id: project.id, 
                              name: project.name, 
                              description: project.description 
                            })}>
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Proyecto</DialogTitle>
                            <DialogDescription>
                              Actualiza la información del proyecto {project.id}.
                            </DialogDescription>
                          </DialogHeader>
                          {editingProject && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Nombre del Proyecto</Label>
                                <Input
                                  id="edit-name"
                                  value={editingProject.name}
                                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-description">Descripción</Label>
                                <Textarea
                                  id="edit-description"
                                  value={editingProject.description}
                                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={handleUpdateProject}>Guardar Cambios</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 text-destructive hover:text-destructive">
                            <Trash className="h-4 w-4" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente el proyecto "{project.name}" y no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteProject(project.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagement;
