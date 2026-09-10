import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'skyz_theme_preference';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

/**
 * Strict initial theme resolution:
 * 1. Read localStorage value.
 * 2. Only accept exact string 'dark' or 'light'.
 * 3. Default strictly to 'light' (DO NOT use prefers-color-scheme).
 */
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark') {
      return 'dark';
    }
    if (saved === 'light') {
      return 'light';
    }
    return 'light';
  } catch {
    return 'light';
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Synchronize DOM root class whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Safe fallback if localStorage is restricted
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme === 'dark' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
