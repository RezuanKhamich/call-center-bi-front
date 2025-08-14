import React from 'react';
import styled from 'styled-components';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { customColors } from '../app/theme';

export default function NotFound() {
  return (
    <Wrapper>
      <Icon />
      <Title>404 — Страница не найдена</Title>
      <Subtitle>
        Похоже, вы попали не туда. Возможно, страница была удалена или никогда не существовала.
      </Subtitle>
      <ButtonLink href="/">Вернуться на главную</ButtonLink>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: ${customColors.primary.backgroundLight};
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
`;

const Icon = styled(ErrorOutlineIcon)`
  font-size: 80px !important;
  color: ${customColors.primary.main};
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-weight: bold;
  color: ${customColors.primary.text};
  margin-bottom: 8px;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  color: ${customColors.primary.text};
  opacity: 0.7;
  max-width: 400px;
  margin-bottom: 24px;
  font-size: 1rem;
`;

const ButtonLink = styled.a`
  background-color: ${customColors.primary.main};
  color: ${customColors.primary.white};
  text-transform: none;
  font-size: 1rem;
  padding: 8px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${customColors.primary.accentBlue};
  }
`;
