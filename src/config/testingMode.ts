// Testing mode configuration
export const isTestingMode = (): boolean => {
  // Check URL parameter first (primary method)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('testing') === 'true') {
    return true;
  }
  
  // Check environment variable as fallback
  if (process.env.REACT_APP_TESTING_MODE === 'true') {
    return true;
  }
  
  // Check localStorage for persistent testing mode
  const storedTestingMode = localStorage.getItem('espn-testing-mode');
  if (storedTestingMode === 'true') {
    return true;
  }
  
  return false;
};

// Helper function to toggle testing mode in localStorage
export const toggleTestingMode = (): boolean => {
  const currentMode = isTestingMode();
  const newMode = !currentMode;
  localStorage.setItem('espn-testing-mode', newMode.toString());
  return newMode;
};

// Helper function to set testing mode
export const setTestingMode = (enabled: boolean): void => {
  localStorage.setItem('espn-testing-mode', enabled.toString());
};
