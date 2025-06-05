
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { 
  FileText, 
  Server, 
  FolderOpen, 
  Play, 
  History as HistoryIcon, 
  MessageSquare, 
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const AppSidebar = () => {
  const location = useLocation();
  const { activeProject } = useProject();
  const { state } = useSidebar();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isProjectDashboard = location.pathname.includes('/project-dashboard');

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader>
        <div className="px-2 py-3">
          <h1 className="text-xl font-bold text-center">TestAI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive('/project-management')}
                  tooltip="Proyectos"
                  asChild
                >
                  <Link to="/project-management">
                    <FolderOpen className="h-4 w-4" />
                    <span>Proyectos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {activeProject && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isProjectDashboard}
                    tooltip="Dashboard"
                    asChild
                  >
                    <Link to={`/project-dashboard/${activeProject.id}`}>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive('/api-management')}
                  tooltip="APIs"
                  asChild
                >
                  <Link to="/api-management">
                    <Server className="h-4 w-4" />
                    <span>APIs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive('/test-case-management')}
                  tooltip="Casos de Prueba"
                  asChild
                >
                  <Link to="/test-case-management">
                    <MessageSquare className="h-4 w-4" />
                    <span>Casos de Prueba</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive('/execute-tests')}
                  tooltip="Ejecutar Tests"
                  asChild
                >
                  <Link to="/execute-tests">
                    <Play className="h-4 w-4" />
                    <span>Ejecutar Tests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive('/history')}
                  tooltip="Historial"
                  asChild
                >
                  <Link to="/history">
                    <HistoryIcon className="h-4 w-4" />
                    <span>Historial</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {activeProject && (
        <SidebarFooter>
          <div className={cn(
            "p-3 border-t border-sidebar-border",
            state === "collapsed" ? "px-2" : "px-3"
          )}>
            {state === "collapsed" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-medium">{activeProject.name}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="text-sm">
                <p className="font-medium truncate">Proyecto: {activeProject.name}</p>
              </div>
            )}
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
