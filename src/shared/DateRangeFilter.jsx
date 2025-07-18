import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/material';
import 'dayjs/locale/ru';

const DateRangeFilter = ({ startDate, endDate, onChangeStartDate, onChangeEndDate }) => {
  const inputStyles = {
    '& .MuiPickersOutlinedInput-root': {
      borderRadius: '8px',
      height: '44px',
    },
    '& fieldset': {
      borderColor: '#d0d0d0',
    },
    '&:hover fieldset': {
      borderColor: '#a0a0a0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#808080',
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Box display="flex" gap={2}>
        <DatePicker
          label="От"
          value={startDate}
          onChange={onChangeStartDate}
          format="DD.MM.YY"
          slotProps={{ textField: { sx: inputStyles } }}
        />
        <DatePicker
          label="До"
          value={endDate}
          onChange={onChangeEndDate}
          format="DD.MM.YY"
          slotProps={{ textField: { sx: inputStyles } }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangeFilter;
