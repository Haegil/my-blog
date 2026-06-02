import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const MarkdownPreview = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [content]);

  return (
    <div ref={containerRef} className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || '*내용이 아직 없습니다.*'}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
