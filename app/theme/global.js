export const COLORS = {
  primary: '#3B82F6', // Soft blue
  secondary: '#10B981', // Teal
  accent: '#8B5CF6', // Purple
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#1F2937',
  border: '#E5E7EB',
  notification: '#EF4444',
  muted: '#6B7280',
  success: '#10B981',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#3B82F6',
};

export const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 6,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export default { COLORS, FONT, SIZES, SHADOWS, SPACING }; 