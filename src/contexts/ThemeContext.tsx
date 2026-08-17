import React, { createContext, useContext } from 'react';
// Theme Context - Stub
const ThemeContext = createContext<any>({ theme: 'light', toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
