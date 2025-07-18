import { Button } from '@mui/material';
import styled from 'styled-components';

const ButtonWrapper = styled(Button)`
  box-shadow: none !important;
  width: 100%;
  color: #fff;
  font-weight: 600;

  &:disabled {
    background-color: #cdeac4;
    color: #f5f5f5;
  }
`;

const SubmitButton = ({ onClickHandler, label, startIcon, disabled = false, sx, ...props }) => (
  <ButtonWrapper
    variant="contained"
    sx={sx}
    startIcon={startIcon}
    onClick={onClickHandler}
    disabled={disabled}
    {...props}
  >
    {label}
  </ButtonWrapper>
);

export default SubmitButton;
