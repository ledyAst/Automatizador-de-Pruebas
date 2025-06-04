
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  project?: any;
  onSubmit: (data: { name: string; description: string }) => void;
  existingNames: string[];
}

const ProjectFormDialog = ({ open, onOpenChange, mode, project, onSubmit, existingNames }: ProjectFormDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    if (mode === 'edit' && project) {
      setName(project.name);
      setDescription(project.description);
    } else {
      setName('');
      setDescription('');
    }
    setErrors({});
  }, [mode, project, open]);

  const validateName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'El nombre del proyecto es obligatorio';
    }
    
    // Check for special characters (only letters, numbers, and spaces allowed)
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
      return 'El nombre no debe contener caracteres especiales (solo letras, números y espacios)';
    }
    
    if (existingNames.includes(value.trim())) {
      return 'Ese nombre ya existe';
    }
    
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'La descripción es obligatoria';
    }
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameError = validateName(name);
    const descriptionError = validateDescription(description);
    
    if (nameError || descriptionError) {
      setErrors({
        name: nameError,
        description: descriptionError
      });
      return;
    }
    
    onSubmit({ name: name.trim(), description: description.trim() });
    setErrors({});
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      const error = validateName(value);
      setErrors(prev => ({ ...prev, name: error }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (errors.description) {
      const error = validateDescription(value);
      setErrors(prev => ({ ...prev, description: error }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Completa la información para crear un nuevo proyecto.' 
              : 'Modifica la información del proyecto.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">
              Nombre del Proyecto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-description">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Crear Proyecto' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
