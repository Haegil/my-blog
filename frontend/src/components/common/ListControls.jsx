import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const PAGE_SIZE_OPTIONS = [10, 30, 50];

const ListControls = ({
  totalCount,
  limit,
  dateFrom,
  dateTo,
  onLimitChange,
  onDateFromChange,
  onDateToChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        mb: 3,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        총 {totalCount}개
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: 'calc(50% - 4px)', sm: 150 } }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
            시작일
          </Typography>
          <TextField
            type="date"
            size="small"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ width: { xs: 'calc(50% - 4px)', sm: 150 } }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
            종료일
          </Typography>
          <TextField
            type="date"
            size="small"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            fullWidth
          />
        </Box>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel id="page-size-label">표시 개수</InputLabel>
          <Select
            labelId="page-size-label"
            value={limit}
            label="표시 개수"
            onChange={(event) => onLimitChange(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}개
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ListControls;
