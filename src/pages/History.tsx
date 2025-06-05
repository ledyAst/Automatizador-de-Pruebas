
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { fileText, Calendar as CalendarIcon, Search, Filter, download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Interaction {
  id: string;
  type: string;
  user: string;
  date: Date;
  description: string;
  details: string;
}

const historyData: Interaction[] = [
  {
    id: 'INT-001',
    type: 'Generación',
    user: 'juan.perez@example.com',
    date: new Date(2025, 4, 5, 10, 30),
    description: 'Generación de casos de prueba para módulo de autenticación',
    details: 'Se generaron 5 casos de prueba basados en los requisitos del módulo de autenticación. Los casos cubren inicios de sesión exitosos, fallidos, bloqueo de cuentas, tiempo de respuesta y duración de sesión.'
  },
  {
    id: 'INT-002',
    type: 'Ejecución',
    user: 'juan.perez@example.com',
    date: new Date(2025, 4, 5, 11, 15),
    description: 'Ejecución de casos de prueba para módulo de autenticación',
    details: 'Se ejecutaron 5 casos de prueba para el módulo de autenticación. 4 pruebas exitosas, 1 fallida. La prueba fallida está relacionada con el tiempo de respuesta que excedió el límite de 1 segundo.'
  },
  {
    id: 'INT-003',
    type: 'Generación',
    user: 'maria.rodriguez@example.com',
    date: new Date(2025, 4, 6, 9, 45),
    description: 'Generación de casos de prueba para módulo de gestión de usuarios',
    details: 'Se generaron 8 casos de prueba para el módulo de gestión de usuarios. Los casos cubren creación, edición, eliminación, búsqueda y filtrado de usuarios.'
  },
  {
    id: 'INT-004',
    type: 'Ejecución',
    user: 'maria.rodriguez@example.com',
    date: new Date(2025, 4, 6, 14, 20),
    description: 'Ejecución de casos de prueba para módulo de gestión de usuarios',
    details: 'Se ejecutaron 8 casos de prueba para el módulo de gestión de usuarios. 7 pruebas exitosas, 1 fallida. La prueba fallida está relacionada con la validación de campos en el formulario de creación de usuarios.'
  },
  {
    id: 'INT-005',
    type: 'Generación',
    user: 'carlos.gomez@example.com',
    date: new Date(2025, 4, 7, 11, 0),
    description: 'Generación de casos de prueba para módulo de permisos',
    details: 'Se generaron 6 casos de prueba para el módulo de permisos. Los casos cubren asignación, revocación, herencia y validación de permisos.'
  },
  {
    id: 'INT-006',
    type: 'Ejecución',
    user: 'carlos.gomez@example.com',
    date: new Date(2025, 4, 7, 16, 30),
    description: 'Ejecución de casos de prueba para módulo de permisos',
    details: 'Se ejecutaron 6 casos de prueba para el módulo de permisos. 5 pruebas exitosas, 1 fallida. La prueba fallida está relacionada con la herencia de permisos entre roles.'
  },
  {
    id: 'INT-007',
    type: 'Generación',
    user: 'laura.martinez@example.com',
    date: new Date(2025, 4, 8, 10, 15),
    description: 'Generación de casos de prueba para API REST',
    details: 'Se generaron 10 casos de prueba para validar endpoints de la API REST. Los casos cubren diferentes verbos HTTP, parámetros, cabeceras y códigos de respuesta.'
  },
  {
    id: 'INT-008',
    type: 'Ejecución',
    user: 'laura.martinez@example.com',
    date: new Date(2025, 4, 8, 14, 45),
    description: 'Ejecución de casos de prueba para API REST',
    details: 'Se ejecutaron 10 casos de prueba para la API REST. 8 pruebas exitosas, 2 fallidas. Las pruebas fallidas están relacionadas con la validación de tokens JWT y limitación de tasa.'
  },
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter interactions based on search term, type and date range
  const filteredInteractions = historyData.filter((interaction) => {
    const matchesSearch = 
      interaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || interaction.type === selectedType;
    
    const matchesDateRange = 
      (!fromDate || interaction.date >= fromDate) &&
      (!toDate || interaction.date <= toDate);
    
    return matchesSearch && matchesType && matchesDateRange;
  });

  const handleViewDetails = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setIsDetailsOpen(true);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    toast.success(`Historial exportado en formato ${format.toUpperCase()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Historial de Interacciones</h1>
        <p className="text-muted-foreground mt-2">
          Consulta y exporta el historial de interacciones con el asistente de IA.
        </p>
      </div>
      
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descripción, usuario o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo de Interacción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                <SelectItem value="Generación">Generación</SelectItem>
                <SelectItem value="Ejecución">Ejecución</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[130px] justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>Desde</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[130px] justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "dd/MM/yyyy") : <span>Hasta</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredInteractions.length} interacciones encontradas
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')} className="gap-1">
              <fileText className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} className="gap-1">
              <fileText className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInteractions.length > 0 ? (
                filteredInteractions.map((interaction) => (
                  <TableRow key={interaction.id}>
                    <TableCell className="font-medium">{interaction.id}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        interaction.type === 'Generación' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {interaction.type}
                      </span>
                    </TableCell>
                    <TableCell>{interaction.description}</TableCell>
                    <TableCell>{interaction.user}</TableCell>
                    <TableCell>{format(interaction.date, "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(interaction)}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron interacciones con los filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles de la Interacción</DialogTitle>
            <DialogDescription>
              {selectedInteraction?.id} - {selectedInteraction?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <h4 className="text-sm font-medium mb-1">Descripción</h4>
              <p className="text-sm">{selectedInteraction?.description}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">ID</h4>
                <p className="text-sm">{selectedInteraction?.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Tipo</h4>
                <p className="text-sm">{selectedInteraction?.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Usuario</h4>
                <p className="text-sm">{selectedInteraction?.user}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Fecha</h4>
                <p className="text-sm">
                  {selectedInteraction?.date && format(selectedInteraction.date, "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-1">Detalles</h4>
              <p className="text-sm whitespace-pre-line">{selectedInteraction?.details}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
