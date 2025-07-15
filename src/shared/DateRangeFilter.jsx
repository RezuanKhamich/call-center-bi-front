import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/material';

const DateRangeFilter = ({ startDate, endDate, onChangeStartDate, onChangeEndDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={2}>
        <DatePicker label="От" value={startDate} onChange={onChangeStartDate} format="DD.MM.YY" />
        <DatePicker label="До" value={endDate} onChange={onChangeEndDate} format="DD.MM.YY" />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangeFilter;
