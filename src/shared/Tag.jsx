import styled from 'styled-components';
import { customColors } from '../app/theme';

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  background: ${(p) => p.color || customColors.charts.warningCustomers};
  border-radius: 12px;
  color: ${customColors.primary.text};
`;

const Tag = ({ color, text }) => (
  <Label className="tag" color={color}>
    {text}
  </Label>
);

export default Tag;
