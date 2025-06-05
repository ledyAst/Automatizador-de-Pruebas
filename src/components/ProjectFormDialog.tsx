
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { validateProjectName, validateDescription } from '@/utils/errorSimulation';

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  project?: {
    id: string;
    name: string;
    description: string;
  } | null;
  onSubmit: (projectData: { name: string; description: string }) => void;
  existingNames: string[];
}

const ProjectFormDialog = ({ 
  open, 
  onOpenChange, 
  mode, 
  project, 
  onSubmit, 
  existingNames 
}: ProjectFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
  });
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  const validateForm = () => {
    const nameError = validateProjectName(formData.name);
    let duplicateError = null;
    
    // Check for duplicate names
    if (mode === 'create' && existingNames.includes(formData.name.trim())) {
      duplicateError = 'Ese nombre ya existe';
    }
    if (mode === 'edit' && existingNames.includes(formData.name.trim()) && formData.name.trim() !== project?.name) {
      duplicateError = 'Ese nombre ya existe';
    }
    
    const descriptionError = validateDescription(formData.description);
    
    const newErrors = {
      name: duplicateError || nameError || '',
      description: descriptionError || ''
    };
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ ...formData, name: newName });
    
    // Clear error when user starts typing
    if (errors.name) {
      setErrors({ ...errors, name: '' });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setFormData({ ...formData, description: newDescription });
    
    // Clear error when user starts typing
    if (errors.description) {
      setErrors({ ...errors, description: '' });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    setFormData({ name: '', description: '' });
    setErrors({ name: '', description: '' });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({ name: '', description: '' });
      setErrors({ name: '', description: '' });
    }
    onOpenChange(newOpen);
  };

  React.useEffect(() => {
    if (project && mode === 'edit') {
      setFormData({
        name: project.name,
        description: project.description,
      });
    }
  }, [project, mode]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Completa el formulario para crear un nuevo proyecto.'
              : 'Modifica los detalles del proyecto.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nombre del proyecto"
              value={formData.name}
              onChange={handleNameChange}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Descripción del proyecto"
              value={formData.description}
              onChange={handleDescriptionChange}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name.trim() || !formData.description.trim()}
          >
            {mode === 'create' ? 'Crear Proyecto' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
