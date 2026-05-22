import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  TextField, 
  Typography, 
  Grid, 
  Divider,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { 
  FormatBold, 
  FormatItalic, 
  Code, 
  FormatQuote, 
  Title, 
  InsertLink, 
  Visibility, 
  EditNote 
} from '@mui/icons-material';
import MarkdownPreview from './MarkdownPreview';

const MarkdownEditor = ({ value, onChange, title, onTitleChange, tags, onTagsChange, onSave, isSaving }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const textareaRef = useRef(null);

  const insertMarkdown = (syntaxBefore, syntaxAfter = '') => {
    if (isPreviewMode) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = value.substring(start, end);
    const replacement = syntaxBefore + selection + syntaxAfter;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxBefore.length, start + syntaxBefore.length + selection.length);
    }, 0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Title */}
      <TextField
        fullWidth
        label="제목을 입력하세요"
        variant="outlined"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        InputProps={{
          style: { 
            fontSize: '1.5rem', 
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif'
          }
        }}
      />

      {/* Tags */}
      <TextField
        fullWidth
        label="태그 (쉼표로 구분, 예: react, express, oracle)"
        variant="outlined"
        placeholder="태그들을 쉼표로 구분해서 적어주세요"
        value={tags}
        onChange={(e) => onTagsChange(e.target.value)}
      />

      {/* Editor Panel */}
      <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
        {/* Tool buttons */}
        <Box sx={{ p: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap', backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', alignItems: 'center' }}>
          <IconButton size="small" onClick={() => insertMarkdown('### ', '')} title="헤더" disabled={isPreviewMode}>
            <Title fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertMarkdown('**', '**')} title="굵게" disabled={isPreviewMode}>
            <FormatBold fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertMarkdown('*', '*')} title="기울임" disabled={isPreviewMode}>
            <FormatItalic fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertMarkdown('`', '`')} title="코드 한줄" disabled={isPreviewMode}>
            <Code fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertMarkdown('```\n', '\n```')} title="코드 블록" disabled={isPreviewMode}>
            <Code fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertMarkdown('> ', '')} title="인용구" disabled={isPreviewMode}>
            <FormatQuote fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertMarkdown('[', '](url)')} title="링크 삽입" disabled={isPreviewMode}>
            <InsertLink fontSize="small" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Preview Toggle Button */}
          <Button
            variant={isPreviewMode ? "contained" : "outlined"}
            size="small"
            color="primary"
            startIcon={isPreviewMode ? <EditNote /> : <Visibility />}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            sx={{ borderRadius: '8px', px: 2, py: 0.5, textTransform: 'none', fontWeight: 600 }}
          >
            {isPreviewMode ? '편집기' : '미리보기'}
          </Button>
        </Box>

        {/* Content Area */}
        {isPreviewMode ? (
          <Box
            sx={{
              width: '100%',
              height: '450px',
              padding: '1.25rem',
              overflowY: 'auto',
              backgroundColor: 'background.default',
              lineHeight: 1.65,
              wordBreak: 'break-word'
            }}
          >
            <MarkdownPreview content={value} />
          </Box>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="여기에 마크다운 문법으로 기록을 시작하세요..."
            style={{
              width: '100%',
              height: '450px',
              padding: '1.25rem',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
              fontSize: '0.95rem',
              backgroundColor: 'transparent',
              color: 'inherit',
              lineHeight: 1.65
            }}
          />
        )}
        
        <Divider />
        
        {/* Editor Status */}
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'background.paper' }}>
          <Typography variant="caption" color="text.secondary">
            글자 수: {value.length}자
          </Typography>
          {isSaving && (
            <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
              임시 저장 중...
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
        <Button 
          variant="contained" 
          onClick={onSave} 
          disabled={isSaving}
          sx={{ minWidth: 120, px: 4, py: 1.25 }}
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </Button>
      </Box>
    </Box>
  );
};

export default MarkdownEditor;
