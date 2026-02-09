import styled from 'styled-components';

export default function LogoImage({ src, text, sx, isNavLogo }) {
  return (
    <LogoContainer style={sx} isNavLogo={isNavLogo}>
      <Icon style={sx} src={src} alt="logo" isNavLogo={isNavLogo} />
      {text ? <span>{text}</span> : null}
    </LogoContainer>
  );
}

const Icon = styled('img')`
  width: 100px;
  height: 100px;
  position: relative;
  left: -14px;

  ${(p) => p.isNavLogo && `width: 40px; height: 40px; left: 0;`};
`;

const LogoContainer = styled('div')`
  display: flex;
  gap: 6px;
  flex-direction: column;
  width: 100%;
  font-weight: 600;
  align-items: center;

  ${(p) => p.isNavLogo && `flex-direction: row; gap: 10px;`};
`;
