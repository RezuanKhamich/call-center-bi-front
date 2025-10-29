import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled from 'styled-components';
import { useState } from 'react';

export default function TextFieldWithError({ onChange, error, value, type, label, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const isPasswordField = type === 'password';

  return (
    <TextFieldWrapper
      label={label}
      type={isPasswordField && !showPassword ? 'password' : 'text'}
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
      required
      error={Boolean(error)}
      helperText={error}
      InputProps={{
        endAdornment: isPasswordField && (
          <InputAdornment position="end">
            <IconButton onClick={handleTogglePassword} edge="end">
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

const TextFieldWrapper = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 12px;
  }

  & p.Mui-error {
    font-weight: 500;
  }
`;
