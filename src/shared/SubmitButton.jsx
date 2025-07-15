import { Button } from '@mui/material';

const SubmitButton = ({ disabled = false }) => (
  <Button
    variant="contained"
    sx={{
      borderRadius: '10px',
      backgroundColor: disabled ? '#c2c2c2' : '#2196f3',
      color: disabled ? '#666' : '#fff',
      pointerEvents: disabled ? 'none' : 'auto',
    }}
  >
    Опубликовать
  </Button>
);

export default SubmitButton;
