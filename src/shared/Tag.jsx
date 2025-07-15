import styled from 'styled-components';

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  background: #ffa500;
  border-radius: 12px;
`;

const Tag = ({ text }) => <Label className="tag">{text}</Label>;

export default Tag;
