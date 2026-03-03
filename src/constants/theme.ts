// ============================================================
// MAASE DESIGN SYSTEM
// Based on official Maase brand guidelines
// ============================================================

export const Colors = {
  // Brand colors (from design guidelines)
  turmeric: '#F4A300',        // Primary — Turmeric 7941
  turmericLight: '#FFF3D4',   // Light tint for backgrounds
  turmericDark: '#C98200',    // Pressed / darker state

  ivory: '#F8F3E8',           // Background — Ivory Palace 0950
  ivoryDark: '#EDE5D2',       // Slightly deeper ivory

  mocha: '#5C3A21',           // Accent — Mocha Brown
  mochaLight: '#8B6347',      // Lighter mocha for secondary text

  // UI neutrals
  surface: '#FFFFFF',
  text: '#2D1B0E',            // Deep warm dark
  textSecondary: '#7A5C44',
  textMuted: '#B09278',
  border: '#E8DDD0',

  // Semantic
  success: '#2E7D32',
  successLight: '#E8F5E9',
  error: '#C62828',
  errorLight: '#FFEBEE',
  warning: '#E65100',
  warningLight: '#FFF3E0',
  info: '#1565C0',
  infoLight: '#E3F2FD',
};

export const Typography = {
  // Font families
  display: 'PlayfairDisplay_700Bold',   // Playfair Display — headings
  bodyRegular: 'Poppins_400Regular',
  bodyMedium: 'Poppins_500Medium',
  bodySemiBold: 'Poppins_600SemiBold',
  bodyBold: 'Poppins_700Bold',

  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  bodyLarge: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,

  // Line heights
  titleLineHeight: 1.2,
  bodyLineHeight: 1.5,
  denseLineHeight: 1.3,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: Colors.mocha,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: Colors.turmeric,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Touch targets (accessibility)
export const TouchTarget = {
  min: 44, // iOS minimum
  minAndroid: 48, // Android minimum
};
