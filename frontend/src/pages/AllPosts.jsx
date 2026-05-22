import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Box, Button, Pagination, Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import client from '../api/client';
import PostCard from '../components/common/PostCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonList from '../components/common/SkeletonList';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tagsCount, setTagsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, tagsRes] = await Promise.all([
          client.get(`/posts?page=${page}&limit=${limit}`),
          client.get('/tags')
        ]);
        
        // Handle both format {posts, totalCount} and array (fallback)
        if (postsRes.data && postsRes.data.posts) {
          setPosts(postsRes.data.posts);
          setTotalCount(postsRes.data.totalCount);
        } else {
          setPosts(postsRes.data);
          setTotalCount(postsRes.data.length);
        }
        
        setTagsCount(tagsRes.data.length);
      } catch (err) {
        console.error('Error fetching all posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / limit);

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

      {/* Stats Card */}
      <Card 
        sx={{ 
          mb: 5, 
          background: 'linear-gradient(135deg, rgba(95, 141, 122, 0.06) 0%, rgba(167, 196, 160, 0.06) 100%)', 
          borderColor: 'primary.main',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '16px'
        }}
      >
        <CardContent sx={{ p: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
          <Box sx={{ maxWidth: { xs: '100%', sm: '60%' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit, sans-serif' }}>
              💡 MemoStack Stats
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              기록하는 습관이 지식을 내재화합니다. 배움과 문제 해결 과정을 실시간으로 보관하세요.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {loading ? '-' : totalCount}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>총 게시글</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {loading ? '-' : tagsCount}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>사용된 태그</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Outfit, sans-serif' }}>
          전체 기록 목록 📝
        </Typography>
        <Typography variant="body2" color="text.secondary">
          작성된 모든 지식 카드의 히스토리입니다.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* List */}
      {loading ? (
        <SkeletonList count={3} />
      ) : posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState 
          title="작성된 글이 없습니다" 
          description="홈으로 돌아가 첫 지식 카드를 남겨보세요!" 
        />
      )}
    </Container>
  );
};

export default AllPosts;
