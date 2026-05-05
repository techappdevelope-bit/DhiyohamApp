export const COLORS = {
  // Primary Gradient Colors
  PRIMARY: '#6C63FF',
  PRIMARY_DARK: '#5848E8',
  PRIMARY_LIGHT: '#8B7FFF',
  
  // Secondary Colors
  SECONDARY: '#FF6B9D',
  SECONDARY_DARK: '#E8548A',
  SECONDARY_LIGHT: '#FF85AE',
  
  // Accent Colors
  ACCENT: '#4ECDC4',
  ACCENT_DARK: '#3EBAB1',
  ACCENT_LIGHT: '#6FDDD5',
  
  // Success, Warning, Error
  SUCCESS: '#00D9A5',
  SUCCESS_DARK: '#00C092',
  WARNING: '#FFB800',
  WARNING_DARK: '#E5A600',
  ERROR: '#FF5252',
  ERROR_DARK: '#E64545',
  INFO: '#00B8D4',
  
  // Neutral Light Mode
  WHITE: '#FFFFFF',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
  BLACK: '#000000',
  
  // Dark Mode
  DARK_BG: '#0F0F1E',
  DARK_SURFACE: '#1A1A2E',
  DARK_CARD: '#16213E',
  
  // Gradient Presets
  GRADIENT_PRIMARY: ['#667eea', '#764ba2'],
  GRADIENT_SECONDARY: ['#f093fb', '#f5576c'],
  GRADIENT_SUCCESS: ['#00D9A5', '#43E97B'],
  GRADIENT_WARNING: ['#FFB800', '#FFA726'],
  GRADIENT_PINK: ['#FF6B9D', '#FF8FAB'],
  GRADIENT_PURPLE: ['#6C63FF', '#9D8BFF'],
  GRADIENT_BLUE: ['#4FACFE', '#00F2FE'],
  GRADIENT_ORANGE: ['#FA709A', '#FEE140'],
  GRADIENT_GREEN: ['#43E97B', '#38F9D7'],
  
  // Kid Theme Colors (10 beautiful colors)
  KID_COLORS: [
    '#6C63FF', // Purple
    '#FF6B9D', // Pink
    '#4ECDC4', // Cyan
    '#FFD93D', // Yellow
    '#95E1D3', // Mint
    '#F38181', // Coral
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#9C27B0', // Violet
    '#00BCD4', // Blue
  ],
} as const;

export type ColorName = keyof typeof COLORS;
