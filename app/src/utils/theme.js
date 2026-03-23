import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLORS } from './constants';
import DB from './db';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    DB.getTheme().then(t => setIsDark(t === 'dark'));
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await DB.setTheme(next ? 'dark' : 'light');
  };

  const colors = isDark ? {
    ...COLORS,
    bgPrimary: COLORS.dark.bgPrimary,
    bgSecondary: COLORS.dark.bgSecondary,
    bgCard: COLORS.dark.bgCard,
    bgInput: COLORS.dark.bgInput,
    textPrimary: COLORS.dark.textPrimary,
    textSecondary: COLORS.dark.textSecondary,
    textMuted: COLORS.dark.textMuted,
    border: COLORS.dark.border,
  } : {
    ...COLORS,
    bgPrimary: COLORS.light.bgPrimary,
    bgSecondary: COLORS.light.bgSecondary,
    bgCard: COLORS.light.bgCard,
    bgInput: COLORS.light.bgInput,
    textPrimary: COLORS.light.textPrimary,
    textSecondary: COLORS.light.textSecondary,
    textMuted: COLORS.light.textMuted,
    border: COLORS.light.border,
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
