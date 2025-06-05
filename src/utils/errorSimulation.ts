
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

// Validation utilities for forms
export const validateProjectName = (name: string): string | null => {
  if (!name.trim()) {
    return 'El nombre es obligatorio';
  }
  
  // Allow letters, numbers, spaces, and accented characters
  const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
  if (!validPattern.test(name)) {
    return 'Solo se permiten letras, números, espacios y tildes';
  }
  
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description.trim()) {
    return 'La descripción es obligatoria';
  }
  
  return null;
};

export const validateTestCaseField = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} es obligatorio`;
  }
  
  // Allow letters, numbers, spaces, and accented characters for test cases
  const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:()[\]{}"-]+$/;
  if (!validPattern.test(value)) {
    return 'Solo se permiten letras, números, espacios, tildes y signos de puntuación básicos';
  }
  
  return null;
};
