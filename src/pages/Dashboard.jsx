import styled from 'styled-components';
import TypographyTitle from '../shared/TypographyTitle';
import RoundRoleSelector from '../shared/RoundRoleSelector';
import StyledContainer from '../shared/StyledContainer';
import { useReportsLastMonthList } from '../app/hooks';
import PieChart from '../features/PieChart';
import BarChart from '../features/BarChart';
import StyledTable from '../features/AppealTable';
import LegendItem from '../shared/LegendItem';
import { useState, useMemo } from 'react';
import {
  appealStatusList,
  appealTypesList,
  reportsTitle,
  moListWithAbbr,
  roles,
  subjectsList,
} from '../app/constants';
import { Box, Button, Stack, Typography } from '@mui/material';
import DateRangeFilter from '../shared/DateRangeFilter';
import { HexbinChart } from '../features/HexbinChart';
import biStore from '../app/store/store';
import dayjs from 'dayjs';
import { getReq } from '../app/api/routes';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FilterSelected = styled(RoundRoleSelector)`
  & button {
    width: 100%;
  }
`;

export default function Dashboard() {
  const reportsList = useReportsLastMonthList();
  const setReportsList = biStore((state) => state.setReports);
  const moList = biStore((state) => state.moList);

  const roleList = Object.values(roles).filter((el) =>
    el.value !== 'moderator' ? { value: el.value, label: el.label } : null
  );
  const departmentList = [
    { value: null, label: 'Все мед. организации' },
    ...moList.map((el) => ({ value: el.id, label: el.name })),
  ];
  const agencyTypeList = [
    { value: null, label: 'Все ведомства' },
    ...Object.values(reportsTitle).map((el) => ({ value: el, label: el })),
  ];
  const appealTypeList = [
    { value: null, label: 'Все типы обращений' },
    ...appealTypesList.map((el, index) => ({ value: index, label: el })),
  ];
  const subjectList = [
    { value: null, label: 'Все темы обращений' },
    ...subjectsList.map((el, index) => ({ value: index, label: el })),
  ];
  const statusList = [
    { value: null, label: 'Все статусы' },
    ...Object.values(appealStatusList).map((el) => ({ value: el, label: el })),
  ];

  function getMoReportStats(reportsList, moName) {
    const filteredReports = reportsList.filter((report) => report.department === moName);

    const total = filteredReports.length;
    const resolved = filteredReports.filter(
      (report) => report.status?.toLowerCase() === 'решен'
    ).length;

    return { total, resolved };
  }

  const [role, setRole] = useState(roles.minister.value);
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month').startOf('day'));
  const [endDate, setEndDate] = useState(dayjs().endOf('day'));

  const [appealType, setAppealType] = useState(appealTypeList[0].value);
  const [subject, setSubject] = useState(subjectList[0].value);
  const [department, setDepartment] = useState(departmentList[0].value);
  const [status, setStatus] = useState(statusList[0].value);
  const [agencyType, setAgencyType] = useState(agencyTypeList[0].value);

  const isReady = moList?.length > 0 && reportsList?.reportsList?.length > 0;

  const onChangeStartDate = (date) => setStartDate(date);
  const onChangeEndDate = (date) => setEndDate(date);

  const data = useMemo(() => {
    if (!isReady) return [];

    return moListWithAbbr.map((el) => {
      const stats = getMoReportStats(reportsList.reportsList, el.value);
      const mo = moList.find((mo) => mo.name === el.value);

      return [el.abbr, stats.resolved, stats.total, mo?.id || null, el.value];
    });
  }, [moList, reportsList]);
  console.log('agencyType', agencyType);
  const onApplyFiltersHandler = async () => {
    try {
      const params = new URLSearchParams();

      if (startDate) {
        params.append('reporting_period_start_date', dayjs(startDate).toISOString());
      }

      if (endDate) {
        params.append('reporting_period_end_date', dayjs(endDate).toISOString());
      }

      if (agencyType) {
        params.append('agency_type', agencyType);
      }

      const res = await getReq(`moderator/reports-by-date?${params.toString()}`);
      const data = await res.json();

      console.log('Полученные отчёты:', data);
      setReportsList(data);
    } catch (err) {
      console.error('❌ Ошибка при получении отчётов:', err);
    }
  };

  return (
    <BoardContainer>
      <TypographyTitle sx={{ textAlign: 'center' }}>Дашборд</TypographyTitle>
      <RoundRoleSelector value={role} onChange={setRole} list={roleList} />
      <StyledContainer>
        <Box display="flex" justifyContent="space-between" gap={4} width="100%">
          <Box width="400px">
            <Typography fontWeight="bold" mb={2}>
              Обращений за текущий период: {reportsList?.reportsList?.length}
              {/* Обращений за период с {startDate} по {endDate} {reportsList?.reportsList?.length} */}
            </Typography>
            <Stack spacing={1} mb={3}>
              <LegendItem color="#1e88e5" label="Всего обращений" />
              <LegendItem color="#43a047" label="Решены" />
            </Stack>

            <Typography fontWeight="bold" mb={2}>
              Фильтры
            </Typography>
            <Stack spacing={1}>
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
              />
              {/* <FilterSelected value={department} onChange={setDepartment} list={departmentList} /> */}
              <FilterSelected value={agencyType} onChange={setAgencyType} list={agencyTypeList} />
              {/* <FilterSelected value={appealType} onChange={setAppealType} list={appealTypeList} /> */}
              {/* <FilterSelected value={subject} onChange={setSubject} list={subjectList} /> */}
              {/* <FilterSelected value={status} onChange={setStatus} list={statusList} /> */}
              <Button
                variant="contained"
                onClick={onApplyFiltersHandler}
                sx={{
                  backgroundColor: '#4CAF50',
                  width: '100%',
                  '&:hover': { backgroundColor: '#43A047' },
                }}
              >
                Применить
              </Button>
            </Stack>
          </Box>

          <Box
            flexGrow={1}
            display="flex"
            justifyContent="start"
            alignItems="center"
            sx={{ flex: '1 1 auto' }}
          >
            <HexbinChart data={data} onSelectHex={(e) => console.log(e)} />
          </Box>
        </Box>
      </StyledContainer>
      <StyledContainer title="Статистика">
        <PieChart reportsList={reportsList.reportsList} />
        <BarChart reportsList={reportsList.reportsList} />
      </StyledContainer>
      <StyledContainer title="Обращения">
        <StyledTable reportsList={reportsList.reportsList} />
      </StyledContainer>
    </BoardContainer>
  );
}
