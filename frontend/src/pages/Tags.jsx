import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  Typography,
} from '@mui/material';
import { ArrowBack, Tag as TagIcon } from '@mui/icons-material';
import client from '../api/client';
import EmptyState from '../components/common/EmptyState';
import ListControls from '../components/common/ListControls';
import PostCard from '../components/common/PostCard';
import SkeletonList from '../components/common/SkeletonList';

const Tags = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoadingTags(true);
        setError('');
        const response = await client.get('/tags');
        setTags(response.data);

        if (!name && response.data.length > 0) {
          navigate(`/tags/${encodeURIComponent(response.data[0].name)}`, { replace: true });
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('태그 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, [name, navigate]);

  useEffect(() => {
    if (!name) return;

    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const params = new URLSearchParams({
          tag: name,
          page: String(page),
          limit: String(limit),
        });
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);

        const response = await client.get(`/posts?${params.toString()}`);
        setPosts(response.data.posts || response.data);
        setTotalCount(response.data.totalCount ?? response.data.length);
      } catch (err) {
        console.error('Error fetching posts for tag:', err);
        setError('태그별 게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [name, page, limit, dateFrom, dateTo]);

  const activeTagName = name || (tags.length > 0 ? tags[0].name : '');
  const totalPages = Math.ceil(totalCount / limit);

  const resetPage = () => setPage(1);

  const handleLimitChange = (value) => {
    setLimit(value);
    resetPage();
  };

  const handleDateFromChange = (value) => {
    setDateFrom(value);
    resetPage();
  };

  const handleDateToChange = (value) => {
    setDateTo(value);
    resetPage();
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBack />}
        sx={{ mb: { xs: 2, md: 4 }, color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
      >
        홈으로 돌아가기
      </Button>

      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.6rem', sm: '2.125rem' },
            fontWeight: 800,
            mb: 0.5,
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          태그별 기록 탐색
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          관심 있는 태그를 선택해 관련 기록을 모아볼 수 있습니다.
        </Typography>
      </Box>

      <Divider sx={{ mb: 5 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '6px' }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              position: { md: 'sticky' },
              top: 96,
              maxHeight: { xs: '200px', md: 'calc(100vh - 160px)' },
              overflowY: 'auto',
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
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                }}
              >
                <TagIcon fontSize="small" color="primary" /> 모든 태그 ({tags.length})
              </Typography>

              {loadingTags ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Loading..." size="small" disabled sx={{ borderRadius: '6px' }} />
                  <Chip label="Loading..." size="small" disabled sx={{ borderRadius: '6px' }} />
                  <Chip label="Loading..." size="small" disabled sx={{ borderRadius: '6px' }} />
                </Box>
              ) : tags.length > 0 ? (
                <>
                  <Box sx={{ display: { xs: 'grid', md: 'none' }, gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                    {tags.map((tag) => {
                      const isActive = tag.name.toLowerCase() === activeTagName.toLowerCase();
                      return (
                        <Chip
                          key={tag.id}
                          label={`#${tag.name} (${tag.count})`}
                          component={Link}
                          to={`/tags/${encodeURIComponent(tag.name)}`}
                          clickable
                          color={isActive ? 'primary' : 'default'}
                          variant={isActive ? 'filled' : 'outlined'}
                          sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            height: '28px',
                            width: '100%',
                            borderColor: isActive ? 'transparent' : 'divider',
                            '& .MuiChip-label': {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              px: 1,
                            },
                          }}
                        />
                      );
                    })}
                  </Box>

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
                            borderRadius: '6px',
                            mb: 1,
                            py: 1.25,
                            px: 1.5,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.main',
                              color: '#ffffff',
                              '&:hover': { backgroundColor: 'primary.dark' },
                              '& .MuiChip-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: '#ffffff',
                                borderColor: 'transparent',
                              },
                            },
                          }}
                        >
                          <ListItemText
                            primary={`#${tag.name}`}
                            primaryTypographyProps={{
                              fontWeight: isActive ? 700 : 500,
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.95rem',
                            }}
                          />
                          <Chip label={tag.count} size="small" variant="outlined" />
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

        <Grid item xs={12} md={8}>
          {activeTagName ? (
            <Box sx={{ mt: { xs: 1, md: 0 } }}>
              <Box sx={{ mb: { xs: 2, sm: 4 } }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mb: 0.5,
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}
                >
                  #{activeTagName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  선택한 태그가 포함된 기록입니다.
                </Typography>
              </Box>

              <ListControls
                totalCount={totalCount}
                limit={limit}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onLimitChange={handleLimitChange}
                onDateFromChange={handleDateFromChange}
                onDateToChange={handleDateToChange}
              />

              {loadingPosts ? (
                <SkeletonList count={3} />
              ) : posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}

                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                      <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary" />
                    </Box>
                  )}
                </>
              ) : (
                <EmptyState title="게시글이 없습니다" description={`#${activeTagName} 태그를 가진 게시글이 아직 없습니다.`} />
              )}
            </Box>
          ) : (
            <EmptyState title="태그를 선택하세요" description="왼쪽 목록에서 태그를 선택하면 해당 태그를 가진 게시글이 표시됩니다." />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Tags;
