
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GenerateTests from "./pages/GenerateTests";
import ExecuteTests from "./pages/ExecuteTests";
import History from "./pages/History";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/generate-tests" element={<GenerateTests />} />
              <Route path="/execute-tests" element={<ExecuteTests />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
