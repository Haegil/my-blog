import { createTheme } from '@mui/material/styles';

export const getMuiTheme = (isDark) => {
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: isDark ? '#7FB69E' : '#5F8D7A',
      },
      secondary: {
        main: isDark ? '#374151' : '#A7C4A0',
      },
      background: {
        default: isDark ? '#111827' : '#F4F7F4',
        paper: isDark ? '#1F2937' : '#ffffff',
      },
      text: {
        primary: isDark ? '#F3F4F6' : '#1F2937',
        secondary: isDark ? '#9CA3AF' : '#6B7280',
      },
      divider: isDark ? '#374151' : '#D6E2DA',
    },
    typography: {
      fontFamily: [
        'Inter',
        'Outfit',
        'system-ui',
        '-apple-system',
        'sans-serif',
      ].join(','),
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '999px', // MD3 pill buttons
            padding: '10px 24px',
            fontSize: '0.95rem',
            boxShadow: 'none',
            textTransform: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedPrimary: {
            backgroundColor: isDark ? '#7FB69E' : '#5F8D7A',
            color: isDark ? '#111827' : '#ffffff',
            '&:hover': {
              backgroundColor: isDark ? '#93CBB2' : '#4E7867',
            },
          },
          outlinedPrimary: {
            borderColor: isDark ? '#7FB69E' : '#5F8D7A',
            color: isDark ? '#7FB69E' : '#5F8D7A',
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
              borderColor: isDark ? '#93CBB2' : '#4E7867',
              backgroundColor: isDark ? 'rgba(127, 182, 158, 0.08)' : 'rgba(95, 141, 122, 0.08)',
            },
          },
          textPrimary: {
            color: isDark ? '#7FB69E' : '#5F8D7A',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(127, 182, 158, 0.08)' : 'rgba(95, 141, 122, 0.08)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24, // Matches example theme.html rounded styling
            border: `1px solid ${isDark ? '#374151' : '#D6E2DA'}`,
            boxShadow: isDark ? 'none' : '0 8px 24px rgba(0, 0, 0, 0.04)',
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '& fieldset': {
                borderColor: isDark ? '#374151' : '#D6E2DA',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#7FB69E' : '#5F8D7A',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDark ? '#7FB69E' : '#5F8D7A',
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
  });
};
