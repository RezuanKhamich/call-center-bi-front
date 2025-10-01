import { useState } from 'react';
import LogoImage from '../shared/LogoImage';
import Logo from '../assets/logo.svg';
import TypographyTitle from '../shared/TypographyTitle';
import { Box, Button, Typography } from '@mui/material';
import styled from 'styled-components';
import TextFieldWithError from '../shared/TextFieldWithError';
import { login, resetPassword } from '../app/auth';
import { roles } from '../app/constants';
import { customColors } from '../app/theme';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      // /forgot-password
      const data = await resetPassword(email);
      setErrors(null);
      if (data) {
        console.log('data', data);
        // if (data.user.role === roles.moderator.value) {
        //   window.location.href = '/moderator/dashboard';
        // } else if (data.user.role === roles.minister.value) {
        //   window.location.href = '/minister';
        // } else {
        //   window.location.href = '/mo';
        // }
      }
    } catch (err) {
      setErrors(err.message);
    }
  };

  return (
    <LoginContainer>
      <LogoImage src={Logo} text="ЦОЗМАИТ КБР" />
      <TypographyTitle>Мониторинг обращений граждан по КБР</TypographyTitle>
      <BoxWrapper component="form">
        {!isPasswordReset ? (
          <>
            <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
              Срок действия пароля истёк
            </Typography>
            {/* <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
              Сброс пароля
            </Typography> */}

            <Typography variant="body2" color="text.secondary" textAlign="center">
              {/* Введите адрес электронной почты, чтобы получить ссылку для сброса пароля */}
              Для восстановления доступа мы отправили ссылку на обновление пароля на вашу почту
            </Typography>

            {/* <TextFieldWithError
              onChange={(e) => setEmail(e.target.value)}
              error={errors}
              label="Email"
            /> */}
            <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/login')}>
              вернуться назад
            </Button>
            {/* <Button
              onClick={handleReset}
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Сбросить пароль
            </Button> */}
          </>
        ) : (
          <>
            <Typography variant="body1" gutterBottom textAlign="center">
              На адрес {email} отправлено письмо с ссылкой для сброса пароля
            </Typography>
          </>
        )}
      </BoxWrapper>
    </LoginContainer>
  );
}

const LoginContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  background-color: ${customColors.primary.backgroundLight};
  height: 100vh;
`;

const BoxWrapper = styled(Box)`
  width: 100%;
  max-width: 400px;
  margin: 64px auto 0;
  margin-top: 8px;
  padding: 32px;
  border-radius: 20px;
  box-shadow: ${customColors.boxShadow};
`;
