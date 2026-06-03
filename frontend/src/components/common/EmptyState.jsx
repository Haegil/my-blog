import { Box, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

const EmptyState = ({ title = '결과가 없습니다', description = '다른 키워드로 검색하거나 새 글을 작성해 보세요.' }) => {
  return (
    <Box sx={{
      py: 8,
      px: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      border: '2px dashed',
      borderColor: 'divider',
      borderRadius: '6px',
      backgroundColor: 'background.paper',
      opacity: 0.85
    }}>
      <Info sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
};

export default EmptyState;
