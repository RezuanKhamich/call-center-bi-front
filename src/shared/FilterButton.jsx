import { Button } from '@mui/material';

const FilterButton = ({ label, onClick }) => (
  <Button
    fullWidth
    variant="contained"
    onClick={onClick}
    sx={{
      justifyContent: 'flex-start',
      backgroundColor: '#d6d6d6',
      color: '#000',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: '#c2c2c2',
      },
    }}
  >
    {label}
  </Button>
);

export default FilterButton;
