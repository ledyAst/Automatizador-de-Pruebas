
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Play, History } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Plataforma de Pruebas con IA</h1>
        <p className="text-xl text-muted-foreground">Genera, ejecuta y gestiona casos de prueba con inteligencia artificial</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/generate-tests')}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <FileText className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Generar Casos de Prueba</h2>
            <p className="text-muted-foreground mb-4">Crea casos de prueba automáticos a partir de descripciones funcionales</p>
            <Button className="mt-auto w-full" onClick={() => navigate('/generate-tests')}>Comenzar</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/execute-tests')}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Play className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Ejecutar Pruebas</h2>
            <p className="text-muted-foreground mb-4">Ejecuta casos de prueba y visualiza los resultados en tiempo real</p>
            <Button className="mt-auto w-full" onClick={() => navigate('/execute-tests')}>Comenzar</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/history')}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <History className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Historial</h2>
            <p className="text-muted-foreground mb-4">Consulta el historial de interacciones con el asistente de IA</p>
            <Button className="mt-auto w-full" onClick={() => navigate('/history')}>Ver Historial</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
