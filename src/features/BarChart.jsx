import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const sampleData = [
  { day: 'Понедельник', all: 14000, resolved: 12000 },
  { day: 'Вторник', all: 17000, resolved: 13000 },
  { day: 'Среда', all: 6000, resolved: 22000 },
  { day: 'Чертверг', all: 16000, resolved: 7000 },
  { day: 'Пятница', all: 12000, resolved: 11000 },
  { day: 'Суббота', all: 17000, resolved: 14000 },
  { day: 'Воскресенье', all: 19000, resolved: 12000 },
];

export default function BarChart({ reportsList = sampleData }) {
  const ref = useRef();
  const [data, setData] = useState([]);

  function getAppealsByWeekday(reports) {
    if (!Array.isArray(reports)) return [];

    const weekdays = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье',
    ];

    const counter = {};

    for (const report of reports) {
      if (!report.appeal_date) continue;

      const date = new Date(report.appeal_date);
      const dayName = weekdays[date.getDay()];

      if (!counter[dayName]) {
        counter[dayName] = { day: dayName, all: 0, resolved: 0 };
      }

      counter[dayName].all += 1;
      if (report.status?.toLowerCase() === 'решен') {
        counter[dayName].resolved += 1;
      }
    }

    // Возвращаем в фиксированном порядке недели
    return weekdays.map((day) => counter[day] || { day, all: 0, resolved: 0 });
  }

  useEffect(() => {
    if (reportsList.length) setData(getAppealsByWeekday(reportsList));
  }, [reportsList]);

  useEffect(() => {
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll('*').remove();

    const svg = d3
      .select(ref.current)
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .rangeRound([0, width])
      .paddingInner(0.2);

    const x1 = d3
      .scaleBand()
      .domain(['all', 'resolved'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.all, d.resolved))])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal().domain(['all', 'resolved']).range([
      '#79d8df', // синий — все обращения
      '#8dd66b', // зелёный — решённые обращения
    ]);

    svg
      .append('g')
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', (d) => `translate(${x0(d.day)},0)`)
      .selectAll('rect')
      .data((d) => ['all', 'resolved'].map((key) => ({ key, value: d[key] })))
      .join('rect')
      .join('rect')
      .attr('x', (d) => x1(d.key))
      .attr('y', (d) => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', (d) => height - y(d.value))
      .attr('fill', (d) => color(d.key))
      .attr('rx', 4)
      .attr('ry', 4);

    // X Axis
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x0));

    // Y Axis
    svg.append('g').call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d}`)
    );

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${(width - 260) / 2}, 290)`);

    const categories = [
      { label: 'Все обращения', color: '#79d8df' },
      { label: 'Решены', color: '#8dd66b' },
    ];

    categories.forEach((cat, i) => {
      const g = legend.append('g').attr('transform', `translate(${i * 140}, 0)`);
      g.append('rect').attr('width', 12).attr('height', 12).attr('fill', cat.color);
      g.append('text').attr('x', 16).attr('y', 10).text(cat.label).style('font-size', '10px');
    });
  }, [data]);

  return <svg ref={ref} style={{ width: '50%', flex: 1, height: 'auto', padding: '20px' }} />;
}
