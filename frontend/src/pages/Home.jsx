import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Typography, Card, CardContent, Button } from '@mui/material';
import client from '../api/client';
import PostCard from '../components/common/PostCard';
import TagBadge from '../components/common/TagBadge';
import EmptyState from '../components/common/EmptyState';
import SkeletonList from '../components/common/SkeletonList';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {/* Main Column */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

        {/* Sidebar Column */}
        <Grid item xs={12} md={4}>
          {/* Tags Cloud Card */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontFamily: 'Outfit, sans-serif' }}>
                태그 목록 🏷️
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <SkeletonList count={1} />
                </Box>
              ) : tags.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {tags.map((tag) => (
                    <TagBadge key={tag.id} name={tag.name} count={tag.count} />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  아직 사용된 태그가 없습니다.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
