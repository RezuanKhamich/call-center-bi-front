import { useState } from 'react';
import LogoImage from '../shared/LogoImage';
import Logo from '../assets/logo.png';
import TypographyTitle from '../shared/TypographyTitle';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import roles from '../app/constants';
import styled from 'styled-components';
import TextFieldWithError from '../shared/TextFieldWithError';
import { login } from '../app/auth';

export default function Login() {
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Пример сохранения роли
    if (remember && role) {
      localStorage.setItem('role', role);
    }
    // TODO: логика авторизации
    console.log({ role, password, remember });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(role, password);
    if (res) {
      window.location.href = '/dashboard'; // или navigate(...)
    }
  };

  return (
    <LoginContainer>
      <LogoImage src={Logo} text="ЦОЗМАИТ КБР" />
      <TypographyTitle>Мониторинг обращений граждан по КБР</TypographyTitle>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          mx: 'auto',
          mt: 8,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Авторизация
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Роль</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Роль"
            onChange={(e) => setRole(e.target.value)}
            required
          >
            {roles.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextFieldWithError onChange={() => {}} error={passwordError} label="Пароль" />

        <FormControlLabel
          control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
          label="Запомнить меня"
          sx={{ mt: 1 }}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Войти
        </Button>
      </Box>
    </LoginContainer>
  );
}

const LoginContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;
