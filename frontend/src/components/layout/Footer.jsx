import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        px: 2, 
        mt: 'auto', 
        borderTop: '1px solid', 
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        color: 'text.secondary',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
          🌿 <strong>MemoStack</strong> — 개인 지식과 개발 기록의 저장소
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, fontFamily: 'Inter, sans-serif' }}>
          &copy; {new Date().getFullYear()} MemoStack. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
