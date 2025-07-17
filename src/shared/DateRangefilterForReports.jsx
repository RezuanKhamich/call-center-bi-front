import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import biStore from '../app/store/store';
import 'dayjs/locale/ru';

const DateRangefilterForReports = ({ reports, onChangeReports, ...props }) => {
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const userInfo = biStore((state) => state.userInfo);

  const commonStyles = {
    maxWidth: '220px',
    transition: 'border-color 0.3s ease',
    padding: '0 !important',
    '& .MuiBox-root': {
      padding: '0 !important',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '100px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3f87f5',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiSvgIcon-root': {
      color: '#555',
      fontSize: '18px',
    },
    '& .MuiPickersInputBase-sectionsContainer': {
      fontWeight: 500,
      fontSize: '12px',
    },
  };

  const onChangeStartDate = (startDate) => {
    setStartDate(startDate);
  };

  const onChangeEndDate = (endDate) => {
    setEndDate(endDate);
  };

  useEffect(() => {
    if (!reports?.length) return;

    reports.forEach((report) => {
      onChangeReports(report.id, 'userId', userInfo?.id);
      onChangeReports(report.id, 'reportingPeriodStartDate', startDate.toISOString());
      onChangeReports(report.id, 'reportingPeriodEndDate', endDate.toISOString());
    });
  }, [startDate, endDate, userInfo]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" {...props}>
      <Box display="flex" gap={2}>
        <DatePicker
          label="От"
          value={startDate}
          onChange={onChangeStartDate}
          format="DD.MM.YY"
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              sx: commonStyles,
            },
          }}
        />
        <DatePicker
          label="До"
          value={endDate}
          onChange={onChangeEndDate}
          format="DD.MM.YY"
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              sx: commonStyles,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangefilterForReports;
