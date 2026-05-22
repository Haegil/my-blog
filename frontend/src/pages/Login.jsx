import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/authSlice';
import client from '../api/client';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Container 
} from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!username.trim() || !password.trim()) {
      setLocalError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    dispatch(loginStart());
    try {
      const response = await client.post('/auth/login', { username, password });
      dispatch(loginSuccess(response.data.user));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      dispatch(loginFailure(msg));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 10 }}>
      <Card sx={{ border: 'none', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Outfit, sans-serif', color: 'primary.main' }}>
              🌿 MemoStack
            </Typography>
            <Typography variant="body2" color="text.secondary">
              관리자 계정으로 로그인하여 지식을 기록하고 관리하세요.
            </Typography>
          </Box>

          {(localError || error) && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {localError || error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="아이디"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, mt: 1 }}
            >
              {loading ? '로그인 처리 중...' : '로그인'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
