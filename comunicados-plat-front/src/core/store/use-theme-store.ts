import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';
export type FontScaleMode = 'normal' | 'large';

interface ThemeState {
  theme: ThemeMode;
  highContrast: boolean;
  dyslexicFont: boolean;
  fontScale: FontScaleMode;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
  toggleDyslexicFont: () => void;
  toggleFontScale: () => void;
  resetAccessibility: () => void;
}

function syncDocumentClasses(state: {
  theme: ThemeMode;
  highContrast: boolean;
  dyslexicFont: boolean;
  fontScale: FontScaleMode;
}) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (state.theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }

  root.classList.toggle('a11y-contraste', state.highContrast);
  root.style.fontFamily = state.dyslexicFont
    ? '"Atkinson Hyperlegible", system-ui, sans-serif'
    : '"Manrope", system-ui, -apple-system, sans-serif';
  root.style.fontSize = state.fontScale === 'large' ? '115%' : '100%';
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  highContrast: false,
  dyslexicFont: false,
  fontScale: 'normal',

  toggleTheme: () =>
    set((state) => {
      const next = { ...state, theme: (state.theme === 'light' ? 'dark' : 'light') as ThemeMode };
      syncDocumentClasses(next);
      return { theme: next.theme };
    }),

  toggleHighContrast: () =>
    set((state) => {
      const next = { ...state, highContrast: !state.highContrast };
      syncDocumentClasses(next);
      return { highContrast: next.highContrast };
    }),

  toggleDyslexicFont: () =>
    set((state) => {
      const next = { ...state, dyslexicFont: !state.dyslexicFont };
      syncDocumentClasses(next);
      return { dyslexicFont: next.dyslexicFont };
    }),

  toggleFontScale: () =>
    set((state) => {
      const next = {
        ...state,
        fontScale: (state.fontScale === 'normal' ? 'large' : 'normal') as FontScaleMode,
      };
      syncDocumentClasses(next);
      return { fontScale: next.fontScale };
    }),

  resetAccessibility: () =>
    set(() => {
      const next = {
        theme: 'light' as ThemeMode,
        highContrast: false,
        dyslexicFont: false,
        fontScale: 'normal' as FontScaleMode,
      };
      syncDocumentClasses(next);
      return next;
    }),
}));

