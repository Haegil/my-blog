import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import { logout } from '../../store/authSlice';
import { setSearchQuery } from '../../store/searchSlice';
import client from '../../api/client';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  InputBase, 
  Box, 
  Container
} from '@mui/material';
import { 
  LightMode, 
  DarkMode, 
  Search, 
  Edit, 
  Logout, 
  Login,
  Tag
} from '@mui/icons-material';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isDark } = useSelector((state) => state.theme);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { query } = useSelector((state) => state.search);
  const [searchInput, setSearchInput] = useState(query);
  const [tagCount, setTagCount] = useState(0);

  // Fetch tag count whenever pathname changes (ensuring it's fresh)
  useEffect(() => {
    const fetchTagCount = async () => {
      try {
        const response = await client.get('/tags');
        setTagCount(response.data.length);
      } catch (err) {
        console.error('Error fetching tag count in Navbar:', err);
      }
    };
    fetchTagCount();
  }, [location.pathname]);

  // Sync search input when search query changes globally (e.g. cleared on home page)
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Sync search input if location changes and query is empty
  useEffect(() => {
    if (location.pathname !== '/search') {
      setSearchInput('');
      dispatch(setSearchQuery(''));
    }
  }, [location.pathname, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput));
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    } else {
      dispatch(setSearchQuery(''));
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await client.post('/auth/logout');
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        color: 'text.primary',
        backdropFilter: 'blur(12px)',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <Typography 
            variant="h5" 
            component={Link} 
            to="/" 
            onClick={() => {
              dispatch(setSearchQuery(''));
              setSearchInput('');
            }}
            sx={{ 
              fontWeight: 800, 
              textDecoration: 'none', 
              color: 'primary.main',
              letterSpacing: '-0.5px',
              fontFamily: 'Outfit, Inter, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🌿 MemoStack
          </Typography>

          {/* Search Bar */}
          <Box 
            component="form" 
            onSubmit={handleSearchSubmit} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
              borderRadius: '999px',
              px: 2.5,
              py: 0.75,
              width: { xs: '45%', sm: '380px' },
              border: '1.5px solid transparent',
              transition: 'all 0.2s ease-in-out',
              '&:focus-within': {
                border: '1.5px solid',
                borderColor: 'primary.main',
                backgroundColor: isDark ? '#1F2937' : '#ffffff',
                boxShadow: isDark ? '0 0 0 3px rgba(127, 182, 158, 0.15)' : '0 0 0 3px rgba(95, 141, 122, 0.15)',
              }
            }}
          >
            <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="제목, 본문, 태그 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                color: 'text.primary', 
                fontSize: '0.9rem',
                width: '100%',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Tag List Link (Responsive) */}
            <Button
              component={Link}
              to="/tags"
              variant="text"
              startIcon={<Tag sx={{ fontSize: 16 }} />}
              sx={{ 
                display: { xs: 'none', sm: 'inline-flex' },
                fontWeight: 600,
                color: 'text.secondary',
                mr: 1,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85rem',
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: isDark ? 'rgba(127, 182, 158, 0.08)' : 'rgba(95, 141, 122, 0.08)',
                }
              }}
            >
              {tagCount}개의 태그목록
            </Button>
            <IconButton
              component={Link}
              to="/tags"
              color="inherit"
              title={`${tagCount}개의 태그목록`}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                border: '1px solid',
                borderColor: 'divider',
                p: 1,
                mr: 0.5
              }}
            >
              <Tag fontSize="small" />
            </IconButton>

            {/* Theme Toggle */}
            <IconButton 
              onClick={() => dispatch(toggleTheme())} 
              color="inherit"
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                p: 1,
              }}
            >
              {isDark ? <LightMode sx={{ color: '#FCD34D' }} /> : <DarkMode sx={{ color: '#4B5563' }} />}
            </IconButton>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <>
                <Button 
                  component={Link} 
                  to="/write" 
                  variant="contained" 
                  startIcon={<Edit />}
                  sx={{ 
                    display: { xs: 'none', sm: 'inline-flex' },
                    borderRadius: '999px',
                  }}
                >
                  새 기록
                </Button>
                <IconButton 
                  component={Link} 
                  to="/write" 
                  color="primary" 
                  sx={{ 
                    display: { xs: 'flex', sm: 'none' },
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Edit />
                </IconButton>

                <IconButton 
                  onClick={handleLogout} 
                  color="error" 
                  title="로그아웃"
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Logout />
                </IconButton>
              </>
            ) : (
              <Button 
                component={Link} 
                to="/login" 
                variant="outlined" 
                startIcon={<Login />}
                sx={{ 
                  borderRadius: '999px',
                  borderWidth: '1.5px',
                  '&:hover': {
                    borderWidth: '1.5px',
                  }
                }}
              >
                로그인
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
