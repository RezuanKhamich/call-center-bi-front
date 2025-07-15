import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { subjectsList } from '../app/constants';

const colors = d3.schemeCategory10;

const sampleData = [
  { label: 'Лекарственное обеспечение', value: 65 },
  { label: 'Прочие вопросы', value: 20 },
  { label: 'Электронный медицинский документ', value: 10 },
  { label: 'Прочие вопросы', value: 2 },
  { label: 'Лекарственное обеспечение', value: 1 },
  { label: 'Электронный медицинский документ', value: 2 },
];

export default function PieChart({ reportsList = sampleData }) {
  const ref = useRef();

  const getSubjectDistribution = (reports) => {
    if (!Array.isArray(reports)) return [];

    const counter = {};

    for (const report of reports) {
      const subject = report.subject;
      if (!subject) continue;

      const matched = subjectsList.find((s) => s === subject) || 'Прочие вопросы';

      counter[matched] = (counter[matched] || 0) + 1;
    }

    return Object.entries(counter).map(([label, value]) => ({ label, value }));
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(getSubjectDistribution(reportsList));
  }, [reportsList]);

  useEffect(() => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    d3.select(ref.current).selectAll('*').remove(); // clear svg

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width + 200} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d.value);
    const data_ready = pie(data);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(colors);

    // Draw pie
    svg
      .selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Draw legend
    const legend = d3
      .select(ref.current)
      .append('g')
      .attr('transform', `translate(${width + 10}, 20)`);

    const legendItem = legend
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(0, ${i * 25})`);

    legendItem
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d) => color(d.label));

    legendItem
      .append('text')
      .attr('x', 24)
      .attr('y', 14)
      .text((d) => d.label)
      .style('font-size', '16px');
  }, [data]);

  return <svg ref={ref} style={{ width: '30%', flex: 0.5, height: 'auto' }} />;
}
