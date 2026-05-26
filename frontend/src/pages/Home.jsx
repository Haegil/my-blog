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
        const response = await client.get('/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching dashboard posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Title Header */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Outfit, sans-serif' }}>
            최신 기록들 📝
          </Typography>
          <Typography variant="body2" color="text.secondary">
            학습한 내용과 개발 조각들을 보관하는 개인 지식 저장소입니다.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/posts/all"
          variant="outlined"
          sx={{ borderRadius: '999px', mt: 1, px: 3, fontWeight: 600 }}
        >
          전체글보기
        </Button>
      </Box>

      {/* Post List Content */}
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
    </Container>
  );
};

export default Home;
