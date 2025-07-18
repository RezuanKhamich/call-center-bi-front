import styled from 'styled-components';

export default function LogoImage({ src, text, sx }) {
  return (
    <LogoContainer>
      <Icon style={sx} src={src} alt="logo" />
      {text ? <span>{text}</span> : null}
    </LogoContainer>
  );
}

const Icon = styled('img')`
  width: 100px;
  height: 100px;
  position: relative;
  left: -14px;
`;

const LogoContainer = styled('div')`
  display: flex;
  gap: 6px;
  flex-direction: column;
  width: 100%;
  font-weight: 600;
  align-items: center;
`;
