import dayjs from 'dayjs';
import { styled } from 'styled-components';
import { moListWithAbbr } from '../app/constants';

export function CustomActivityTooltip({ active, payload, period }) {
  if (!active || !payload?.length) return null;

  const { date, users = [] } = payload[0].payload;

  let dateLabel;
  const moStats = new Map();

  const moAbbrMap = new Map(moListWithAbbr.map((m) => [m.id, m.abbr]));

  if (period === '90d') {
    const start = dayjs(date).startOf('week');
    const end = dayjs(date).endOf('week');

    dateLabel = `${start.format('DD.MM')} - ${end.format('DD.MM')}`;
  } else if (period === 'day') {
    // Если приходит уже строка "14:00"
    if (typeof date === 'string' && date.includes(':')) {
      dateLabel = date;
    } else {
      // Если приходит timestamp
      dateLabel = dayjs(date).format('HH:mm');
    }
  } else {
    dateLabel = dayjs(date).format('DD.MM.YYYY');
  }

  users.forEach((u) => {
    const moId = u.mo_id ?? 0;

    if (!moStats.has(moId)) {
      moStats.set(moId, {
        mo_id: moId,
        mo_name: moAbbrMap.get(moId) || '—',
        visits: 0,
        last_activity: u.last_activity,
      });
    }

    const entry = moStats.get(moId);
    entry.visits += u.visits || 0;

    if (
      u.last_activity &&
      (!entry.last_activity || dayjs(u.last_activity).isAfter(entry.last_activity))
    ) {
      entry.last_activity = u.last_activity;
    }
  });

  const rows = Array.from(moStats.values()).sort((a, b) => b.visits - a.visits);

  const isTwoColumns = users.length > 14;

  const totalVisits = rows.reduce((sum, r) => sum + r.visits, 0);

  return (
    <TooltipBox>
      <DateTitle>{dateLabel}</DateTitle>

      <Total>
        Всего посещений: <b>{totalVisits}</b>
      </Total>

      <UsersGrid $twoColumns={isTwoColumns}>
        {rows.map((mo) => (
          <UserRow key={mo.mo_id}>
            <Left>
              <MoName>{mo.mo_name}</MoName>
              <Time>
                {mo.last_activity ? `посл. ${dayjs(mo.last_activity).format('HH:mm')}` : '—'}
              </Time>
            </Left>

            {/* 🔥 КОЛИЧЕСТВО ПОСЕЩЕНИЙ МО */}
            <Visits>{mo.visits}</Visits>
          </UserRow>
        ))}
      </UsersGrid>
    </TooltipBox>
  );
}

const TooltipBox = styled.div`
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  min-width: 220px;
`;

const DateTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $twoColumns }) => ($twoColumns ? '1fr 1fr 1fr' : '1fr')};
  column-gap: 16px;
  row-gap: 6px;
`;

const UserRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
`;

const Total = styled.div`
  font-size: 13px;
  margin-bottom: 10px;
  color: #37474f;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const MoName = styled.div`
  font-size: 13px;
  font-weight: 500;
`;

const Time = styled.div`
  font-size: 12px;
  color: #78909c;
`;

const Visits = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1e88e5;
`;
