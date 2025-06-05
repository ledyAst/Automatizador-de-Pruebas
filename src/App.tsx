
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExecuteTests from "./pages/ExecuteTests";
import History from "./pages/History";
import AppSidebar from "./components/AppSidebar";
import ProjectManagement from "./pages/ProjectManagement";
import ApiManagement from "./pages/ApiManagement";
import TestCaseManagement from "./pages/TestCaseManagement";
import { ProjectProvider } from "./contexts/ProjectContext";
import ProjectDashboard from "./pages/ProjectDashboard";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" expand={true} closeButton={true} />
      <BrowserRouter>
        <ProjectProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <AppSidebar />
              <SidebarInset>
                <div className="flex items-center p-4 border-b">
                  <SidebarTrigger />
                  <div className="ml-4 text-lg font-medium">TestAI</div>
                </div>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/execute-tests" element={<ExecuteTests />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/project-management" element={<ProjectManagement />} />
                    <Route path="/api-management" element={<ApiManagement />} />
                    <Route path="/test-case-management" element={<TestCaseManagement />} />
                    <Route path="/project-dashboard/:projectId" element={<ProjectDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProjectProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
