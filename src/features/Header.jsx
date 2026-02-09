import styled from 'styled-components';
import { Button, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import TypographyTitle from '../shared/TypographyTitle';
import LogoImage from '../shared/LogoImage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { formatShortName } from '../app/tools';

export default function Header({ pageTitle, role, userName, onLogout }) {
  return (
    <HeaderWrapper>
      {/* Top row */}
      <TopRow>
        <LeftBlock>
          <LogoImage src={Logo} text="ЦОЗМАИТ КБР" isNavLogo />

          {role === 'minister' && (
            <NavWrapper>
              <NavItem to="/minister" end>
                Дашборд
              </NavItem>
              <NavDivider>|</NavDivider>
              <NavItem to="/minister/visits">Посещаемость</NavItem>
            </NavWrapper>
          )}
        </LeftBlock>

        <AccountBlock>
          <AccountCircleIcon fontSize="small" />
          <UserName>{formatShortName(userName)}</UserName>
          <LogoutButton variant="outlined" size="small" onClick={onLogout}>
            Выйти
          </LogoutButton>
        </AccountBlock>
      </TopRow>

      {/* Page title */}
      <TitleRow>
        <TypographyTitle>{pageTitle}</TypographyTitle>
      </TitleRow>
    </HeaderWrapper>
  );
}
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
`;

const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavItem = styled(NavLink)`
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  color: #546e7a;
  padding-bottom: 2px;

  &.active {
    color: #1e88e5;
    border-bottom: 2px solid #1e88e5;
  }

  &:hover {
    color: #1565c0;
  }
`;

const NavDivider = styled.span`
  color: #b0bec5;
  font-size: 14px;
`;

const AccountBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserName = styled(Typography)`
  && {
    font-size: 14px;
    font-weight: 500;
    color: #37474f;
    white-space: nowrap;
  }
`;

const LogoutButton = styled(Button)`
  && {
    font-size: 13px;
    padding: 4px 10px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 4px;
`;
