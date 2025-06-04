
import React, { useState, useMemo } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { PlusCircle, Edit, Trash2, FolderOpen, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import ProjectFormDialog from '@/components/ProjectFormDialog';
import ProjectConfirmDialog from '@/components/ProjectConfirmDialog';
import { simulateDeleteError } from '@/utils/errorSimulation';

const ProjectManagement = () => {
  const { projects, addProject, updateProject, deleteProject, setActiveProject } = useProject();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [pendingProjectData, setPendingProjectData] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter projects based on search term (by name and date)
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    
    const term = searchTerm.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(term) ||
      project.createdAt.includes(term) ||
      project.updatedAt.includes(term)
    );
  }, [projects, searchTerm]);
  
  const handleCreateProject = (projectData: { name: string; description: string }) => {
    const today = new Date().toISOString().split('T')[0];
    const id = `PRJ${String(projects.length + 1).padStart(3, '0')}`;
    
    const project = {
      id,
      name: projectData.name,
      description: projectData.description,
      createdAt: today,
      updatedAt: today,
    };
    
    addProject(project);
    setOpenCreateDialog(false);
    toast.success('Proyecto creado correctamente');
  };

  const handleEditProject = (projectData: { name: string; description: string }) => {
    setPendingProjectData(projectData);
    setOpenConfirmDialog(true);
    setOpenEditDialog(false);
  };

  const handleConfirmEdit = () => {
    if (!editingProject || !pendingProjectData) return;
    
    const updatedProject = {
      ...editingProject,
      name: pendingProjectData.name,
      description: pendingProjectData.description,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    updateProject(updatedProject);
    setEditingProject(null);
    setPendingProjectData(null);
    setOpenConfirmDialog(false);
    toast.success('Proyecto actualizado correctamente');
  };

  const handleCancelEdit = () => {
    setOpenConfirmDialog(false);
    setPendingProjectData(null);
    setEditingProject(null);
    navigate('/project-management');
  };
  
  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    
    // Simulate delete error
    const { hasError, errorMessage } = simulateDeleteError();
    
    if (hasError) {
      toast.error(errorMessage);
      setProjectToDelete(null);
      return;
    }
    
    deleteProject(projectToDelete.id);
    setProjectToDelete(null);
    toast.success('Proyecto eliminado correctamente');
  };
  
  const handleSelectProject = (project) => {
    setActiveProject(project);
    navigate(`/project-dashboard/${project.id}`);
    toast.success(`Proyecto "${project.name}" seleccionado`);
  };

  const existingProjectNames = projects.map(p => p.name);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
        <p className="text-muted-foreground">Crea, edita y gestiona tus proyectos</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Proyectos</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => setOpenCreateDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </div>
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
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
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

                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => {
                            setEditingProject({ ...project });
                            setOpenEditDialog(true);
                          }}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No se encontraron proyectos que coincidan con la búsqueda.' : 'No hay proyectos disponibles.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProjectFormDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        mode="create"
        onSubmit={handleCreateProject}
        existingNames={existingProjectNames}
      />

      <ProjectFormDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        mode="edit"
        project={editingProject}
        onSubmit={handleEditProject}
        existingNames={existingProjectNames.filter(name => name !== editingProject?.name)}
      />

      <ProjectConfirmDialog
        open={openConfirmDialog}
        onOpenChange={setOpenConfirmDialog}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
        projectName={editingProject?.name || ''}
      />
    </div>
  );
};

export default ProjectManagement;
