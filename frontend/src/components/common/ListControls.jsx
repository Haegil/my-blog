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
        gap: 1.25,
        mb: 2.5,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        총 {totalCount}개
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          label="시작일"
          type="date"
          size="small"
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          InputLabelProps={{ shrink: true }}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: { xs: 'calc(50% - 4px)', sm: 150 } }}
        />
        <TextField
          label="종료일"
          type="date"
          size="small"
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          InputLabelProps={{ shrink: true }}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: { xs: 'calc(50% - 4px)', sm: 150 } }}
        />
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
