import dayjs from 'dayjs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CustomActivityTooltip } from './CustomActivityTooltip';
import { useMemo } from 'react';

/* ---------------- helpers ---------------- */

function buildChartData(rawData, period, selectedMoId) {
  const daysMap = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
  };

  const days = daysMap[period];

  const start = dayjs()
    .subtract(days - 1, 'day')
    .startOf('day');
  const end = dayjs().startOf('day');

  let normalizedData = rawData.map((d) => {
    const filteredUsers = selectedMoId ? d.users.filter((u) => u.mo_id === selectedMoId) : d.users;

    const visits = filteredUsers.reduce((sum, u) => sum + (u.visits || 0), 0);

    return {
      date: d.date || d.week,
      visits,
      users: filteredUsers,
    };
  });

  if (period === '90d') {
    normalizedData = aggregateByWeek(normalizedData);
  } else {
    normalizedData = aggregateByDay(normalizedData);
  }

  const dataMap = new Map(normalizedData.map((d) => [dayjs(d.date).format('YYYY-MM-DD'), d]));

  const result = [];
  let cursor = start.startOf(period === '90d' ? 'week' : 'day');

  while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
    const key =
      period === '90d' ? cursor.startOf('week').format('YYYY-MM-DD') : cursor.format('YYYY-MM-DD');

    const existing = dataMap.get(key);

    result.push({
      date: key,
      visits: existing?.visits || 0,
      users: existing?.users || [],
    });

    cursor = cursor.add(1, period === '90d' ? 'week' : 'day');
  }

  return result;
}

function aggregateByDay(data) {
  const map = new Map();

  data.forEach((item) => {
    const dayKey = dayjs(item.date).startOf('day').format('YYYY-MM-DD');

    if (!map.has(dayKey)) {
      map.set(dayKey, {
        date: dayKey,
        visits: 0,
        users: [],
      });
    }

    const entry = map.get(dayKey);
    entry.visits += item.visits || 0;
    entry.users.push(...(item.users || []));
  });

  return Array.from(map.values());
}

function aggregateByWeek(data) {
  const map = new Map();

  data.forEach((item) => {
    const weekKey = dayjs(item.date).startOf('week').format('YYYY-MM-DD');

    if (!map.has(weekKey)) {
      map.set(weekKey, {
        date: weekKey,
        visits: 0,
        users: [],
      });
    }

    const entry = map.get(weekKey);
    entry.visits += item.visits || 0;
    entry.users.push(...(item.users || []));
  });

  return Array.from(map.values());
}

/* ---------------- chart ---------------- */

export function WeeklyActivityChart({ data = [], period = '7d', moMap = {}, selectedMoId = null }) {
  const chartData = useMemo(
    () => buildChartData(data, period, selectedMoId),
    [data, period, selectedMoId]
  );

  if (!chartData.length) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          interval={0}
          tickFormatter={(v) =>
            period === '90d' ? dayjs(v).format('DD.MM') : dayjs(v).format('DD.MM')
          }
          angle={-45}
          textAnchor="end"
          height={80}
          tickMargin={20}
        />
        <YAxis allowDecimals={false} tickCount={6} domain={[0, 'dataMax + 1']} />

        <Tooltip content={<CustomActivityTooltip moMap={moMap} period={period} />} />

        <Bar dataKey="visits" fill="#1e88e5" radius={[6, 6, 0, 0]} minPointSize={2} />
      </BarChart>
    </ResponsiveContainer>
  );
}
