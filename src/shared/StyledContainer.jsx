import { Box } from '@mui/material';
import TypographyTitle from './TypographyTitle';
import { customColors } from '../app/theme';

const StyledContainer = ({ title, children, ...props }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        boxShadow: customColors.boxShadow,
        borderRadius: '20px',
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
