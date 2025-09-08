import styled from 'styled-components';
import TypographyTitle from '../shared/TypographyTitle';
import RoundRoleSelector from '../shared/RoundRoleSelector';
import StyledContainer from '../shared/StyledContainer';
import { useMoList, useReportsLastMonthList } from '../app/hooks';
import PieChart from '../features/PieChart';
import BarChart from '../features/BarChart';
import StyledTable from '../features/AppealTable';
import LegendItem from '../shared/LegendItem';
import { useState, useMemo, useCallback } from 'react';
import {
  appealStatusList,
  appealTypesList,
  reportsTitle,
  moListWithAbbr,
  roles,
  subjectsList,
  hexbinChartColours,
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

function getMoReportStats(reports, moName) {
  const filtered = reports.filter((r) => r.department === moName);
  const total = filtered.length;
  const resolved = filtered.filter((r) => r.status?.toLowerCase() === 'решен').length;
  return { total, resolved };
}

export default function Dashboard({ selectedRole }) {
  const reportsListData = useReportsLastMonthList(selectedRole);
  const moListData = useMoList(selectedRole);

  const setReportsList = biStore((state) => state.setReports);
  const navigate = useNavigate();

  // ----- Lists -----
  const roleList = useMemo(
    () =>
      Object.values(roles)
        .filter((el) => el.value !== 'moderator')
        .map((el) => ({ value: el.value, label: el.label })),
    []
  );

  const departmentList = useMemo(
    () => [
      { value: null, label: 'Все мед. организации' },
      ...(moListData?.moList || []).map((el) => ({ value: el.id, label: el.name })),
    ],
    [moListData?.moList]
  );

  const agencyTypeList = useMemo(
    () => [
      { value: null, label: 'Все ведомства' },
      ...Object.values(reportsTitle).map((el) => ({ value: el, label: el })),
    ],
    []
  );

  const appealTypeList = useMemo(
    () => [
      { value: null, label: 'Все типы обращений' },
      ...appealTypesList.map((el, i) => ({ value: i, label: el })),
    ],
    []
  );

  const subjectList = useMemo(
    () => [
      { value: null, label: 'Все темы обращений' },
      ...subjectsList.map((el, i) => ({ value: i, label: el })),
    ],
    []
  );

  const statusList = useMemo(
    () => [
      { value: null, label: 'Все статусы' },
      ...Object.values(appealStatusList).map((el) => ({ value: el, label: el })),
    ],
    []
  );

  const [role, setRole] = useState(roles.minister.value);
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month').startOf('day'));
  const [endDate, setEndDate] = useState(dayjs().endOf('day'));
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [appealType, setAppealType] = useState(appealTypeList[0].value);
  const [subject, setSubject] = useState(subjectList[0].value);
  const [department, setDepartment] = useState(departmentList[0].value);

  // Главные фильтры
  const [status, setStatus] = useState(statusList[0].value);
  const [agencyType, setAgencyType] = useState(agencyTypeList[0].value);

  // Фильтр по МО, который НЕ должен влиять на HexbinChart
  const [selectedMO, setSelectedMO] = useState(null);

  const onChangeStartDate = useCallback((date) => setStartDate(date), []);
  const onChangeEndDate = useCallback((date) => setEndDate(date), []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  // Данные из стора/хуков
  const listRaw = reportsListData?.reportsList || [];
  const mos = moListData?.moList || [];

  // 1) Базовая фильтрация (без selectedMO) — источник правды для HexbinChart
  const baseFilteredReports = useMemo(() => {
    return listRaw.filter((report) => {
      const matchAgency = agencyType ? report.agency_type === agencyType : true;
      // При желании сюда можно добавить другие глобальные фильтры (статус/типы/темы и т.п.)
      return matchAgency;
    });
  }, [listRaw, agencyType]);

  // 2) Отображаемая фильтрация (с selectedMO) — используется для карточек/графиков/таблицы
  const viewFilteredReports = useMemo(() => {
    if (!selectedMO) return baseFilteredReports;
    return baseFilteredReports.filter((r) => r.department === selectedMO);
  }, [baseFilteredReports, selectedMO]);

  // Данные для HexbinChart расчитываем от baseFilteredReports (чтобы выбор МО не влиял на карту)
  const hexbinData = useMemo(() => {
    return moListWithAbbr.map((el) => {
      const stats = getMoReportStats(baseFilteredReports, el.value);
      const mo = mos.find((mo) => mo.name === el.value);
      return [el.abbr, stats.resolved, stats.total, mo?.id || null, el.value];
    });
  }, [baseFilteredReports, mos]);

  const handleSelectHex = useCallback(
    (moId) => {
      const moName = mos.find((mo) => mo.id === moId)?.name || null;
      setSelectedMO(moName);
    },
    [mos]
  );

  const onApplyFiltersHandler = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('reporting_period_start_date', dayjs(startDate).toISOString());
      if (endDate) params.append('reporting_period_end_date', dayjs(endDate).toISOString());

      const res = await getReq(`${selectedRole}/reports-by-date?${params.toString()}`);
      setReportsList(res);
    } catch (err) {
      console.error('❌ Ошибка при получении отчётов:', err);
    }
  }, [endDate, selectedRole, setReportsList, startDate]);

  const totalInPeriod = useMemo(
    () => viewFilteredReports.filter((el) => el.created_at).length,
    [viewFilteredReports]
  );

  return (
    <BoardContainer selectedRole={selectedRole}>
      {selectedRole !== roles.moderator.value ? (
        <PageTitleContainer>
          <LogoImage src={Logo} sx={{ width: 'fit-content' }} text="ЦОЗМАИТ КБР" />
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
          {/* Sidebar */}
          <Box width={`${selectedRole !== roles.moderator.value ? '340px' : '400px'}`}>
            <Typography fontWeight="bold" mb={2}>
              Обращений за текущий период: {totalInPeriod}
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

            <Stack spacing={1} sx={{ marginBottom: '24px' }}>
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
              />

              {/* Пример выбора по ведомствам (активен) */}
              <FilterSelected value={agencyType} onChange={setAgencyType} list={agencyTypeList} />

              {/* Остальные фильтры по необходимости */}
              {/* <FilterSelected value={department} onChange={setDepartment} list={departmentList} /> */}
              {/* <FilterSelected value={appealType} onChange={setAppealType} list={appealTypeList} /> */}
              {/* <FilterSelected value={subject} onChange={setSubject} list={subjectList} /> */}
              {/* <FilterSelected value={status} onChange={setStatus} list={statusList} /> */}

              <SubmitButton onClickHandler={onApplyFiltersHandler} label="Применить" />
            </Stack>

            <Typography fontWeight="bold" mb={2}>
              Эффективность обработки обращений
            </Typography>

            <Box display="flex" flexDirection="column" gap={1}>
              {[...hexbinChartColours, { value : "Без обращений", color: '#79d8df' }].map((item, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '2px',
                      backgroundColor: item.color,
                      border: '1px solid #ccc',
                    }}
                  />
                  <Typography fontSize="14px" color="text.secondary">
                    {typeof item.value === 'string' ? item.value : `${item.value[0]} - ${item.value[1]}%`}
                  </Typography>
                </Box>
              ))}
            </Box>

          </Box>

          {/* Map */}
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="start"
            alignItems="center"
            sx={{ flex: '1 1 auto' }}
          >
            <HexbinChart
              data={hexbinData} // ← данные не зависят от selectedMO
              onSelectHex={handleSelectHex} // ← меняем только отображение ниже
            />
          </Box>
        </Box>
      </StyledContainer>

      {totalInPeriod === 0 ? (
        <StyledContainer sx={{ justifyContent: 'center' }}>
          <TypographyTitle sx={{ mb: 3, textAlign: 'center' }}>
            Отчеты по текущим фильтрам отсутствуют
          </TypographyTitle>
        </StyledContainer>
      ) : (
        <>
          <StyledContainer title={selectedMO ? `${selectedMO}` : 'Общая статистика'}>
            <PieChart reportsList={viewFilteredReports} />
            <BarChart reportsList={viewFilteredReports} />
          </StyledContainer>

          <StyledContainer title={selectedMO ? `Обращения от ${selectedMO}` : 'Все обращения'}>
            <StyledTable reportsList={viewFilteredReports} />
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
