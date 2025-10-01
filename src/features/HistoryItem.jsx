import { Box, Button, Typography } from '@mui/material';

import styled from 'styled-components';
import Tag from '../shared/Tag';
import SubmitButton from '../shared/SubmitButton';
import { customColors } from '../app/theme';

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const BoldText = styled.span`
  font-weight: bold;
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 6px;
`;

const HistoryItem = ({
  id,
  userName,
  index,
  startDate,
  createdAt,
  endDate,
  showDeleteModal,
  onEditHandler,
}) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" gap={1}>
          <TagWrapper>
            <Tag text={userName} />
            <Tag
              color={customColors.primary.mainHover}
              text={new Date(createdAt).toLocaleDateString('ru-RU')}
            />
          </TagWrapper>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>
              {index + 1}. Отчет за период <BoldText>{startDate}</BoldText> –{' '}
              <BoldText>{endDate}</BoldText>
            </Typography>
          </Box>
        </Box>
        <ActionContainer>
          {/* <SubmitButton label="Изменить" onClickHandler={() => onEditHandler(id)} /> */}
          <SubmitButton
            label="Удалить"
            color="error"
            onClickHandler={() => showDeleteModal(true)}
          />
        </ActionContainer>
      </Box>
    </Box>
  );
};

export default HistoryItem;
