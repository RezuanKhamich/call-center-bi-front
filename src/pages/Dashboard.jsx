import styled from 'styled-components';
import TypographyTitle from '../shared/TypographyTitle';
import RoundRoleSelector from '../shared/RoundRoleSelector';
import StyledContainer from '../shared/StyledContainer';
import { useMoList, useReportsLastMonthList } from '../app/hooks';
import PieChart from '../features/PieChart';
import BarChart from '../features/BarChart';
import StyledTable from '../features/AppealTable';
import LegendItem from '../shared/LegendItem';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { reportsTitle, moListWithAbbr, roles, hexbinChartColours } from '../app/constants';
import { Button, Chip, Stack, Typography } from '@mui/material';
import DateRangeFilter from '../shared/DateRangeFilter';
import { HexbinChart } from '../features/HexbinChart';
import biStore from '../app/store/store';
import dayjs from 'dayjs';
import { getReq, postReq } from '../app/api/routes';
import Logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import ModalConfirm from '../features/ModalConfim';
import LogoImage from '../shared/LogoImage';
import SubmitButton from '../shared/SubmitButton';
import { useToast } from '../app/hooks';
import { Toast } from '../features/Toast';

function getMoReportStats(reports, moName) {
  const filtered = reports.filter((r) => r.department === moName);
  const total = filtered.length;
  const resolved = filtered.filter((r) => r.status?.toLowerCase() === 'решен').length;
  return { total, resolved };
}

export default function Dashboard({ selectedRole }) {
  const userInfo = biStore((state) => state.userInfo);
  const userRole = userInfo?.role;
  const attachedMoId = userInfo?.moId;
  const { reportsList, refetch } = useReportsLastMonthList(selectedRole);
  const moListData = useMoList(selectedRole);

  const setReportsList = biStore((state) => state.setReports);
  const navigate = useNavigate();

  // ----- Lists -----
  const departmentList = useMemo(
    () => [
      { value: null, label: 'Все мед. организации' },
      ...(moListData?.moList || []).map((el) => ({ value: el.id, label: el.name })),
    ],
    [moListData?.moList]
  );

  const agencyTypeList = useMemo(
    () => [{ value: null, label: 'Все ведомства' }, ...Object.values(reportsTitle)],
    []
  );
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month').startOf('day'));
  const [endDate, setEndDate] = useState(dayjs().endOf('day'));
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [updatedReports, setUpdatedReports] = useState([]);
  const { addToast, toasts } = useToast();
  const [agencyType, setAgencyType] = useState({});
  const [selectedMO, setSelectedMO] = useState(null);

  const onChangeStartDate = useCallback((date) => setStartDate(date), []);
  const onChangeEndDate = useCallback((date) => setEndDate(date), []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const listRaw = reportsList || [];
  const mos = moListData?.moList || [];

  const baseFilteredReports = useMemo(() => {
    return listRaw.filter((report) => {
      const matchAgency = agencyType?.value ? report.agency_type === agencyType.value : true;
      return matchAgency;
    });
  }, [listRaw, agencyType?.value]);

  const viewFilteredReports = useMemo(() => {
    const mergedReports = baseFilteredReports.map((report) => {
      const updated = updatedReports.find((u) => u.id === report.id);
      return updated
        ? {
            ...report,
            status: updated.status || report.status,
            department: updated.department || report.department,
            moId: updated.moId || report.moId,
          }
        : report;
    });

    if (!selectedMO) return mergedReports;
    return mergedReports.filter((r) => r.department === selectedMO);
  }, [baseFilteredReports, selectedMO, updatedReports]);

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

  const saveChangedReports = async () => {
    try {
      const res = await postReq(`${userRole}/reports/update-reports`, {
        updates: updatedReports,
      });

      if (res?.message) {
        refetch();
        setUpdatedReports([]);
        addToast(res.message, 'success');
      }
    } catch (err) {
      console.error('❌ Ошибка при сохранении статусов:', err);
      addToast(err?.message || 'Ошибка при сохранении статусов', 'error');
    }
  };

  const onApplyFiltersHandler = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('reporting_period_start_date', dayjs(startDate).toISOString());
      if (endDate) params.append('reporting_period_end_date', dayjs(endDate).toISOString());
      if (attachedMoId) params.append('mo_id', attachedMoId);

      const res = await getReq(`${selectedRole}/reports-by-date?${params.toString()}`);
      setReportsList(res);
    } catch (err) {
      console.error('❌ Ошибка при получении отчётов:', err);
    }
  }, [endDate, userRole, setReportsList, startDate, attachedMoId]);

  const totalInPeriod = useMemo(
    () => viewFilteredReports.filter((el) => el.created_at).length,
    [viewFilteredReports]
  );

  useEffect(() => {
    const newAgency =
      selectedRole === roles['agency-moderator'].value
        ? agencyTypeList.find((el) => el.value === userInfo?.agencyType)
        : agencyTypeList[0];

    setAgencyType(newAgency);
  }, [selectedRole, userInfo]);

  useEffect(() => {
    if (attachedMoId && mos?.length) handleSelectHex(attachedMoId);
  }, [attachedMoId, mos, handleSelectHex]);

  return (
    <BoardContainer role={userRole}>
      {userRole !== roles.moderator.value || userRole !== roles['agency-moderator'].value ? (
        <PageTitleContainer>
          <LogoImage src={Logo} sx={{ width: 'fit-content' }} text="ЦОЗМАИТ КБР" />
          <TypographyTitleStyled>Дашборд</TypographyTitleStyled>
          <LogoutButton variant="outlined" size="small" onClick={() => setShowLogoutModal(true)}>
            Выйти из аккаунта
          </LogoutButton>
        </PageTitleContainer>
      ) : (
        <ModeratorHeader>
          <TypographyTitleStyled>Дашборд</TypographyTitleStyled>
        </ModeratorHeader>
      )}

      <StyledContainer>
        <MainLayout>
          <Sidebar
            width={
              userRole !== roles.moderator.value || userRole !== roles['agency-moderator'].value
                ? '340px'
                : '400px'
            }
          >
            <InfoTitle>Обращений за текущий период: {totalInPeriod}</InfoTitle>

            <LegendWrapper>
              <LegendItem color="#1e88e5" label="Всего обращений" />
              <LegendItem color="#43a047" label="Решены" />
            </LegendWrapper>

            <InfoTitle>Фильтры</InfoTitle>

            {(selectedMO || agencyType) && (
              <ChipWrapper>
                {selectedMO && selectedRole !== roles.mo.value && (
                  <Chip
                    label={selectedMO}
                    onDelete={() => setSelectedMO(null)}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {agencyType.value && selectedRole !== roles['agency-moderator'].value && (
                  <Chip
                    label={agencyType?.label}
                    onDelete={() => setAgencyType(agencyTypeList[0])}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </ChipWrapper>
            )}

            <FilterStack>
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
              />
              {selectedRole !== roles['agency-moderator'].value && (
                <FilterSelected
                  value={agencyType?.label}
                  onChange={setAgencyType}
                  list={agencyTypeList}
                />
              )}

              <SubmitButton onClickHandler={onApplyFiltersHandler} label="Применить" />
            </FilterStack>

            <InfoTitle>Эффективность обработки обращений</InfoTitle>

            <LegendColorList>
              {[...hexbinChartColours, { value: 'Без обращений', color: '#79d8df' }].map(
                (item, idx) => (
                  <LegendColorItem key={idx}>
                    <LegendColorBox color={item.color} />
                    <Typography fontSize="14px" color="text.secondary">
                      {typeof item.value === 'string'
                        ? item.value
                        : `${item.value[0]} - ${item.value[1]}%`}
                    </Typography>
                  </LegendColorItem>
                )
              )}
            </LegendColorList>
          </Sidebar>

          {/* Map */}
          <MapContainer>
            <HexbinChart
              data={hexbinData}
              onSelectHex={attachedMoId ? null : handleSelectHex}
              attachedMoId={attachedMoId}
            />
          </MapContainer>
        </MainLayout>
      </StyledContainer>

      {totalInPeriod === 0 ? (
        <StyledContainerCenter>
          <TypographyTitleStyled>Отчеты по текущим фильтрам отсутствуют</TypographyTitleStyled>
        </StyledContainerCenter>
      ) : (
        <>
          <StyledContainer title={selectedMO ? `${selectedMO}` : 'Общая статистика'}>
            <PieChart reportsList={viewFilteredReports} />
            <BarChart reportsList={viewFilteredReports} />
          </StyledContainer>

          <StyledContainer
            sx={{ flexDirection: 'row' }}
            title={selectedMO ? `Обращения в ${selectedMO}` : 'Все обращения'}
          >
            <StyledTable
              reportsList={viewFilteredReports}
              saveChangedReports={saveChangedReports}
              role={userRole}
              departmentList={departmentList}
              updatedReports={updatedReports}
              setUpdatedReports={setUpdatedReports}
            />
          </StyledContainer>
        </>
      )}
      <Toast toasts={toasts} />

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
    (props.role !== roles.moderator.value || props.role !== roles['agency-moderator'].value) &&
    `
      max-width: 1440px;
      margin: auto;
      padding: 18px;
    `}
`;

const PageTitleContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TypographyTitleStyled = styled(TypographyTitle)`
  text-align: center;
`;

const LogoutButton = styled(Button)`
  && {
    font-size: 14px;
  }
`;

const ModeratorHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const MainLayout = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  width: 100%;
`;

const Sidebar = styled.div`
  width: ${(props) => props.width};
  display: flex;
  flex-direction: column;
`;

const InfoTitle = styled(Typography)`
  && {
    font-weight: bold;
    margin-bottom: 8px;
  }
`;

const LegendWrapper = styled(Stack)`
  margin-bottom: 24px;
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterStack = styled(Stack)`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LegendColorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendColorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColorBox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background-color: ${(props) => props.color};
  border: 1px solid #ccc;
`;

const MapContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const StyledContainerCenter = styled(StyledContainer)`
  justify-content: center;
  align-items: center;
`;

const FilterSelected = styled(RoundRoleSelector)`
  & button {
    width: 100%;
  }
`;
