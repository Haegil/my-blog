import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TagBadge from './TagBadge';

const PostCard = ({ post }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{ 
      mb: 3, 
      transition: 'all 0.25s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
      }
    }}>
      <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontFamily: 'Inter, sans-serif' }}>
          {formatDate(post.createdAt)}
        </Typography>

        <Typography 
          variant="h5" 
          component={Link} 
          to={`/posts/${post.id}`}
          sx={{ 
            fontWeight: 700, 
            textDecoration: 'none', 
            color: 'text.primary',
            lineHeight: 1.3,
            display: 'block',
            mb: 2,
            transition: 'color 0.2s',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          {post.title}
        </Typography>

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {post.tags.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
