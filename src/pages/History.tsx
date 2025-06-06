import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useProject } from '../contexts/ProjectContext';
import ProjectHeader from '../components/ProjectHeader';

const History = () => {
  const { activeProject } = useProject();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!activeProject) {
      toast.warning('Selecciona un proyecto para ver su historial');
      navigate('/project-management');
    }
  }, [activeProject, navigate]);

  const [filter, setFilter] = useState({
    searchTerm: '',
    interactionType: 'all',
    startDate: '',
    endDate: ''
  });

  const [selectedInteraction, setSelectedInteraction] = useState<null | {
    id: string;
    projectId: string;
    date: string;
    type: string;
    prompt: string;
    response: string;
  }>(null);

  // Mock data for the history
  const mockHistoryData = [
    {
      id: 'INT001',
      projectId: 'PRJ001',
      date: '2023-05-14T10:30:00',
      type: 'Generación',
      prompt: 'Generar casos de prueba para autenticación de usuario',
      response: 'Se generaron 5 casos de prueba para el módulo de autenticación',
    },
    {
      id: 'INT002',
      projectId: 'PRJ002',
      date: '2023-05-13T15:45:00',
      type: 'Ejecución',
      prompt: 'Ejecutar casos de prueba del módulo de pagos',
      response: '3 casos exitosos, 1 fallido: Error en validación de tarjeta',
    },
    {
      id: 'INT003',
      projectId: 'PRJ003',
      date: '2023-05-12T09:15:00',
      type: 'Generación',
      prompt: 'Generar casos de prueba para recuperación de contraseña',
      response: 'Se generaron 3 casos de prueba para recuperación de contraseña',
    },
    {
      id: 'INT004',
      projectId: 'PRJ001',
      date: '2023-05-10T14:20:00',
      type: 'Ejecución',
      prompt: 'Ejecutar casos de prueba del módulo de registro',
      response: 'Todos los casos (5) fueron exitosos',
    },
    {
      id: 'INT005',
      projectId: 'PRJ001',
      date: '2023-05-08T11:45:00',
      type: 'Generación',
      prompt: 'Generar casos de prueba para cierre de sesión',
      response: 'Se generaron 2 casos de prueba para cierre de sesión',
    },
  ];

  // First filter by project, then apply other filters
  const projectHistory = activeProject 
    ? mockHistoryData.filter(item => item.projectId === activeProject.id)
    : [];

  // Filter the history data based on the filters
  const filteredHistory = projectHistory.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                         item.response.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    const matchesType = filter.interactionType === 'all' || item.type === filter.interactionType;
    
    const itemDate = new Date(item.date);
    const matchesStartDate = !filter.startDate || new Date(filter.startDate) <= itemDate;
    const matchesEndDate = !filter.endDate || new Date(filter.endDate) >= itemDate;
    
    return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
  });

  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to handle the export action with validation
  const handleExport = (format: 'pdf' | 'excel') => {
    // Validate that there is data to export
    if (filteredHistory.length === 0) {
      toast.error("No hay datos disponibles para exportar. Aplica filtros diferentes o verifica que existan interacciones en este proyecto.", {
        className: '!bg-red-50 !border-red-200 !text-red-600',
      });
      return;
    }

    toast.success(`Historial exportado en formato ${format.toUpperCase()}`);
  };

  if (!activeProject) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Historial de Interacciones</h1>
        <p className="text-muted-foreground">Consulta el historial detallado de interacciones con el agente inteligente</p>
      </div>

      <ProjectHeader />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Buscar..."
                value={filter.searchTerm}
                onChange={(e) => setFilter({...filter, searchTerm: e.target.value})}
                className="w-full"
              />
            </div>
            <div>
              <Select value={filter.interactionType} onValueChange={(value) => setFilter({...filter, interactionType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de interacción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Generación">Generación</SelectItem>
                  <SelectItem value="Ejecución">Ejecución</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                value={filter.startDate}
                onChange={(e) => setFilter({...filter, startDate: e.target.value})}
                className="w-full"
                placeholder="Fecha inicio"
              />
            </div>
            <div>
              <Input
                type="date"
                value={filter.endDate}
                onChange={(e) => setFilter({...filter, endDate: e.target.value})}
                className="w-full"
                placeholder="Fecha fin"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Interacciones en {activeProject.name}</CardTitle>
            <CardDescription>
              {filteredHistory.length} interacciones encontradas
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleExport('pdf')} 
              disabled={filteredHistory.length === 0}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('excel')} 
              disabled={filteredHistory.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prompt</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="truncate max-w-xs">{item.prompt}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedInteraction(item)}>
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Detalle de Interacción #{item.id}</DialogTitle>
                          <DialogDescription>
                            {formatDate(item.date)} - {item.type} - Proyecto: {activeProject.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <h4 className="text-sm font-medium">Prompt</h4>
                            <p className="text-sm text-muted-foreground mt-1">{item.prompt}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Respuesta</h4>
                            <p className="text-sm text-muted-foreground mt-1">{item.response}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No se encontraron interacciones para este proyecto con los filtros aplicados.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
