import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import client from '../api/client';
import PostCard from '../components/common/PostCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonList from '../components/common/SkeletonList';

const TagPosts = () => {
  const { name } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTagPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await client.get(`/posts?tag=${encodeURIComponent(name)}`);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts by tag:', err);
        setError('게시글 목록을 불러오는 도중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTagPosts();
  }, [name]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Back Button */}
      <Button 
        component={Link} 
        to="/" 
        startIcon={<ArrowBack />} 
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        홈으로 돌아가기
      </Button>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Outfit, sans-serif' }}>
          #{name} 태그 기록들 🏷️
        </Typography>
        <Typography variant="body2" color="text.secondary">
          이 태그가 지정된 지식과 경험 카드 목록입니다. 총 {loading ? '-' : posts.length}개의 기록이 있습니다.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Content */}
      {loading ? (
        <SkeletonList count={3} />
      ) : error ? (
        <EmptyState 
          title="오류가 발생했습니다" 
          description={error} 
        />
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <EmptyState 
          title="게시글이 없습니다" 
          description={`#${name} 태그를 가진 게시글이 아직 없습니다. 다른 태그를 탐색해보세요.`} 
        />
      )}
    </Container>
  );
};

export default TagPosts;
