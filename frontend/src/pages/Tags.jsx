import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  List, 
  ListItemButton, 
  ListItemText,
  Chip
} from '@mui/material';
import { ArrowBack, Tag as TagIcon } from '@mui/icons-material';
import client from '../api/client';
import PostCard from '../components/common/PostCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonList from '../components/common/SkeletonList';

const Tags = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState('');

  // Fetch all tags on load
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoadingTags(true);
        const response = await client.get('/tags');
        setTags(response.data);
        
        // If we are at /tags and there are tags available, redirect to the first tag
        if (!name && response.data && response.data.length > 0) {
          navigate(`/tags/${encodeURIComponent(response.data[0].name)}`, { replace: true });
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('태그 목록을 불러오는 도중 오류가 발생했습니다.');
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, [name, navigate]);

  // Fetch posts for the active tag
  useEffect(() => {
    if (!name) return;

    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await client.get(`/posts?tag=${encodeURIComponent(name)}`);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts for tag:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [name]);

  const activeTagName = name || (tags.length > 0 ? tags[0].name : '');

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Back Button */}
      <Button 
        component={Link} 
        to="/" 
        startIcon={<ArrowBack />} 
        sx={{ mb: { xs: 2, md: 4 }, color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
      >
        홈으로 돌아가기
      </Button>

      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.6rem', sm: '2.125rem' }, 
            fontWeight: 800, 
            mb: 0.5, 
            fontFamily: 'Outfit, sans-serif' 
          }}
        >
          태그별 기록 탐색 🏷️
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          관심 있는 태그를 선택하여 관련 지식과 경험들을 모아보세요.
        </Typography>
      </Box>

      <Divider sx={{ mb: 5 }} />

      <Grid container spacing={4}>
        {/* Left Column: Tags List */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              position: { md: 'sticky' }, 
              top: 96, 
              maxHeight: { xs: '260px', md: 'calc(100vh - 160px)' }, 
              overflowY: 'auto' 
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1.5, 
                  fontFamily: 'Outfit, sans-serif', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' }
                }}
              >
                <TagIcon fontSize="small" color="primary" /> 모든 태그 ({tags.length})
              </Typography>
              
              {loadingTags ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Loading..." size="small" disabled sx={{ borderRadius: '8px' }} />
                  <Chip label="Loading..." size="small" disabled sx={{ borderRadius: '8px' }} />
                  <Chip label="Loading..." size="small" disabled sx={{ borderRadius: '8px' }} />
                </Box>
              ) : tags.length > 0 ? (
                <>
                  {/* Mobile View: Flexible Chips list that wraps horizontally */}
                  <Box 
                    sx={{ 
                      display: { xs: 'flex', md: 'none' }, 
                      flexWrap: 'wrap', 
                      gap: 0.75, 
                      pb: 0.5 
                    }}
                  >
                    {tags.map((tag) => {
                      const isActive = tag.name.toLowerCase() === activeTagName.toLowerCase();
                      return (
                        <Chip
                          key={tag.id}
                          label={`#${tag.name} (${tag.count})`}
                          component={Link}
                          to={`/tags/${encodeURIComponent(tag.name)}`}
                          clickable
                          color={isActive ? "primary" : "default"}
                          variant={isActive ? "filled" : "outlined"}
                          sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.78rem',
                            borderRadius: '8px',
                            px: 0.5,
                            py: 1.25,
                            borderColor: isActive ? 'transparent' : 'divider',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: isActive ? 'primary.main' : 'rgba(95, 141, 122, 0.08)',
                            }
                          }}
                        />
                      );
                    })}
                  </Box>

                  {/* Desktop View: List panel */}
                  <List component="nav" sx={{ display: { xs: 'none', md: 'block' }, p: 0 }}>
                    {tags.map((tag) => {
                      const isActive = tag.name.toLowerCase() === activeTagName.toLowerCase();
                      return (
                        <ListItemButton
                          key={tag.id}
                          component={Link}
                          to={`/tags/${encodeURIComponent(tag.name)}`}
                          selected={isActive}
                          sx={{
                            borderRadius: '12px',
                            mb: 1,
                            transition: 'all 0.2s ease',
                            py: 1.5,
                            px: 2,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.main',
                              color: '#ffffff',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                              '& .MuiChip-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: '#ffffff',
                                borderColor: 'transparent'
                              }
                            },
                            '&:hover': {
                              transform: 'translateX(4px)',
                              backgroundColor: isActive ? 'primary.main' : 'rgba(95, 141, 122, 0.08)',
                            }
                          }}
                        >
                          <ListItemText 
                            primary={`#${tag.name}`} 
                            primaryTypographyProps={{ 
                              fontWeight: isActive ? 700 : 500,
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.95rem'
                            }} 
                          />
                          <Chip 
                            label={tag.count} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.75rem',
                              borderColor: isActive ? 'transparent' : 'divider',
                              color: isActive ? 'inherit' : 'text.secondary'
                            }} 
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  아직 등록된 태그가 없습니다.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

          {/* Right Column: Selected Tag's Posts */}
        <Grid item xs={12} md={8}>
          {activeTagName ? (
            <Box sx={{ mt: { xs: 1, md: 0 } }}>
              <Box sx={{ mb: { xs: 2, sm: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 0.5, 
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    #{activeTagName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                    이 태그가 포함된 기록들입니다. 총 {loadingPosts ? '-' : posts.length}개의 글이 검색되었습니다.
                  </Typography>
                </Box>
              </Box>

              {loadingPosts ? (
                <SkeletonList count={3} />
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <EmptyState 
                  title="게시글이 없습니다" 
                  description={`#${activeTagName} 태그를 가진 게시글이 아직 없습니다.`} 
                />
              )}
            </Box>
          ) : (
            <EmptyState 
              title="태그를 선택하세요" 
              description="왼쪽 목록에서 태그를 선택하면 해당 태그를 가진 게시글들이 여기에 나타납니다." 
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Tags;
