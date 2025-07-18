import styled from 'styled-components';
import TypographyTitle from '../shared/TypographyTitle.jsx';
import StyledContainer from '../shared/StyledContainer.jsx';
import TitleWithDateRange from '../shared/TitleWithDateRange.jsx';
import ReportItem from '../features/ReportItem.jsx';
import { useState } from 'react';
import { reportStatus, reportsTitle } from '../app/constants.jsx';
import { Button } from '@mui/material';
import { postReq } from '../app/api/routes.js';
import biStore from '../app/store/store.js';
import { useMoList, useToast } from '../app/hooks.jsx';
import { Toast } from '../features/Toast.jsx';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PublishContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
`;

export default function Reports({ selectedRole }) {
  const moList = useMoList(selectedRole);
  const { addToast, toasts } = useToast();
  const [reports, setReports] = useState([
    {
      id: 0,
      title: reportsTitle.callCenter,
      status: reportStatus.notUploaded,
      error: '',
      data: [],
    },
    {
      id: 1,
      title: reportsTitle.secretary,
      status: reportStatus.notUploaded,
      error: '',
      data: [],
    },
    {
      id: 2,
      title: reportsTitle.pos,
      status: reportStatus.notUploaded,
      error: '',
      data: [],
    },
    {
      id: 3,
      title: reportsTitle.reception,
      status: reportStatus.notUploaded,
      error: '',
      data: [],
    },
    {
      id: 4,
      title: reportsTitle.press,
      status: reportStatus.notUploaded,
      error: '',
      data: [],
    },
  ]);

  const [isPublishBtnDisabled, setIsPublishBtnDisabled] = useState(true);

  function generateFlattenedReportData(reports) {
    console.log('moList', moList);
    return reports.flatMap((report) =>
      report.data.map((item) => ({
        fullName: item.fullName,
        appealDate: new Date(item.date),
        appealType: item.type,
        department: item.department,
        subject: item.subject,
        description: item.description,
        route: item.route,
        moId: moList.find((mo) => mo.name === item.department).id,
        status: item.status,
        reportingPeriodStartDate: report.reportingPeriodStartDate,
        reportingPeriodEndDate: report.reportingPeriodEndDate,
        agencyType: report.title,
        createdBy: report.userId,
        updatedBy: report.userId,
      }))
    );
  }

  const onPublishHandler = async () => {
    try {
      console.log('generateFlattenedReportData(reports)', reports);
      const res = await postReq('moderator/reports', {
        reports: generateFlattenedReportData(reports),
      });

      if (res?.message) addToast(res.message, 'success');
    } catch (err) {
      console.error('❌ Ошибка при публикации отчётов:', err);
      addToast(err?.message || 'Ошибка при сохранении отчётов', 'error');
    }
  };

  const onChangeReports = (rowId, key, data) => {
    setReports((prev) => {
      const updated = prev.map((el) => (el.id === rowId ? { ...el, [key]: data } : el));

      const allValid = updated.every((el) => el.status === reportStatus.success);
      setIsPublishBtnDisabled(!allValid);

      return updated;
    });
  };

  return (
    <BoardContainer>
      <TypographyTitle sx={{ textAlign: 'center' }}>Отчеты</TypographyTitle>
      <StyledContainer sx={{ flexDirection: 'column' }}>
        {reports.map((report) => (
          <ReportItem
            key={report.id}
            id={report.id}
            title={`${report.id + 1}. ${report.title}`}
            status={report.status}
            error={report.error}
            onChangeReports={onChangeReports}
          />
        ))}
        <PublishContainer>
          <TitleWithDateRange reports={reports} onChangeReports={onChangeReports} />
          <Button
            variant="contained"
            onClick={onPublishHandler}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#43A047' },
            }}
            disabled={isPublishBtnDisabled}
          >
            Опубликовать
          </Button>
        </PublishContainer>
      </StyledContainer>
      <Toast toasts={toasts} />
    </BoardContainer>
  );
}
