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
        borderRadius: '4px',
        fontWeight: 600,
        fontSize: '0.8rem',
        textDecoration: 'none',
        height: '28px',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(95, 141, 122, 0.08)',
        }
      }}
    />
  );
};

export default TagBadge;
