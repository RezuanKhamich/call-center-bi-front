import { Box } from '@mui/material';
import TypographyTitle from './TypographyTitle';

const StyledContainer = ({ title, children, ...props }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        border: '1px solid #d0d7de',
        borderRadius: '8px',
        padding: 3,
      }}
    >
      {title ? (
        <TypographyTitle sx={{ mb: 3, textAlign: 'center' }}>{title}</TypographyTitle>
      ) : null}
      <Box sx={{ display: 'flex' }} {...props}>
        {children}
      </Box>
    </Box>
  );
};

export default StyledContainer;
