import { useThemeStore } from '../store/useThemeStore';
import { COLORS } from '../constants/colors';

export const useThemedColors = () => {
  const { isDark } = useThemeStore();

  if (isDark) {
    return {
      // Backgrounds
      background: COLORS.DARK_BG,
      surface: COLORS.DARK_SURFACE,
      card: COLORS.DARK_CARD,
      
      // Text
      text: COLORS.WHITE,
      textSecondary: COLORS.GRAY_300,
      textLight: COLORS.GRAY_400,
      
      // Primary colors
      primary: COLORS.PRIMARY,
      primaryDark: COLORS.PRIMARY_DARK,
      primaryLight: COLORS.PRIMARY_LIGHT,
      
      secondary: COLORS.SECONDARY,
      accent: COLORS.ACCENT,
      
      // Status colors
      success: COLORS.SUCCESS,
      warning: COLORS.WARNING,
      error: COLORS.ERROR,
      info: COLORS.INFO,
      
      // UI elements
      border: COLORS.GRAY_700,
      divider: COLORS.GRAY_800,
      
      // Shadows
      shadowColor: COLORS.BLACK,
    };
  }

  // Light theme
  return {
    // Backgrounds
    background: COLORS.GRAY_50,
    surface: COLORS.WHITE,
    card: COLORS.WHITE,
    
    // Text
    text: COLORS.GRAY_900,
    textSecondary: COLORS.GRAY_600,
    textLight: COLORS.GRAY_500,
    
    // Primary colors
    primary: COLORS.PRIMARY,
    primaryDark: COLORS.PRIMARY_DARK,
    primaryLight: COLORS.PRIMARY_LIGHT,
    
    secondary: COLORS.SECONDARY,
    accent: COLORS.ACCENT,
    
    // Status colors
    success: COLORS.SUCCESS,
    warning: COLORS.WARNING,
    error: COLORS.ERROR,
    info: COLORS.INFO,
    
    // UI elements
    border: COLORS.GRAY_200,
    divider: COLORS.GRAY_100,
    
    // Shadows
    shadowColor: COLORS.BLACK,
  };
};
