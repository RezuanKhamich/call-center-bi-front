import styled from 'styled-components';
import TypographyTitle from '../shared/TypographyTitle';
import { use, useEffect, useState } from 'react';
import biStore from '../app/store/store';
import { useGetUsers, useReportsLastMonthList, useToast } from '../app/hooks';
import StyledContainer from '../shared/StyledContainer';
import ReportItem from '../features/ReportItem';
import HistoryItem from '../features/HistoryItem';
import { formatDate } from '../app/tools';
import ModalConfirm from '../features/ModalConfim';
import { removeReportByDate } from '../app/requests';
import { Toast } from '../features/Toast';
import TypographyText from '../shared/TypographyText';
import { BorderBottom } from '@mui/icons-material';
import { Box, Skeleton } from '@mui/material';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function shortenFullName(fullName) {
  if (!fullName) return '';

  const parts = fullName.trim().split(' ');
  const [lastName, firstName, middleName] = parts;

  const initials =
    (firstName ? firstName[0] + '.' : '') + (middleName ? ' ' + middleName[0] + '.' : '');

  return `${lastName} ${initials}`.trim();
}

export default function History({ selectedRole }) {
  const [isEditing, setIsEditing] = useState(false);

  const { addToast, toasts } = useToast();
  const SKELETON_COUNT = 5;

  const reportsList = useReportsLastMonthList(selectedRole);
  const users = useGetUsers(selectedRole);
  const [reportByDate, setReportByDate] = useState([]);
  const rawReports = reportsList?.reportsList || [];
  const [reportIdForDelete, setReportIdForDelete] = useState(null);

  function groupReportsByPeriod(reports) {
    if (!Array.isArray(reports)) return [];

    const uniqueMap = new Map();

    reports.forEach((report) => {
      const start = report.reporting_period_start_date;
      const end = report.reporting_period_end_date;

      if (!start || !end) return;

      const key = `${start}|${end}`;

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          reporting_period_start_date: start,
          reporting_period_end_date: end,
          userName: shortenFullName(
            users?.users?.find((user) => user.id === report.created_by)?.full_name
          ),
          reports: [],
        });
      }

      uniqueMap.get(key).reports.push(report);
    });

    return Array.from(uniqueMap.values());
  }

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
    if (rawReports.length === 0 || !users?.users?.length) return;

    setReportByDate(groupReportsByPeriod(rawReports));
  }, [rawReports.length, users?.users]);

  return (
    <BoardContainer>
      <TypographyTitle sx={{ textAlign: 'center' }}>История публикаций</TypographyTitle>
      <TypographyText sx={{ textAlign: 'start' }}>
        Всего отчётов: {reportByDate.length}
      </TypographyText>
      {reportsList?.isLoading
        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <Box key={i} mb={2}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '10px' }} />
            </Box>
          ))
        : reportByDate.map((report, index) => (
            <HistoryItem
              key={report.id}
              index={index}
              userName={report.userName}
              status={report.status}
              startDate={formatDate(report.reporting_period_start_date)}
              endDate={formatDate(report.reporting_period_end_date)}
              error={report.error}
              showDeleteModal={() => setReportIdForDelete(index)}
              onEditHandler={onEditReport}
            />
          ))}
      {reportIdForDelete !== null && (
        <ModalConfirm
          text={`Вы уверены, что хотите удалить отчет за период
              ${formatDate(reportByDate[reportIdForDelete]?.reporting_period_start_date)} - ${formatDate(reportByDate[reportIdForDelete]?.reporting_period_end_date)}?
            `}
          confirmLabel="Да, удалить"
          onConfirm={onDeleteReport}
          color="red"
          onCancel={() => setReportIdForDelete(null)}
        />
      )}
      <Toast toasts={toasts} />
    </BoardContainer>
  );
}
