import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { TextField, Typography, InputAdornment, IconButton, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import StyledContainer from '../shared/StyledContainer';
import Header from '../features/Header';
import ModalConfirm from '../features/ModalConfim';
import biStore from '../app/store/store';
import { getReq } from '../app/api/routes';
import { WeeklyActivityChart } from '../features/WeeklyActivityChart';
import { useMoList } from '../app/hooks';

/* ---------------- helpers ---------------- */

function getActivityStatus(lastActivity) {
  if (!lastActivity) return 'inactive';

  const minutes = dayjs().diff(dayjs(lastActivity), 'minute');
  if (minutes < 24 * 60) return 'active';
  if (minutes < 48 * 60) return 'warning';
  return 'inactive';
}

function formatLastActivity(lastActivity) {
  if (!lastActivity) return 'Нет активности';

  const now = dayjs();
  const last = dayjs(lastActivity);

  const minutes = now.diff(last, 'minute');
  if (minutes < 60) return `${minutes} мин назад`;

  const hours = now.diff(last, 'hour');
  if (hours < 24) return `${hours} ч назад`;
  if (hours < 48) return 'вчера';

  return `${Math.floor(hours / 24)} дн назад`;
}

const ACTIVITY_ENDPOINT_BY_PERIOD = {
  day: 'activity/summary/day',
  '7d': 'activity/summary/week',
  '30d': 'activity/summary/month',
  '90d': 'activity/summary/90days',
};

/* ---------------- component ---------------- */

export default function VisitsDashboard({ selectedRole }) {
  const navigate = useNavigate();
  const userInfo = biStore((s) => s.userInfo);
  const moListFromStore = biStore((s) => s.moList);
  const cozName =
    'Центр общественного здоровья, медицинской профилактики, медицинской аналитики и информационных технологий';

  const moListFromApi = useMoList(selectedRole);

  const moList = useMemo(() => {
    if (moListFromStore?.length) return moListFromStore?.filter((mo) => mo?.name !== cozName);
    if (moListFromApi?.length) return moListFromApi?.filter((mo) => mo?.name !== cozName);
    return [];
  }, [moListFromStore, moListFromApi]);

  const moMap = useMemo(() => {
    const map = new Map();
    moList.forEach((mo) => map.set(mo.id, mo.name));
    return map;
  }, [moList]);

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('7d');
  const [selectedMoId, setSelectedMoId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [moUsers, setMoUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'full_name', direction: 'asc' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /* -------- load activity -------- */

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setUsersLoading(true);
      try {
        const res = await getReq('minister/mo-users');
        if (!cancelled) setMoUsers(res);
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      setLoading(true);
      try {
        let url = `${selectedRole}/${ACTIVITY_ENDPOINT_BY_PERIOD[period]}`;

        if (period === 'day' && selectedDate) {
          url += `?date=${selectedDate}`;
        }

        const res = await getReq(url);
        if (!cancelled) setActivity(res);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (period !== 'day' || selectedDate) {
      loadActivity();
    }

    return () => {
      cancelled = true;
    };
  }, [selectedRole, period, selectedDate]);

  /* -------- filtering & sorting -------- */

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return moUsers.filter((u) => {
      const fullName = u.full_name?.toLowerCase() || '';
      const moName = u.med_organization?.name?.toLowerCase() || '';

      return !q || fullName.includes(q) || moName.includes(q);
    });
  }, [moUsers, search]);

  const sortedUsers = useMemo(() => {
    const arr = [...filteredUsers];

    arr.sort((a, b) => {
      if (sort.key === 'activity') {
        const aVal = a.last_activity ? dayjs().diff(a.last_activity, 'hour') : Infinity;
        const bVal = b.last_activity ? dayjs().diff(b.last_activity, 'hour') : Infinity;
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aVal = a[sort.key] || '';
      const bVal = b[sort.key] || '';

      return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return arr;
  }, [filteredUsers, sort]);

  const onSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  /* ---------------- render ---------------- */

  return (
    <BoardContainer>
      <Header
        role={selectedRole}
        userName={userInfo?.fullName || 'Пользователь'}
        onLogout={() => setShowLogoutModal(true)}
      />

      <ContentBox>
        {/* Chart */}
        <StyledContainer title="График посещаемости" sx={{ flexDirection: 'column' }}>
          <ChartHeader>
            <Typography variant="h6">Фильтры</Typography>

            <Filters>
              {period === 'day' && (
                <TextField
                  type="date"
                  size="small"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              )}

              <Select
                size="small"
                value={period}
                onChange={(e) => {
                  const value = e.target.value;
                  setPeriod(value);

                  if (value === 'day') {
                    const today = dayjs().format('YYYY-MM-DD');
                    setSelectedDate(today);
                  } else {
                    setSelectedDate(null);
                  }
                }}
              >
                <MenuItem value="day">День</MenuItem>
                <MenuItem value="7d">7 дней</MenuItem>
                <MenuItem value="30d">30 дней</MenuItem>
                <MenuItem value="90d">90 дней</MenuItem>
              </Select>

              <Select
                size="small"
                value={selectedMoId ?? 'all'}
                onChange={(e) =>
                  setSelectedMoId(e.target.value === 'all' ? null : Number(e.target.value))
                }
              >
                <MenuItem value="all">Все МО</MenuItem>
                {moList.map((mo) => (
                  <MenuItem key={mo.id} value={mo.id}>
                    {mo.name}
                  </MenuItem>
                ))}
              </Select>
            </Filters>
          </ChartHeader>

          <WeeklyActivityChart
            data={activity}
            period={period}
            selectedMoId={selectedMoId}
            moMap={moMap}
            loading={loading}
          />
        </StyledContainer>

        {/* Table */}
        <StyledContainer title="Список пользователей" sx={{ flexDirection: 'column' }}>
          <SearchWrapper>
            <TextField
              size="small"
              fullWidth
              placeholder="Поиск по ФИО или МО"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </SearchWrapper>

          <Table>
            <thead>
              <tr>
                <Th>№</Th>
                <Th onClick={() => onSort('full_name')}>ФИО</Th>
                <Th>МО</Th>
                <Th onClick={() => onSort('last_activity')}>Дата посещения</Th>
                <Th onClick={() => onSort('activity')}>Последняя активность</Th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td colSpan={5}>
                    <TableLoader>
                      <CircularProgress size={28} />
                    </TableLoader>
                  </td>
                </tr>
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState>Нет данных</EmptyState>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((u, index) => (
                  <Tr key={u.id}>
                    <Td>{index + 1}</Td>
                    <Td>{u.full_name}</Td>
                    <Td>{u.med_organization?.name}</Td>
                    <Td bold>
                      {u.last_activity ? dayjs(u.last_activity).format('HH:mm | DD.MM.YYYY') : '—'}
                    </Td>
                    <Td>
                      <StatusWrapper>
                        <StatusDot status={getActivityStatus(u.last_activity)} />
                        <StatusText>{formatLastActivity(u.last_activity)}</StatusText>
                      </StatusWrapper>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        </StyledContainer>
      </ContentBox>

      {showLogoutModal && (
        <ModalConfirm
          text="Вы уверены, что хотите выйти?"
          confirmLabel="Выйти"
          color="#d32f2f"
          onConfirm={() => {
            localStorage.clear();
            navigate('/login');
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </BoardContainer>
  );
}

/* ---------------- styles ---------------- */

const BoardContainer = styled.div`
  max-width: 1440px;
  margin: auto;
  padding: 18px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 38px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Filters = styled.div`
  display: flex;
  gap: 8px;
`;

const SearchWrapper = styled.div`
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  cursor: pointer;
  border-bottom: 2px solid #e0e0e0;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #fafafa;
  }
  &:hover {
    background-color: #e3f2fd;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;

  ${({ bold }) =>
    bold
      ? `
    font-weight: 600;
    font-size: 12px;
  `
      : null}
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusText = styled.span`
  font-size: 13px;
  color: #607d8b;
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ status }) =>
    status === 'active' ? '#43a047' : status === 'warning' ? '#fbc02d' : '#e53935'};
`;

const TableLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #78909c;
  font-size: 14px;
`;
