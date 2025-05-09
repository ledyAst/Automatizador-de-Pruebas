
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { download, fileText } from "lucide-react";

const GenerateTests = () => {
  const [requirements, setRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<Array<{
    id: string;
    description: string;
    expected: string;
    priority: 'Alta' | 'Media' | 'Baja';
    type: 'Funcional' | 'Rendimiento' | 'Seguridad';
  }>>([]);
  
  const handleGenerateTests = () => {
    if (!requirements.trim()) {
      toast.error('Por favor, ingresa los requisitos funcionales');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Mock data generation
      const mockTests = [
        {
          id: 'CT-001',
          description: 'Verificar que el sistema permita el inicio de sesión con credenciales válidas',
          expected: 'El usuario debe ser redirigido al dashboard después de un inicio de sesión exitoso',
          priority: 'Alta',
          type: 'Funcional'
        },
        {
          id: 'CT-002',
          description: 'Comprobar que se muestre un mensaje de error cuando se ingresen credenciales inválidas',
          expected: 'Debe mostrarse un mensaje de error indicando que las credenciales son incorrectas',
          priority: 'Alta',
          type: 'Funcional'
        },
        {
          id: 'CT-003',
          description: 'Verificar que el sistema bloquee la cuenta después de 3 intentos fallidos de inicio de sesión',
          expected: 'La cuenta debe ser bloqueada temporalmente y mostrar un mensaje adecuado',
          priority: 'Media',
          type: 'Seguridad'
        },
        {
          id: 'CT-004',
          description: 'Comprobar que el tiempo de respuesta del inicio de sesión no exceda 1 segundo',
          expected: 'El tiempo de respuesta debe ser menor a 1 segundo en condiciones normales',
          priority: 'Media',
          type: 'Rendimiento'
        },
        {
          id: 'CT-005',
          description: 'Verificar que el sistema mantenga la sesión activa durante el periodo configurado',
          expected: 'La sesión debe permanecer activa durante el tiempo configurado sin cerrar automáticamente',
          priority: 'Baja',
          type: 'Funcional'
        },
      ];
      
      setGeneratedTests(mockTests);
      setIsGenerating(false);
      toast.success('Casos de prueba generados con éxito');
    }, 2000);
  };
  
  const handleExport = () => {
    if (generatedTests.length > 0) {
      toast.success('Casos de prueba exportados correctamente');
    } else {
      toast.error('No hay casos de prueba para exportar');
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Generación de Casos de Prueba</h1>
        <p className="text-muted-foreground mt-2">
          Ingresa descripción funcional o requerimientos para generar casos de prueba automáticamente.
        </p>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Requisitos Funcionales</h2>
        <Textarea 
          placeholder="Describe los requisitos funcionales o pega la especificación del módulo aquí..."
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="min-h-[200px] mb-4"
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="funcional">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Tipo de Prueba" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funcional">Funcional</SelectItem>
              <SelectItem value="rendimiento">Rendimiento</SelectItem>
              <SelectItem value="seguridad">Seguridad</SelectItem>
              <SelectItem value="integracion">Integración</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleGenerateTests}
            disabled={isGenerating} 
            className="w-full sm:w-auto sm:ml-auto"
          >
            {isGenerating ? 'Generando...' : 'Generar Casos de Prueba'}
          </Button>
        </div>
      </Card>
      
      {generatedTests.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Casos de Prueba Generados</h2>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <fileText className="h-4 w-4" />
              Exportar
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Resultado Esperado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.id}</TableCell>
                    <TableCell>{test.description}</TableCell>
                    <TableCell>{test.expected}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        test.priority === 'Alta' ? 'bg-red-100 text-red-800' : 
                        test.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {test.priority}
                      </span>
                    </TableCell>
                    <TableCell>{test.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GenerateTests;
