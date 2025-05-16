import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { PlusCircle, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const ProjectManagement = () => {
  const { projects, addProject, updateProject, deleteProject, setActiveProject } = useProject();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });
  const navigate = useNavigate();
  
  const handleAddProject = () => {
    const today = new Date().toISOString().split('T')[0];
    const id = `PRJ${String(projects.length + 1).padStart(3, '0')}`;
    
    const project = {
      id,
      name: newProject.name,
      description: newProject.description,
      createdAt: today,
      updatedAt: today,
    };
    
    addProject(project);
    setNewProject({ name: '', description: '' });
    setOpenDialog(false);
    toast.success('Proyecto creado correctamente');
  };
  
  const handleUpdateProject = () => {
    if (!editingProject) return;
    
    const updatedProject = {
      ...editingProject,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    updateProject(updatedProject);
    setEditingProject(null);
    toast.success('Proyecto actualizado correctamente');
  };
  
  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    
    deleteProject(projectToDelete.id);
    setProjectToDelete(null);
    toast.success('Proyecto eliminado correctamente');
  };
  
  const handleSelectProject = (project) => {
    setActiveProject(project);
    navigate(`/project-dashboard/${project.id}`);
    toast.success(`Proyecto "${project.name}" seleccionado`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
        <p className="text-muted-foreground">Crea, edita y gestiona tus proyectos</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Proyectos</CardTitle>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                <DialogDescription>
                  Completa el formulario para crear un nuevo proyecto.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    placeholder="Nombre del proyecto"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del proyecto"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddProject}>Crear Proyecto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectProject(project)}
                        className="flex items-center gap-1"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Seleccionar
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => setEditingProject({ ...project })}
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle>Editar Proyecto</DialogTitle>
                            <DialogDescription>
                              Modifica los detalles del proyecto.
                            </DialogDescription>
                          </DialogHeader>
                          {editingProject && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                  id="name"
                                  placeholder="Nombre del proyecto"
                                  value={editingProject.name}
                                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                  id="description"
                                  placeholder="Descripción del proyecto"
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
                            className="flex items-center gap-1 text-destructive hover:text-destructive"
                            onClick={() => setProjectToDelete(project)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará el proyecto {project.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="p-4 border rounded-md bg-muted/50 mb-4">
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteProject}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
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
