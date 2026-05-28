import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import client from '../api/client';
import PostCard from '../components/common/PostCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonList from '../components/common/SkeletonList';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingTags(true);
        const [postsRes, tagsRes] = await Promise.all([
          client.get('/posts'),
          client.get('/tags')
        ]);
        setPosts(postsRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
        setLoadingTags(false);
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
            fontWeight: 600 
          }}
        >
          전체글보기
        </Button>
      </Box>

      {/* Grid Layout (Posts on Left, Tags on Right) */}
      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid item xs={12} md={8}>
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: '16px',
              borderColor: 'divider',
              borderWidth: '1px',
              borderStyle: 'solid',
              position: { md: 'sticky' },
              top: 96,
              mb: { xs: 2, md: 0 }
            }}
            elevation={0}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2, 
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: { xs: '0.95rem', sm: '1.1rem' }
                }}
              >
                인기 태그 🏷️
              </Typography>
              {loadingTags ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Loading..." size="small" disabled />
                </Box>
              ) : tags.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={`#${tag.name} (${tag.count})`}
                      component={Link}
                      to={`/tags/${encodeURIComponent(tag.name)}`}
                      clickable
                      sx={{
                        borderRadius: '8px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        backgroundColor: 'rgba(95, 141, 122, 0.08)',
                        color: 'primary.main',
                        border: '1.5px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: '#ffffff',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  사용된 태그가 없습니다.
                </Typography>
              )}
              
              <Button
                component={Link}
                to="/tags"
                fullWidth
                variant="text"
                sx={{ 
                  mt: 2, 
                  fontWeight: 600, 
                  fontSize: { xs: '0.75rem', sm: '0.8rem' }, 
                  color: 'text.secondary', 
                  textTransform: 'none' 
                }}
              >
                전체 태그 보기 🏷️
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
