import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getMuiTheme } from './styles/theme';
import client from './api/client';
import { authCheckComplete, authCheckStart } from './store/authSlice';
import AppRouter from './router/AppRouter';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.theme);
  const muiTheme = getMuiTheme(isDark);

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      dispatch(authCheckStart());
      try {
        const response = await client.get('/auth/check');
        if (!mounted) return;
        dispatch(authCheckComplete(response.data.authenticated ? response.data.user : null));
      } catch {
        if (mounted) {
          dispatch(authCheckComplete(null));
        }
      }
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  // Sync dark mode class with <html> element for Tailwind CSS v4 support
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDark]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            backgroundColor: 'background.default',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}
        >
          {/* Header Navigation */}
          <Navbar />

          {/* Main Content Area */}
          <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <AppRouter />
          </Box>

          {/* Footer Component */}
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
