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

/* ──────────────────────────────────────────────
   재사용 가능한 Navbar 아이콘 버튼 컴포넌트
   - 데스크톱(sm+): hover 시 레이블 슬라이드 + 페이드 애니메이션
   - 모바일(xs):    아이콘만 표시, 애니메이션 없음
   ────────────────────────────────────────────── */
const NavIconBtn = ({ icon, label, onClick, href, iconColor, isDark, sx = {} }) => {
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '8px',
    p: { xs: 0.75, sm: 1 },
    cursor: 'pointer',
    background: 'none',
    color: 'text.secondary',
    overflow: 'hidden',
    transition: 'color 0.2s ease, background-color 0.2s ease',
    // 데스크톱에서만 hover 애니메이션
    '@media (min-width: 600px)': {
      '&:hover': {
        color: iconColor || 'primary.main',
        backgroundColor: isDark ? 'rgba(127, 182, 158, 0.08)' : 'rgba(95, 141, 122, 0.08)',
        '& .nav-label': {
          maxWidth: '130px',
          opacity: 1,
          marginLeft: '5px',
        },
      },
    },
    ...sx,
  };

  const content = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {icon}
      </Box>
      {label && (
        <Box
          className="nav-label"
          sx={{
            display: { xs: 'none', sm: 'block' }, // 모바일: 항상 숨김
            maxWidth: 0,
            opacity: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.82rem',
            letterSpacing: '-0.01em',
            marginLeft: 0,
            transition: 'max-width 0.3s ease, opacity 0.25s ease, margin-left 0.3s ease',
          }}
        >
          {label}
        </Box>
      )}
    </>
  );

  if (href) {
    return (
      <Box component={Link} to={href} sx={baseStyles}>
        {content}
      </Box>
    );
  }

  return (
    <Box component="button" onClick={onClick} sx={baseStyles}>
      {content}
    </Box>
  );
};

/* ──────────────────────────────────────────────
   Navbar
   ────────────────────────────────────────────── */
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
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              🌿
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>MemoStack</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' }, ml: 0.5 }}>Memo</Box>
            </Box>
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
              px: { xs: 1.5, sm: 2.5 },
              py: 0.5,
              flexGrow: 1,
              maxWidth: { xs: '160px', sm: '320px', md: '380px' },
              mx: { xs: 1, sm: 2 },
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
            <Search sx={{ color: 'text.secondary', mr: 0.5, fontSize: { xs: 18, sm: 20 } }} />
            <InputBase
              placeholder="검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                color: 'text.primary',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                width: '100%',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.75 } }}>

            {/* 태그 목록 */}
            <NavIconBtn
              href="/tags"
              icon={<Tag sx={{ fontSize: { xs: 20, sm: 22 } }} />}
              label={`${tagCount}개의 태그목록`}
              isDark={isDark}
            />

            {/* 테마 토글 */}
            <NavIconBtn
              onClick={() => dispatch(toggleTheme())}
              icon={
                isDark
                  ? <LightMode sx={{ color: '#FCD34D', fontSize: { xs: 20, sm: 22 } }} />
                  : <DarkMode sx={{ color: '#4B5563', fontSize: { xs: 20, sm: 22 } }} />
              }
              label={isDark ? '라이트 모드' : '다크 모드'}
              iconColor={isDark ? '#FCD34D' : '#4B5563'}
              isDark={isDark}
            />

            {/* 인증 버튼 */}
            {isAuthenticated ? (
              <>
                {/* 새 글 작성 */}
                <NavIconBtn
                  href="/write"
                  icon={<Edit sx={{ fontSize: { xs: 18, sm: 20 }, color: 'primary.main' }} />}
                  label="새 기록"
                  iconColor="primary.main"
                  isDark={isDark}
                />

                {/* 로그아웃 */}
                <NavIconBtn
                  onClick={handleLogout}
                  icon={<Logout sx={{ fontSize: { xs: 18, sm: 20 }, color: 'error.main' }} />}
                  label="로그아웃"
                  iconColor="error.main"
                  isDark={isDark}
                />
              </>
            ) : (
              /* 로그인 */
              <NavIconBtn
                href="/login"
                icon={<Login sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                label="로그인"
                isDark={isDark}
              />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
