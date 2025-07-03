import { TextField } from '@mui/material';
import styled from 'styled-components';

export default function TextFieldWithError({ onChange, error, value, type, label, ...props }) {
  return (
    <TextFieldWrapper
      label={label}
      type={type}
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
      required
      error={error}
      helperText={error}
      {...props}
    />
  );
}

const TextFieldWrapper = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 12px;
  }
`;
