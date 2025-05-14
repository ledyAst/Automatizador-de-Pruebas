
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    const saved = localStorage.getItem('activeProject');
    return saved ? JSON.parse(saved) : null;
  });
  const [projects, setProjects] = useState<Project[]>([
    { id: 'PRJ001', name: 'Proyecto de Autenticación', description: 'Pruebas del sistema de autenticación y autorización', createdAt: '2023-05-10', updatedAt: '2023-05-12' },
    { id: 'PRJ002', name: 'Proyecto de Pagos', description: 'Pruebas para el módulo de procesamiento de pagos', createdAt: '2023-05-11', updatedAt: '2023-05-11' },
    { id: 'PRJ003', name: 'Proyecto API REST', description: 'Pruebas de endpoints para la API REST', createdAt: '2023-05-13', updatedAt: '2023-05-14' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Save active project to localStorage whenever it changes
  useEffect(() => {
    if (activeProject) {
      localStorage.setItem('activeProject', JSON.stringify(activeProject));
    } else {
      localStorage.removeItem('activeProject');
    }
  }, [activeProject]);

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
    
    // If the active project was updated, update it as well
    if (activeProject && activeProject.id === updatedProject.id) {
      setActiveProject(updatedProject);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    
    // If the active project was deleted, set active project to null
    if (activeProject && activeProject.id === id) {
      setActiveProject(null);
      navigate('/project-management');
      toast.warning('El proyecto activo ha sido eliminado');
    }
  };

  const value = {
    activeProject,
    setActiveProject,
    projects,
    addProject,
    updateProject,
    deleteProject,
    isLoading,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
