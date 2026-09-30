// ThemeManagementService.ts

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
}

export const defaultTheme: ThemeConfig = {
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#10b981', // green-500
  fontFamily: 'Inter, sans-serif',
  borderRadius: '0.5rem',
};

class ThemeManagementService {
  private static instance: ThemeManagementService;
  private currentTheme: ThemeConfig;

  private constructor() {
    const savedTheme = localStorage.getItem('stercs_global_theme');
    this.currentTheme = savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    // Apply initially if we are in browser
    if (typeof window !== 'undefined') {
      this.applyThemeToDOM(this.currentTheme);
    }
  }

  public static getInstance(): ThemeManagementService {
    if (!ThemeManagementService.instance) {
      ThemeManagementService.instance = new ThemeManagementService();
    }
    return ThemeManagementService.instance;
  }

  public getTheme(): ThemeConfig {
    return this.currentTheme;
  }

  public updateTheme(config: Partial<ThemeConfig>): ThemeConfig {
    this.currentTheme = { ...this.currentTheme, ...config };
    if (typeof window !== 'undefined') {
      localStorage.setItem('stercs_global_theme', JSON.stringify(this.currentTheme));
      this.applyThemeToDOM(this.currentTheme);
    }
    return this.currentTheme;
  }

  public applyThemeToDOM(theme: ThemeConfig) {
    const root = document.documentElement;
    root.style.setProperty('--stercs-primary', theme.primaryColor);
    root.style.setProperty('--stercs-secondary', theme.secondaryColor);
    root.style.setProperty('--stercs-font', theme.fontFamily);
    root.style.setProperty('--stercs-radius', theme.borderRadius);
  }
}

export default ThemeManagementService.getInstance();
