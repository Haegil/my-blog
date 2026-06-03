import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import MarkdownEditor from '../components/editor/MarkdownEditor';
import { Container, Alert, Button, Box, Typography } from '@mui/material';

const DRAFT_KEY = 'memostack_write_draft';

const WritePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasDraft, setHasDraft] = useState(() => !!localStorage.getItem(DRAFT_KEY));
  const [error, setError] = useState('');

  // Autosave draft to localstorage (debounced)
  useEffect(() => {
    if (title || content || tags) {
      const timer = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, tags }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, content, tags]);

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

      const response = await client.post('/posts', {
        title,
        content,
        tags: tagList
      });

      localStorage.removeItem(DRAFT_KEY);
      navigate(`/posts/${response.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || '게시글 저장에 실패했습니다.';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Outfit, sans-serif' }}>
          새 기록 남기기 🖋️
        </Typography>
        <Typography variant="body2" color="text.secondary">
          배운 내용이나 지식 카드를 마크다운으로 자유롭게 기록해보세요. 1초마다 자동 임시 저장이 수행됩니다.
        </Typography>
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

export default WritePost;
