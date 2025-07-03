import { Typography } from '@mui/material';

export default function TypographyTitle({ children, ...props }) {
  return (
    <Typography variant="h5" fontWeight={600} gutterBottom {...props}>
      {children}
    </Typography>
  );
}
