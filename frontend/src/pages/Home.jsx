import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Pagination } from '@mui/material';
import client from '../api/client';
import PostCard from '../components/common/PostCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonList from '../components/common/SkeletonList';
import ListControls from '../components/common/ListControls';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);

        const postsRes = await client.get(`/posts?${params.toString()}`);
        setPosts(postsRes.data.posts || postsRes.data);
        setTotalCount(postsRes.data.totalCount ?? postsRes.data.length);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, dateFrom, dateTo]);

  const totalPages = Math.ceil(totalCount / limit);

  const handleLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  };

  const handleDateFromChange = (value) => {
    setDateFrom(value);
    setPage(1);
  };

  const handleDateToChange = (value) => {
    setDateTo(value);
    setPage(1);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Title Header */}
      <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            borderRadius: '6px',
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
        <ListControls
          totalCount={totalCount}
          limit={limit}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onLimitChange={handleLimitChange}
          onDateFromChange={handleDateFromChange}
          onDateToChange={handleDateToChange}
        />

        {loading ? (
          <SkeletonList count={3} />
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
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
