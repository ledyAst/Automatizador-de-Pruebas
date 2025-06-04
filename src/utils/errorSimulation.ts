
// Utility functions for simulating realistic errors and validations
export const simulateApiValidation = () => {
  // 70% success rate for API loading
  const isSuccess = Math.random() < 0.7;
  const errorCode = Math.floor(Math.random() * 9000) + 1000;
  
  return {
    success: isSuccess,
    errorMessage: isSuccess ? null : `Ocurrió un error [${errorCode}]: por favor, intente nuevamente.`
  };
};

export const simulateDeleteError = () => {
  // 25% chance of delete error
  const hasError = Math.random() < 0.25;
  const errorCode = Math.floor(Math.random() * 9000) + 1000;
  
  return {
    hasError,
    errorMessage: hasError ? `No se pudo completar la acción. Error [${errorCode}]. Intente nuevamente.` : null
  };
};

export const simulateDownloadError = () => {
  // 30% chance of download error
  const hasError = Math.random() < 0.3;
  const errorCode = Math.floor(Math.random() * 9000) + 1000;
  
  return {
    hasError,
    errorMessage: hasError ? `No se pudo completar la acción. Intente nuevamente. Error [${errorCode}].` : null
  };
};
