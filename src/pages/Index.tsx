
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Server, MessageSquare, Play, History as HistoryIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Plataforma de Pruebas Automatizadas</h1>
        <p className="text-xl text-muted-foreground">
          Sistema inteligente de generación, gestión y ejecución de casos de prueba
        </p>
      </div>

      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-center">Comienza seleccionando un proyecto</CardTitle>
          <CardDescription className="text-center">
            Los proyectos son la unidad principal del sistema. Todas las funcionalidades están asociadas a un proyecto específico.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button 
            size="lg" 
            className="gap-2" 
            onClick={() => navigate('/project-management')}
          >
            <FolderOpen className="h-5 w-5" />
            Gestionar Proyectos
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" /> Carga y Validación de APIs
            </CardTitle>
            <CardDescription>
              Carga documentación de API en formato Swagger/OpenAPI para el proyecto seleccionado.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/api-management')}>
              Gestionar APIs
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Generación de Casos de Prueba
            </CardTitle>
            <CardDescription>
              Genera casos de prueba automáticamente a través de inteligencia artificial para tu proyecto.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/test-case-management')}>
              Generar y Gestionar Casos
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" /> Ejecución de Pruebas
            </CardTitle>
            <CardDescription>
              Ejecuta los casos de prueba generados y visualiza los resultados en tiempo real.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/execute-tests')}>
              Ejecutar Pruebas
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5" /> Historial
            </CardTitle>
            <CardDescription>
              Consulta el historial de interacciones y ejecuciones para el proyecto seleccionado.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/history')}>
              Ver Historial
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
