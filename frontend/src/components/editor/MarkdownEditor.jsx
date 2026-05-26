import React, { useState, useRef, useEffect } from 'react';
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
import { useTheme } from '@mui/material/styles';
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

// Helper functions for real-time markdown syntax highlighting
const escapeHTML = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const highlightInlineStyles = (text) => {
  let result = text;
  
  // 1. Inline code: `code`
  result = result.replace(/`([^`\n]+)`/g, '<span class="hl-inline-code">`$1`</span>');
  
  // 2. Bold and Italic: ***bold italic***
  result = result.replace(/\*\*\*([^*]+)\*\*\*/g, '<span class="hl-bold hl-italic">***$1***</span>');
  
  // 3. Bold: **bold**
  result = result.replace(/\*\*([^*]+)\*\*/g, '<span class="hl-bold">**$1**</span>');
  
  // 4. Italic: *italic*
  result = result.replace(/\*([^*]+)\*/g, '<span class="hl-italic">*$1*</span>');
  
  // 5. Links: [text](url)
  result = result.replace(/\[([^\]\n]+)\]\(([^)\n]+)\)/g, '<span class="hl-link-text">[$1]</span><span class="hl-link-url">($2)</span>');
  
  // 6. Tags/Hashtags (like #tag)
  result = result.replace(/(^|\s)#([a-zA-Z0-9가-힣_-]+)/g, '$1<span class="hl-hashtag">#$2</span>');
  
  return result;
};

const highlightMarkdown = (text) => {
  if (!text) return '';
  
  // Append trailing space if it ends with a newline to align heights
  let processedText = text;
  if (processedText.endsWith('\n')) {
    processedText += ' ';
  }

  const lines = processedText.split('\n');
  let inCodeBlock = false;
  
  const highlightedLines = lines.map((line) => {
    let escapedLine = escapeHTML(line);
    
    // Check for code blocks
    if (escapedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return `<span class="hl-code-block-boundary">${escapedLine}</span>`;
    }
    
    if (inCodeBlock) {
      return `<span class="hl-code-block-line">${escapedLine}</span>`;
    }
    
    // Headers
    const headerMatch = escapedLine.match(/^(#{1,6}\s+)(.*)$/);
    if (headerMatch) {
      const level = headerMatch[1].trim().length;
      return `<span class="hl-header hl-header-${level}"><span class="hl-header-symbol">${headerMatch[1]}</span>${highlightInlineStyles(headerMatch[2])}</span>`;
    }
    
    // Blockquote
    if (escapedLine.startsWith('&gt; ')) {
      return `<span class="hl-blockquote"><span class="hl-blockquote-symbol">&gt; </span>${highlightInlineStyles(escapedLine.substring(5))}</span>`;
    }
    
    // List items
    const listMatch = escapedLine.match(/^(\s*)([-*+]\s+|\d+\.\s+)(.*)$/);
    if (listMatch) {
      const indent = listMatch[1];
      const marker = listMatch[2];
      const rest = listMatch[3];
      return `${indent}<span class="hl-list-marker">${marker}</span>${highlightInlineStyles(rest)}`;
    }
    
    // Regular line
    return highlightInlineStyles(escapedLine);
  });
  
  return highlightedLines.join('\n');
};

const MarkdownEditor = ({ value, onChange, title, onTitleChange, tags, onTagsChange, onSave, isSaving }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Sync scroll values on window resize or render
  useEffect(() => {
    handleScroll();
  }, [value, isPreviewMode]);

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
          <Box sx={{ position: 'relative', width: '100%', height: '450px' }}>
            {/* The Highlighted Pre-block under the textarea */}
            <pre
              ref={preRef}
              className="markdown-highlighted-pre"
              dangerouslySetInnerHTML={{ __html: highlightMarkdown(value) }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                padding: '1.25rem',
                border: 'none',
                overflow: 'auto',
                pointerEvents: 'none',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                fontSize: '0.95rem',
                lineHeight: 1.65,
                backgroundColor: 'transparent',
                color: isDark ? '#abb2bf' : '#1f2937',
                boxSizing: 'border-box',
              }}
            />
            {/* The transparent text area overlaid on top */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onScroll={handleScroll}
              placeholder="여기에 마크다운 문법으로 기록을 시작하세요..."
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                padding: '1.25rem',
                border: 'none',
                outline: 'none',
                resize: 'none',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                fontSize: '0.95rem',
                lineHeight: 1.65,
                backgroundColor: 'transparent',
                color: 'transparent',
                caretColor: isDark ? '#ffffff' : '#000000',
                boxSizing: 'border-box',
                zIndex: 1,
              }}
            />
          </Box>
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
