import styled from 'styled-components';
import TypographyTitle from '../shared/TypographyTitle';
import RoundRoleSelector from '../shared/RoundRoleSelector';
import StyledContainer from '../shared/StyledContainer';
import { useMoList, useReportsLastMonthList } from '../app/hooks';
import PieChart from '../features/PieChart';
import BarChart from '../features/BarChart';
import StyledTable from '../features/AppealTable';
import LegendItem from '../shared/LegendItem';
import { useState, useMemo, useEffect } from 'react';
import {
  appealStatusList,
  appealTypesList,
  reportsTitle,
  moListWithAbbr,
  roles,
  subjectsList,
} from '../app/constants';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import DateRangeFilter from '../shared/DateRangeFilter';
import { HexbinChart } from '../features/HexbinChart';
import biStore from '../app/store/store';
import dayjs from 'dayjs';
import { getReq } from '../app/api/routes';
import Logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import ModalConfirm from '../features/ModalConfim';
import LogoImage from '../shared/LogoImage';
import SubmitButton from '../shared/SubmitButton';

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${(props) =>
    props.selectedRole !== roles.moderator.value &&
    `
      max-width: 1440px;
      margin: auto;
      padding: 18px;
    `}
`;

const FilterSelected = styled(RoundRoleSelector)`
  & button {
    width: 100%;
  }
`;

const PageTitleContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Dashboard({ selectedRole }) {
  const reportsList = useReportsLastMonthList(selectedRole);
  const moList = useMoList(selectedRole);
  const setReportsList = biStore((state) => state.setReports);
  const navigate = useNavigate();

  const roleList = Object.values(roles).filter((el) =>
    el.value !== 'moderator' ? { value: el.value, label: el.label } : null
  );
  const departmentList = [
    { value: null, label: 'Все мед. организации' },
    ...moList.moList.map((el) => ({ value: el.id, label: el.name })),
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [appealType, setAppealType] = useState(appealTypeList[0].value);
  const [subject, setSubject] = useState(subjectList[0].value);
  const [department, setDepartment] = useState(departmentList[0].value);
  const [status, setStatus] = useState(statusList[0].value);
  const [agencyType, setAgencyType] = useState(agencyTypeList[0].value);
  const [selectedMO, setSelectedMO] = useState(null);
  const [filteredReports, setFilteredReports] = useState([]);

  const isReady = moList?.moList.length > 0 && reportsList?.reportsList?.length > 0;

  const onChangeStartDate = (date) => setStartDate(date);
  const onChangeEndDate = (date) => setEndDate(date);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    if (!reportsList?.reportsList?.length) return;

    const filtered = reportsList.reportsList.filter((report) => {
      const matchAgency = agencyType ? report.agency_type === agencyType : true;
      const matchMO = selectedMO ? report.department === selectedMO : true;
      return matchAgency && matchMO;
    });

    setFilteredReports(filtered);
  }, [reportsList.reportsList, agencyType, selectedMO]);

  const data = useMemo(() => {
    if (!isReady) return [];

    return moListWithAbbr.map((el) => {
      const stats = getMoReportStats(reportsList.reportsList, el.value);
      const mo = moList.moList.find((mo) => mo.name === el.value);

      return [el.abbr, stats.resolved, stats.total, mo?.id || null, el.value];
    });
  }, [moList.moList, reportsList]);

  const onApplyFiltersHandler = async () => {
    try {
      const params = new URLSearchParams();

      if (startDate) {
        params.append('reporting_period_start_date', dayjs(startDate).toISOString());
      }

      if (endDate) {
        params.append('reporting_period_end_date', dayjs(endDate).toISOString());
      }

      const res = await getReq(`${selectedRole}/reports-by-date?${params.toString()}`);
      const data = await res.json();

      console.log('Полученные отчёты:', data);
      setReportsList(data);
    } catch (err) {
      console.error('❌ Ошибка при получении отчётов:', err);
    }
  };

  return (
    <BoardContainer selectedRole={selectedRole}>
      {selectedRole !== roles.moderator.value ? (
        <PageTitleContainer>
          {/* <Box
            sx={{ p: 2, textAlign: 'center', display: 'flex', alignItems: 'center', gap: '20px' }}
          >
            <img src={Logo} alt="Logo" style={{ width: 80, height: 80, marginBottom: 8 }} />
            <Typography variant="h6" fontWeight="bold">
              ЦОЗМАИТ КБР
            </Typography>
          </Box> */}
          <LogoImage src={Logo} text="ЦОЗМАИТ КБР" />
          <TypographyTitle sx={{ textAlign: 'center' }}>Дашборд</TypographyTitle>
          <Button variant="outlined" size="small" onClick={() => setShowLogoutModal(true)}>
            Выйти из аккаунта
          </Button>
        </PageTitleContainer>
      ) : (
        <>
          <TypographyTitle sx={{ textAlign: 'center' }}>Дашборд</TypographyTitle>
          <RoundRoleSelector value={role} onChange={setRole} list={roleList} />
        </>
      )}
      <StyledContainer>
        <Box display="flex" justifyContent="space-between" gap={4} width="100%">
          <Box width={`${selectedRole !== roles.moderator.value ? '340px' : '400px'}`}>
            <Typography fontWeight="bold" mb={2}>
              Обращений за текущий период: {reportsList?.reportsList?.length}
            </Typography>
            <Stack spacing={1} mb={3}>
              <LegendItem color="#1e88e5" label="Всего обращений" />
              <LegendItem color="#43a047" label="Решены" />
            </Stack>

            <Typography fontWeight="bold" mb={2}>
              Фильтры
            </Typography>
            {(selectedMO || agencyType) && (
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {selectedMO && (
                  <Chip
                    label={selectedMO}
                    onDelete={() => setSelectedMO(null)}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {agencyType && (
                  <Chip
                    label={agencyType}
                    onDelete={() => setAgencyType(null)}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
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
              <SubmitButton onClickHandler={onApplyFiltersHandler} label="Применить" />
            </Stack>
          </Box>

          <Box
            flexGrow={1}
            display="flex"
            justifyContent="start"
            alignItems="center"
            sx={{ flex: '1 1 auto' }}
          >
            <HexbinChart
              data={data}
              onSelectHex={(e) => setSelectedMO(moList?.moList?.find((mo) => mo.id === e)?.name)}
            />
          </Box>
        </Box>
      </StyledContainer>
      {filteredReports.length === 0 ? (
        <StyledContainer sx={{ justifyContent: 'center' }}>
          <TypographyTitle sx={{ mb: 3, textAlign: 'center' }}>
            Отчеты по текущим фильтрам отсутствуют
          </TypographyTitle>
        </StyledContainer>
      ) : (
        <>
          <StyledContainer title={selectedMO ? `${selectedMO}` : 'Общая статистика'}>
            <PieChart reportsList={filteredReports} />
            <BarChart reportsList={filteredReports} />
          </StyledContainer>

          <StyledContainer title={selectedMO ? `Обращения от ${selectedMO}` : 'Все обращения'}>
            <StyledTable reportsList={filteredReports} />
          </StyledContainer>
        </>
      )}
      {showLogoutModal && (
        <ModalConfirm
          text="Вы уверены, что хотите выйти?"
          confirmLabel="Выйти"
          color="#d32f2f"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </BoardContainer>
  );
}
