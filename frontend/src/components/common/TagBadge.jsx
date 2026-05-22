import React from 'react';
import { Link } from 'react-router-dom';
import { Chip } from '@mui/material';

const TagBadge = ({ name, count }) => {
  const label = count !== undefined ? `#${name} (${count})` : `#${name}`;
  
  return (
    <Chip
      label={label}
      component={Link}
      to={`/tags/${encodeURIComponent(name)}`}
      clickable
      variant="outlined"
      color="primary"
      size="small"
      sx={{
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '0.8rem',
        textDecoration: 'none',
        height: '28px',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 6px rgba(95, 141, 122, 0.15)',
        }
      }}
    />
  );
};

export default TagBadge;
