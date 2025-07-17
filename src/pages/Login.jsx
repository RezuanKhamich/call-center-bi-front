import { useState } from 'react';
import LogoImage from '../shared/LogoImage';
import Logo from '../assets/logo.svg';
import TypographyTitle from '../shared/TypographyTitle';
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import styled from 'styled-components';
import TextFieldWithError from '../shared/TextFieldWithError';
import { login } from '../app/auth';
import { roles } from '../app/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password, true);
      setErrors(null);
      if (data) {
        if (data.user.role === roles.moderator.value) {
          window.location.href = '/moderator/dashboard';
        } else if (data.user.role === roles.minister.value) {
          window.location.href = '/minister';
        } else {
          window.location.href = '/mo';
        }
      }
    } catch (err) {
      setErrors(err.message);
    }
  };

  return (
    <LoginContainer>
      <LogoImage src={Logo} text="ЦОЗМАИТ КБР" />
      <TypographyTitle>Мониторинг обращений граждан по КБР</TypographyTitle>

      <Box
        component="form"
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

        <TextFieldWithError onChange={(e) => setEmail(e.target.value)} label="Email" />

        <TextFieldWithError
          onChange={(e) => setPassword(e.target.value)}
          error={errors}
          label="Пароль"
        />

        {/* <FormControlLabel
          control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
          label="Запомнить меня"
          sx={{ mt: 1 }}
        /> */}

        <Button onClick={handleLogin} type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
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
