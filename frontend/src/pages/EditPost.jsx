import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import MarkdownEditor from '../components/editor/MarkdownEditor';
import { encodeContentPayload } from '../utils/contentEncoding';
import { Container, Alert, Button, Box, Typography, Skeleton } from '@mui/material';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [error, setError] = useState('');

  const DRAFT_KEY = `memostack_edit_draft_${id}`;

  // Fetch existing post data & check for draft
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await client.get(`/posts/${id}`);
        const post = response.data;
        
        setTitle(post.title || '');
        setContent(post.content || '');
        
        if (post.tags && post.tags.length > 0) {
          setTags(post.tags.map(t => t.name).join(', '));
        } else {
          setTags('');
        }

        // Check if there is a newer draft in localStorage
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          setHasDraft(true);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, DRAFT_KEY]);

  // Debounced auto-save to localStorage
  useEffect(() => {
    if (!loading && (title || content || tags)) {
      const timer = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, tags }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, content, tags, loading, DRAFT_KEY]);

  const loadDraft = () => {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
      if (draft) {
        setTitle(draft.title || '');
        setContent(draft.content || '');
        setTags(draft.tags || '');
      }
    } catch (e) {
      console.error('Failed to parse draft:', e);
    } finally {
      setHasDraft(false);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  };

  const handleSave = async () => {
    setError('');
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('본문 내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const tagList = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

      await client.patch(`/posts/${id}`, {
        title,
        content: encodeContentPayload(content),
        contentEncoding: 'base64',
        tags: tagList
      });

      localStorage.removeItem(DRAFT_KEY);
      navigate(`/posts/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || '게시글 수정에 실패했습니다.';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: '6px' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Outfit, sans-serif' }}>
            기록 수정하기 ✏️
          </Typography>
          <Typography variant="body2" color="text.secondary">
            수정한 지식 카드는 자동으로 기기에 임시 저장됩니다.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={() => navigate(`/posts/${id}`)}
          sx={{ borderRadius: '6px' }}
        >
          수정 취소
        </Button>
      </Box>

      {/* Draft Restore Alert */}
      {hasDraft && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, borderRadius: '6px' }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="primary" size="small" variant="contained" onClick={loadDraft} sx={{ borderRadius: '6px' }}>
                불러오기
              </Button>
              <Button color="inherit" size="small" onClick={discardDraft}>
                삭제
              </Button>
            </Box>
          }
        >
          작성 중이던 임시 저장 글이 존재합니다. 불러오시겠습니까?
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '6px' }}>
          {error}
        </Alert>
      )}

      <MarkdownEditor
        title={title}
        onTitleChange={setTitle}
        value={content}
        onChange={setContent}
        tags={tags}
        onTagsChange={setTags}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </Container>
  );
};

export default EditPost;
