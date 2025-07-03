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
`;

const LogoContainer = styled('div')`
  display: flex;
  gap: 6px;
  flex-direction: column;
  width: fit-content;
  font-weight: 600;
  align-items: center;
`;
