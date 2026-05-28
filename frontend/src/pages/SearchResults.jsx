import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Box, Typography, Button, Divider, Pagination } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import client from '../api/client';
import PostCard from '../components/common/PostCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonList from '../components/common/SkeletonList';
import { setSearchQuery } from '../store/searchSlice';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const query = searchParams.get('q') || '';
  
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 5;

  // Reset page to 1 whenever search query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    // Sync the Redux global query with the URL parameter
    dispatch(setSearchQuery(query));

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await client.get(`/posts?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        
        // Handle both paginated format {posts, totalCount} and plain array
        if (response.data && response.data.posts) {
          setPosts(response.data.posts);
          setTotalCount(response.data.totalCount);
        } else {
          setPosts(response.data);
          setTotalCount(response.data.length);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('검색 결과를 불러오는 도중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setPosts([]);
      setTotalCount(0);
      setLoading(false);
    }
  }, [query, page, dispatch]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / limit);

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
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.6rem', sm: '2.125rem' }, 
            fontWeight: 800, 
            mb: 1, 
            fontFamily: 'Outfit, sans-serif' 
          }}
        >
          {query.trim().startsWith('#') ? (
            <>태그 <span style={{ color: 'var(--primary)' }}>{query}</span> 검색 결과 🏷️</>
          ) : (
            <>&apos;{query}&apos; 검색 결과 🔍</>
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          {query.trim().startsWith('#') ? (
            <>해당 태그를 가진 기록들입니다. 총 {loading ? '-' : totalCount}개의 기록을 찾았습니다.</>
          ) : (
            <>제목, 본문 내용 및 태그 중에서 검색어와 일치하는 기록들입니다. 총 {loading ? '-' : totalCount}개의 기록을 찾았습니다.</>
          )}
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
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minWidth: { xs: '28px', sm: '40px' },
                    height: { xs: '28px', sm: '40px' }
                  }
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState 
          title="일치하는 기록이 없습니다" 
          description="다른 키워드로 검색해보시거나, 홈 화면에서 태그 목록을 살펴보세요." 
        />
      )}
    </Container>
  );
};

export default SearchResults;
