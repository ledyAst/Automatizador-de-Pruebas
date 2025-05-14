
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Form schema for the test generation form
const formSchema = z.object({
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const GenerateTests = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [testCases, setTestCases] = useState<{
    id: string;
    description: string;
    expected: string;
    priority: "Alta" | "Media" | "Baja";
    type: "Funcional" | "Rendimiento" | "Seguridad";
  }[]>([]);
  const [activeTab, setActiveTab] = useState("form");

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  // Function to handle form submission
  const onSubmit = (values: FormValues) => {
    setIsGenerating(true);

    // Simulate API call with a delay
    setTimeout(() => {
      // Generate some mock test cases
      const mockTestCases = [
        {
          id: "TC001",
          description: "Verificar que el usuario puede iniciar sesión con credenciales válidas",
          expected: "El usuario inicia sesión exitosamente y es redirigido al dashboard",
          priority: "Alta" as const,
          type: "Funcional" as const,
        },
        {
          id: "TC002",
          description: "Verificar que el sistema muestra un mensaje de error cuando se ingresan credenciales inválidas",
          expected: "Se muestra un mensaje de error indicando credenciales inválidas",
          priority: "Alta" as const,
          type: "Funcional" as const,
        },
        {
          id: "TC003",
          description: "Verificar que el usuario puede recuperar su contraseña",
          expected: "El usuario recibe un correo con instrucciones para recuperar su contraseña",
          priority: "Media" as const,
          type: "Funcional" as const,
        },
        {
          id: "TC004",
          description: "Verificar que el sistema responde en menos de 2 segundos",
          expected: "El tiempo de respuesta es menor a 2 segundos",
          priority: "Media" as const,
          type: "Rendimiento" as const,
        },
        {
          id: "TC005",
          description: "Verificar que las contraseñas se almacenan de forma segura",
          expected: "Las contraseñas se almacenan encriptadas en la base de datos",
          priority: "Alta" as const,
          type: "Seguridad" as const,
        },
      ];

      setTestCases(mockTestCases);
      setIsGenerating(false);
      setActiveTab("results");
      toast.success("Casos de prueba generados correctamente");
    }, 2000);
  };

  // Function to export test cases as JSON
  const exportTestCases = () => {
    const dataStr = JSON.stringify(testCases, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'test-cases.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Casos de prueba exportados correctamente");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generar Casos de Prueba</h1>
        <p className="text-muted-foreground">Utiliza IA para generar casos de prueba automáticos a partir de descripciones funcionales</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Descripción Funcional</TabsTrigger>
          <TabsTrigger value="results" disabled={testCases.length === 0}>
            Casos de Prueba Generados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Descripción Funcional</CardTitle>
              <CardDescription>
                Ingresa una descripción detallada de la funcionalidad para la cual deseas generar casos de prueba.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ejemplo: El sistema debe permitir a los usuarios iniciar sesión con email y contraseña. Si las credenciales son válidas, se redirige al dashboard. Si no, se muestra un mensaje de error."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe en detalle la funcionalidad, incluyendo reglas de negocio, validaciones, y comportamientos esperados.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? "Generando..." : "Generar Casos de Prueba"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Casos de Prueba Generados</CardTitle>
                <CardDescription>
                  {testCases.length} casos de prueba generados a partir de la descripción funcional.
                </CardDescription>
              </div>
              <Button onClick={exportTestCases} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Resultado Esperado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell>{testCase.id}</TableCell>
                      <TableCell>{testCase.description}</TableCell>
                      <TableCell>{testCase.expected}</TableCell>
                      <TableCell>{testCase.priority}</TableCell>
                      <TableCell>{testCase.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Los casos de prueba se han generado utilizando IA.</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GenerateTests;
