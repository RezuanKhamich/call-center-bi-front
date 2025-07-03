import { Typography } from '@mui/material';

export default function TypographyText({ children, ...props }) {
  return (
    <Typography variant="p" fontWeight={500} gutterBottom {...props}>
      {children}
    </Typography>
  );
}
