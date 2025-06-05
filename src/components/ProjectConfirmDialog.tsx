
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check, X } from 'lucide-react';

interface ProjectConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  projectName: string;
}

const ProjectConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  projectName
}: ProjectConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de que deseas editar el proyecto?</AlertDialogTitle>
          <AlertDialogDescription>
            Se aplicarán los cambios al proyecto "{projectName}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} className="gap-2">
            <X className="h-4 w-4" />
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="gap-2">
            <Check className="h-4 w-4" />
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProjectConfirmDialog;
