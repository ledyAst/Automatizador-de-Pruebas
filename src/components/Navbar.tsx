
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Server, FolderOpen, Play, History as HistoryIcon, MessageSquare, LayoutDashboard, Plus } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const { activeProject } = useProject();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "bg-primary text-primary-foreground" : "hover:bg-secondary";
  };

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">TestAI</span>
            </div>
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/project-management" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/project-management')}`}
              >
                <FolderOpen className="h-4 w-4" />
                Proyectos
              </Link>
              
              {activeProject && (
                <Link 
                  to={`/project-dashboard/${activeProject.id}`} 
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2",
                    location.pathname.includes('/project-dashboard') ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              
              <Link 
                to="/api-management" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/api-management')}`}
              >
                <Server className="h-4 w-4" />
                APIs
              </Link>
              <Link 
                to="/generate-tests" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/generate-tests')}`}
              >
                <Plus className="h-4 w-4" />
                Crear test manuales
              </Link>
              <Link 
                to="/test-case-management" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/test-case-management')}`}
              >
                <MessageSquare className="h-4 w-4" />
                Casos de Prueba
              </Link>
              <Link 
                to="/execute-tests" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/execute-tests')}`}
              >
                <Play className="h-4 w-4" />
                Ejecutar Tests
              </Link>
              <Link 
                to="/history" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/history')}`}
              >
                <HistoryIcon className="h-4 w-4" />
                Historial
              </Link>
            </div>
          </div>
          
          {activeProject && (
            <div className="flex items-center">
              <span className="text-sm px-3 py-1 bg-secondary/60 rounded-full">
                Proyecto: {activeProject.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
