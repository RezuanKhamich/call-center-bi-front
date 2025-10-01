import styled from 'styled-components';
import TypographyTitle from '../shared/TypographyTitle';
import StyledContainer from '../shared/StyledContainer';
import HistoryItem from '../features/HistoryItem';
import ModalConfirm from '../features/ModalConfim';
import TypographyText from '../shared/TypographyText';
import { formatDate } from '../app/tools';
import { removeReportByDate } from '../app/requests';
import { Toast } from '../features/Toast';
import { Box, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetReportHistory, useToast } from '../app/hooks';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default function History({ selectedRole }) {
  const [isEditing, setIsEditing] = useState(false);

  const { addToast, toasts } = useToast();
  const { reportHistory, isLoading } = useGetReportHistory(selectedRole);
  const SKELETON_COUNT = 5;

  const [reportByDate, setReportByDate] = useState([]);
  const [reportIdForDelete, setReportIdForDelete] = useState(null);

  const onDeleteReport = async () => {
    try {
      const res = await removeReportByDate(
        reportByDate[reportIdForDelete].reporting_period_start_date
      );
      if (res.message) {
        addToast(res.message, 'success');
        setReportByDate((prev) =>
          prev.filter(
            (el) =>
              el.reporting_period_start_date !==
              reportByDate[reportIdForDelete].reporting_period_start_date
          )
        );
      }
    } catch (err) {
      console.error('❌ Ошибка при удалении отчётов:', err);
      addToast(err?.message || 'Ошибка при удалении отчётов', 'error');
    } finally {
      setReportIdForDelete(null);
    }
  };

  const onEditReport = (report) => {};

  useEffect(() => {
    if (reportHistory?.length === 0) return;
    setReportByDate(reportHistory);
  }, [reportHistory?.length]);

  return (
    <BoardContainer>
      <TypographyTitle sx={{ textAlign: 'center' }}>История публикаций</TypographyTitle>
      <TypographyText sx={{ textAlign: 'start' }}>
        Всего отчётов: {reportByDate.length}
      </TypographyText>
      {isLoading
        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <Box key={i} mb={1}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '10px' }} />
            </Box>
          ))
        : reportByDate.map((report, index) => (
            <StyledContainer sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <HistoryItem
                key={report.id}
                index={index}
                createdAt={report.createdAt}
                userName={report.userName}
                status={report.status}
                startDate={formatDate(report.reporting_period_start_date)}
                endDate={formatDate(report.reporting_period_end_date)}
                error={report.error}
                showDeleteModal={() => setReportIdForDelete(index)}
                onEditHandler={onEditReport}
              />
            </StyledContainer>
          ))}

      {reportIdForDelete !== null && (
        <ModalConfirm
          text={`Вы уверены, что хотите удалить отчет за период
              ${formatDate(reportByDate[reportIdForDelete]?.reporting_period_start_date)} - ${formatDate(reportByDate[reportIdForDelete]?.reporting_period_end_date)}?
            `}
          confirmLabel="Да, удалить"
          onConfirm={onDeleteReport}
          color="#d32f2f"
          onCancel={() => setReportIdForDelete(null)}
        />
      )}
      <Toast toasts={toasts} />
    </BoardContainer>
  );
}
