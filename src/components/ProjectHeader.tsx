
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const ProjectHeader = () => {
  const { activeProject } = useProject();
  const navigate = useNavigate();

  if (!activeProject) {
    return (
      <Alert variant="warning" className="mb-6">
        <FolderOpen className="h-4 w-4" />
        <AlertTitle>No hay proyecto seleccionado</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>Selecciona un proyecto para comenzar a trabajar</span>
          <Button size="sm" onClick={() => navigate('/project-management')}>
            Ir a Proyectos
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-secondary/30 border rounded-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-medium">Proyecto: {activeProject.name}</h2>
            <p className="text-sm text-muted-foreground">{activeProject.description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/project-management')}>
          Cambiar Proyecto
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;
