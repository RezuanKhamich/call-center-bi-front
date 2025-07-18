import { Box } from '@mui/material';
import DateRangefilterForReports from './DateRangefilterForReports';
import styled from 'styled-components';

const DateContainer = styled(DateRangefilterForReports)`
  flex-direction: row !important;
`;

const TitleWithDateRange = ({ reports, onChangeReports }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <DateContainer reports={reports} onChangeReports={onChangeReports} />
  </Box>
);

export default TitleWithDateRange;
