import { Box, Button, Typography } from '@mui/material';

import styled from 'styled-components';
import Tag from '../shared/Tag';
import SubmitButton from '../shared/SubmitButton';

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const BoldText = styled.span`
  font-weight: bold;
`;

const HistoryItem = ({
  id,
  userName,
  index,
  startDate,
  endDate,
  showDeleteModal,
  onEditHandler,
}) => {
  return (
    <Box
    // borderRadius="8px"
    // border="1px solid #d0d7de;"
    // justifyContent="space-between"
    // alignItems="center"
    // p={2}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Tag text={userName} />
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>
              {index + 1}. Отчет за период <BoldText>{startDate}</BoldText> –{' '}
              <BoldText>{endDate}</BoldText>
            </Typography>
          </Box>
        </Box>
        <ActionContainer>
          <SubmitButton label="Изменить" onClickHandler={() => onEditHandler(id)} />
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
