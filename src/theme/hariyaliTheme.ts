import { createTheme } from '@mui/material/styles';

// Hariyali (Green Paddy) inspired theme for Indian farmers
// Optimized for low-literacy users with bigger buttons, clear icons, modern design
export const hariyaliTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Fresh green like young paddy
      light: '#81C784',
      dark: '#2E7D32',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFA726', // Warm orange for accents
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F1F8E9', // Very light green background
      paper: '#FFFFFF',
    },
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#4CAF50',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#D32F2F',
    },
    info: {
      main: '#42A5F5',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    text: {
      primary: '#1B5E20', // Dark green for high contrast
      secondary: '#558B2F',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans", "Helvetica", "Arial", sans-serif',
    // Large, readable text for low-literacy users
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1B5E20',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2E7D32',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#388E3C',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#388E3C',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#4CAF50',
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#4CAF50',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1.125rem', // Larger body text
      lineHeight: 1.6,
      color: '#1B5E20',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#558B2F',
    },
    button: {
      textTransform: 'none', // Keep natural casing
      fontWeight: 600,
      fontSize: '1.125rem', // Larger button text
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
      color: '#558B2F',
    },
  },
  shape: {
    borderRadius: 16, // Rounded corners for modern look
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '16px 32px', // Bigger buttons
          fontSize: '1.125rem',
          fontWeight: 600,
          minHeight: 56, // Minimum touch target
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
        },
        sizeLarge: {
          padding: '20px 40px',
          fontSize: '1.25rem',
          minHeight: 64,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.35)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.25)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(76, 175, 80, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 12,
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.08)',
          },
        },
        sizeLarge: {
          padding: 16,
          fontSize: '2rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            fontSize: '1.125rem',
            '& input': {
              padding: '16px 20px',
            },
            '& fieldset': {
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderWidth: 2,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '1rem',
          fontWeight: 500,
          height: 36,
        },
        sizeMedium: {
          height: 40,
          fontSize: '1.125rem',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(76, 175, 80, 0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          minHeight: 56,
          '&.Mui-selected': {
            backgroundColor: 'rgba(76, 175, 80, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(76, 175, 80, 0.16)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 48,
          fontSize: '1.5rem',
        },
      },
    },
  },
});