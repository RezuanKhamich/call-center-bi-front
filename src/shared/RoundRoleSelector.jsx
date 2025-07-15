import { useState } from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const RoundRoleSelector = ({
  value = 'Фильтр',
  onChange = () => {},
  list = [{ value: 'filter', label: 'Фильтр' }],
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [rotate, setRotate] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuWidth(event.currentTarget.clientWidth);
    setRotate(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setRotate(false);
  };

  const handleSelect = (value) => {
    onChange(value);
    handleClose();
  };

  return (
    <Box {...props}>
      <Button
        onClick={handleClick}
        sx={{
          border: '1px solid #d0d7de',
          borderRadius: '8px',
          color: '#1f2937',
          backgroundColor: '#fff',
          justifyContent: 'space-between',
          textTransform: 'none',
          fontWeight: 500,
          px: 2,
          py: 1,
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          '&:hover': {
            backgroundColor: '#f9fafb',
          },
        }}
        endIcon={
          <KeyboardArrowDownIcon
            sx={{
              transition: 'transform 0.3s ease',
              transform: rotate ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        }
      >
        {list.find((item) => item.value === value)?.label || value}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disablePortal
        slotProps={{
          paper: {
            sx: {
              minWidth: `${menuWidth}px`,
            },
          },
        }}
      >
        {list?.map((item) => (
          <MenuItem key={item.value} onClick={() => handleSelect(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default RoundRoleSelector;
