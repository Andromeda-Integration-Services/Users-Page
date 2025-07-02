import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ProfessionalThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useProfessionalTheme = () => {
  const context = useContext(ProfessionalThemeContext);
  if (context === undefined) {
    throw new Error('useProfessionalTheme must be used within a ProfessionalThemeProvider');
  }
  return context;
};

interface ProfessionalThemeProviderProps {
  children: React.ReactNode;
}

export const ProfessionalThemeProvider: React.FC<ProfessionalThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('professional-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    
    // Save to localStorage
    localStorage.setItem('professional-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  return (
    <ProfessionalThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ProfessionalThemeContext.Provider>
  );
};
