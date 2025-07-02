import { createTheme } from '@mui/material/styles';
import { green, teal, lightGreen, darkGreen } from '@mui/material/colors';

// Professional Green Color Palette for Admin Interface
const greenPalette = {
  // Primary Green Shades
  primary: {
    50: '#e8f5e8',
    100: '#c8e6c8',
    200: '#a5d6a5',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Main green
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  // Secondary Teal for accents
  secondary: {
    50: '#e0f2f1',
    100: '#b2dfdb',
    200: '#80cbc4',
    300: '#4db6ac',
    400: '#26a69a',
    500: '#009688',
    600: '#00897b',
    700: '#00796b',
    800: '#00695c',
    900: '#004d40',
    main: '#009688',
    light: '#4db6ac',
    dark: '#00796b',
    contrastText: '#ffffff',
  },
  // Success variations
  success: {
    50: '#f1f8e9',
    100: '#dcedc8',
    200: '#c5e1a5',
    300: '#aed581',
    400: '#9ccc65',
    500: '#8bc34a',
    600: '#7cb342',
    700: '#689f38',
    800: '#558b2f',
    900: '#33691e',
    main: '#8bc34a',
    light: '#aed581',
    dark: '#689f38',
    contrastText: '#ffffff',
  },
  // Error colors (keeping standard red for clarity)
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  // Warning colors (amber/orange)
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
    main: '#ffc107',
    light: '#ffd54f',
    dark: '#ffa000',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  // Info colors (blue-green)
  info: {
    50: '#e1f5fe',
    100: '#b3e5fc',
    200: '#81d4fa',
    300: '#4fc3f7',
    400: '#29b6f6',
    500: '#03a9f4',
    600: '#039be5',
    700: '#0288d1',
    800: '#0277bd',
    900: '#01579b',
    main: '#03a9f4',
    light: '#4fc3f7',
    dark: '#0288d1',
    contrastText: '#ffffff',
  },
};

// Create the professional green theme
export const greenAdminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: greenPalette.primary,
    secondary: greenPalette.secondary,
    success: greenPalette.success,
    error: greenPalette.error,
    warning: greenPalette.warning,
    info: greenPalette.info,
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: greenPalette.primary.main,
      hover: 'rgba(76, 175, 80, 0.04)',
      selected: 'rgba(76, 175, 80, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: greenPalette.primary.dark,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: greenPalette.primary.dark,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: greenPalette.primary.dark,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: greenPalette.primary.dark,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: greenPalette.primary.dark,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.6,
      color: greenPalette.primary.dark,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
      color: greenPalette.primary.main,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      color: greenPalette.primary.main,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: 'none' as const,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 2.66,
      textTransform: 'uppercase' as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    // Button component overrides
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',
          },
        },
        contained: {
          background: `linear-gradient(45deg, ${greenPalette.primary.main} 30%, ${greenPalette.primary.light} 90%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${greenPalette.primary.dark} 30%, ${greenPalette.primary.main} 90%)`,
          },
        },
        outlined: {
          borderColor: greenPalette.primary.main,
          color: greenPalette.primary.main,
          '&:hover': {
            borderColor: greenPalette.primary.dark,
            backgroundColor: 'rgba(76, 175, 80, 0.04)',
          },
        },
      },
    },
    // Card component overrides
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    // Paper component overrides
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0 1px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    // TextField component overrides
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: greenPalette.primary.light,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: greenPalette.primary.main,
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: greenPalette.primary.main,
          },
        },
      },
    },
    // Chip component overrides
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: greenPalette.primary.main,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: greenPalette.primary.dark,
          },
        },
        colorSecondary: {
          backgroundColor: greenPalette.secondary.main,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: greenPalette.secondary.dark,
          },
        },
      },
    },
    // Table component overrides
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: greenPalette.primary[50],
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: greenPalette.primary.dark,
            borderBottom: `2px solid ${greenPalette.primary.main}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(76, 175, 80, 0.02)',
          },
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.04)',
          },
        },
      },
    },
    // Dialog component overrides
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    // AppBar component overrides
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${greenPalette.primary.main} 0%, ${greenPalette.primary.dark} 100%)`,
          boxShadow: '0 2px 12px rgba(76, 175, 80, 0.2)',
        },
      },
    },
    // Drawer component overrides
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${greenPalette.primary[100]}`,
          backgroundColor: '#fafafa',
        },
      },
    },
    // List component overrides
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(76, 175, 80, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(76, 175, 80, 0.16)',
            },
          },
        },
      },
    },
    // Badge component overrides
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: greenPalette.success.main,
          color: '#ffffff',
        },
      },
    },
    // Switch component overrides
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: greenPalette.primary.main,
            '& + .MuiSwitch-track': {
              backgroundColor: greenPalette.primary.main,
            },
          },
        },
      },
    },
    // Checkbox component overrides
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: greenPalette.primary.main,
          '&.Mui-checked': {
            color: greenPalette.primary.main,
          },
        },
      },
    },
    // Radio component overrides
    MuiRadio: {
      styleOverrides: {
        root: {
          color: greenPalette.primary.main,
          '&.Mui-checked': {
            color: greenPalette.primary.main,
          },
        },
      },
    },
  },
});

// Export additional theme utilities
export const greenThemeColors = greenPalette;

// Helper function to get theme-aware colors
export const getThemeColor = (color: keyof typeof greenPalette, shade: number = 500) => {
  return greenPalette[color][shade as keyof typeof greenPalette[typeof color]] || greenPalette[color].main;
};

// Status colors for different states
export const statusColors = {
  active: greenPalette.success.main,
  inactive: '#9e9e9e',
  pending: greenPalette.warning.main,
  error: greenPalette.error.main,
  info: greenPalette.info.main,
};

export default greenAdminTheme;
