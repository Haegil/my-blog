import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import client from '../api/client';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import TagBadge from '../components/common/TagBadge';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Card,
  CardContent,
  Skeleton
} from '@mui/material';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await client.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await client.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Skeleton variant="text" width={100} height={20} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="90%" height={50} sx={{ mb: 3 }} />
        <Skeleton variant="text" width={120} height={24} sx={{ mb: 4 }} />
        <Divider sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '16px' }} />
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Back Button */}
      <Button 
        component={Link} 
        to="/" 
        startIcon={<ArrowBack />} 
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        목록으로 돌아가기
      </Button>

      <Card sx={{ border: 'none', backgroundColor: 'background.paper' }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          {/* Metadata & Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
              작성일: {formatDate(post.createdAt)}
              {post.updatedAt !== post.createdAt && ` (최종 수정일: ${formatDate(post.updatedAt)})`}
            </Typography>

            {isAuthenticated && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  component={Link} 
                  to={`/edit/${post.id}`} 
                  variant="outlined" 
                  size="small" 
                  startIcon={<Edit />}
                  sx={{ borderRadius: '999px' }}
                >
                  수정
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ borderRadius: '999px' }}
                >
                  삭제
                </Button>
              </Box>
            )}
          </Box>

          {/* Title */}
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 3, wordBreak: 'break-all', lineHeight: 1.25, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            {post.title}
          </Typography>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
              {post.tags.map((tag) => (
                <TagBadge key={tag.id} name={tag.name} />
              ))}
            </Box>
          )}

          <Divider sx={{ mb: 5 }} />

          {/* Content */}
          <MarkdownPreview content={post.content} />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: { borderRadius: 16 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>기록 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 이 기록을 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDelete} color="error" variant="contained" autoFocus sx={{ borderRadius: '999px' }}>
            삭제하기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostDetail;
