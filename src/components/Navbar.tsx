
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
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
                to="/generate-tests" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/generate-tests')}`}
              >
                Generar Tests
              </Link>
              <Link 
                to="/execute-tests" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/execute-tests')}`}
              >
                Ejecutar Tests
              </Link>
              <Link 
                to="/history" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/history')}`}
              >
                Historial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
