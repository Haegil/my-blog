import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import client from '../api/client';
import PostCard from '../components/common/PostCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonList from '../components/common/SkeletonList';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postsRes = await client.get('/posts');
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Title Header */}
      <Box sx={{ mb: { xs: 3, md: 5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: { xs: '1.6rem', sm: '2.125rem' }, 
              fontWeight: 800, 
              mb: 0.5, 
              fontFamily: 'Outfit, sans-serif' 
            }}
          >
            최신 기록들 📝
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            학습한 내용과 개발 조각들을 보관하는 개인 지식 저장소입니다.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/posts/all"
          variant="outlined"
          sx={{ 
            borderRadius: '999px', 
            px: { xs: 2, sm: 3 }, 
            py: { xs: 0.5, sm: 1 }, 
            fontSize: { xs: '0.75rem', sm: '0.85rem' }, 
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            ml: 2,
          }}
        >
          전체글보기
        </Button>
      </Box>

      {/* Full-width Posts List */}
      <Box>
        {loading ? (
          <SkeletonList count={3} />
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <EmptyState 
            title="작성된 글이 없습니다" 
            description="상단의 '새 기록' 버튼을 눌러 첫 지식 카드를 채워보세요!" 
          />
        )}
      </Box>
    </Container>
  );
};

export default Home;
