/**
 * Theme Manager for FingerMobile Protocol
 * Manages crystalline white (default), black, and system theme settings
 */

export type Theme = 'crystalline-white' | 'black' | 'system';

class ThemeManager {
  private static readonly THEME_KEY = 'fingermobile-theme';
  private static readonly MEDIA_QUERY = '(prefers-color-scheme: dark)';

  /**
   * Initialize theme based on user preference or system setting
   */
  public static initialize(): void {
    const savedTheme = this.getSavedTheme();
    const systemPrefersDark = window.matchMedia(this.MEDIA_QUERY).matches;

    if (savedTheme === 'system') {
      this.applySystemTheme(systemPrefersDark);
    } else if (savedTheme === 'black') {
      this.setBlackTheme();
    } else {
      // Default to crystalline white regardless of system preference
      this.setCrystallineWhiteTheme();
    }

    // Listen for system theme changes when in system mode
    window.matchMedia(this.MEDIA_QUERY).addEventListener('change', (e) => {
      if (this.getCurrentTheme() === 'system') {
        this.applySystemTheme(e.matches);
      }
    });
  }

  /**
   * Get the currently saved theme
   */
  public static getCurrentTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    // If no theme is saved, default to crystalline-white
    return (savedTheme as Theme) || 'crystalline-white';
  }

  /**
   * Save and apply a new theme
   */
  public static setTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);

    switch (theme) {
    case 'crystalline-white':
      this.setCrystallineWhiteTheme();
      break;
    case 'black':
      this.setBlackTheme();
      break;
    case 'system': {
      const systemPrefersDark = window.matchMedia(this.MEDIA_QUERY).matches;
      this.applySystemTheme(systemPrefersDark);
      break;
    }
    }
  }

  /**
   * Apply crystalline white theme (default)
   */
  private static setCrystallineWhiteTheme(): void {
    document.documentElement.classList.remove('dark', 'black-theme');
    document.documentElement.style.colorScheme = 'light';
  }

  /**
   * Apply black theme
   */
  private static setBlackTheme(): void {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('black-theme');
    document.documentElement.style.colorScheme = 'dark';
  }

  /**
   * Apply system theme based on OS preference
   */
  private static applySystemTheme(prefersDark: boolean): void {
    if (prefersDark) {
      document.documentElement.classList.remove('black-theme');
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark', 'black-theme');
      document.documentElement.style.colorScheme = 'light';
    }
  }

  /**
   * Get the saved theme from localStorage
   */
  private static getSavedTheme(): Theme | null {
    try {
      const theme = localStorage.getItem(this.THEME_KEY);
      return theme as Theme || null;
    } catch (e) {
      console.warn('Could not access localStorage for theme settings');
      return null;
    }
  }

  /**
   * Check if dark mode is currently active
   */
  public static isDarkMode(): boolean {
    const currentTheme = this.getCurrentTheme();
    const systemPrefersDark = window.matchMedia(this.MEDIA_QUERY).matches;

    switch (currentTheme) {
    case 'black':
      return true;
    case 'system':
      return systemPrefersDark;
    case 'crystalline-white':
    default:
      return false;
    }
  }
}

export default ThemeManager;
