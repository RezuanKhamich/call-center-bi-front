import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import { reportStatus } from '../app/constants';
import ExcelUploadButton from './ExcelUploadButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ReportItem = ({ id, title, status = reportStatus.notUploaded, error, onChangeReports }) => {
  return (
    <Box
      borderRadius="8px"
      border="1px solid #d0d7de;"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      mb={2}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight={600}>{title}</Typography>
            {status === reportStatus.success ? (
              <CheckIcon fontSize="small" color="success" />
            ) : status === reportStatus.error ? (
              <ErrorIcon fontSize="small" color="error" />
            ) : null}
          </Box>
        </Box>
        {status === reportStatus.notUploaded ? (
          <ExcelUploadButton id={id} onChangeReports={onChangeReports} />
        ) : (
          <ExcelUploadButton id={id} onChangeReports={onChangeReports} isEditBtn />
        )}
      </Box>
      {status === reportStatus.error && (
        <Accordion
          sx={{
            backgroundColor: '#fff0f0',
            boxShadow: 'none',
            border: '1px solid #f44336',
            marginTop: 2,
            borderRadius: 1,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="error-content"
            id="error-header"
          >
            <Typography color="error" variant="body2">
              Ошибка: подробности
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '10px', fontWeight: 'bold' }}>Строка</TableCell>
                  <TableCell sx={{ fontSize: '10px', fontWeight: 'bold' }}>Поле</TableCell>
                  <TableCell sx={{ fontSize: '10px', fontWeight: 'bold' }}>Ошибка</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {error?.map((el, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '10px' }}>{el.row + 2}</TableCell>
                    <TableCell sx={{ fontSize: '10px' }}>{el.field}</TableCell>
                    <TableCell sx={{ fontSize: '10px', color: 'error.main' }}>
                      {el.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default ReportItem;
