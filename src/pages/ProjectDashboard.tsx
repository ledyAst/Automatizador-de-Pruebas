
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeader from '@/components/ProjectHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, MessageSquare, Play, History as HistoryIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, setActiveProject, activeProject } = useProject();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Find the project with the matching ID
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      setActiveProject(project);
    } else {
      navigate('/project-management');
    }
  }, [projectId, projects, setActiveProject, navigate]);
  
  if (!activeProject) {
    return <div>Cargando...</div>;
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard del Proyecto</h1>
        <p className="text-muted-foreground">Gestiona todos los aspectos de tu proyecto de pruebas</p>
      </div>
      
      <ProjectHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" /> Gestión de APIs
            </CardTitle>
            <CardDescription>
              Carga y valida documentación de API en formato Swagger/OpenAPI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/api-management')} className="w-full">
              Ir a APIs
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Casos de Prueba
            </CardTitle>
            <CardDescription>
              Genera y gestiona casos de prueba usando IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/test-case-management')} className="w-full">
              Ir a Casos de Prueba
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" /> Ejecución de Tests
            </CardTitle>
            <CardDescription>
              Ejecuta casos de prueba y analiza resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/execute-tests')} className="w-full">
              Ir a Ejecución
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5" /> Historial
            </CardTitle>
            <CardDescription>
              Consulta el historial de interacciones y resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/history')} className="w-full">
              Ir a Historial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDashboard;
