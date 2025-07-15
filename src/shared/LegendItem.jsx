import { Box, Typography } from '@mui/material';

const LegendItem = ({ color, label }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Box width={12} height={12} borderRadius="50%" bgcolor={color} />
    <Typography variant="body2">{label}</Typography>
  </Box>
);

export default LegendItem;
