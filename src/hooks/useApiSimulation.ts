
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { simulateApiValidation } from '@/utils/errorSimulation';

export const useApiSimulation = (triggerLoad: boolean = false) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState(null);

  const loadApi = async () => {
    setIsLoading(true);
    setHasError(false);
    
    // Simulate API loading time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    const { success, errorMessage } = simulateApiValidation();
    
    if (success) {
      setData({ loaded: true, timestamp: new Date().toISOString() });
      toast.success('API cargada correctamente');
    } else {
      setHasError(true);
      toast.error(errorMessage);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (triggerLoad) {
      loadApi();
    }
  }, [triggerLoad]);

  return {
    isLoading,
    hasError,
    data,
    loadApi,
    retry: loadApi
  };
};
