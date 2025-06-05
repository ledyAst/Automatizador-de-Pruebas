
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const [nameError, setNameError] = useState('');

  const validateName = (name: string) => {
    if (mode === 'create' && existingNames.includes(name.trim())) {
      setNameError('Ese nombre ya existe');
      return false;
    }
    if (mode === 'edit' && existingNames.includes(name.trim()) && name.trim() !== project?.name) {
      setNameError('Ese nombre ya existe');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ ...formData, name: newName });
    if (nameError) {
      validateName(newName);
    }
  };

  const handleSubmit = () => {
    if (!validateName(formData.name)) {
      return;
    }
    
    if (!formData.name.trim()) {
      setNameError('El nombre es requerido');
      return;
    }

    onSubmit(formData);
    setFormData({ name: '', description: '' });
    setNameError('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({ name: '', description: '' });
      setNameError('');
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
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre del proyecto"
              value={formData.name}
              onChange={handleNameChange}
              className={nameError ? 'border-red-500' : ''}
            />
            {nameError && (
              <p className="text-sm text-red-500">{nameError}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción del proyecto"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={!!nameError || !formData.name.trim()}
          >
            {mode === 'create' ? 'Crear Proyecto' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
