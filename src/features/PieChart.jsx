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

    if (data.length === 1) {
      // Один сектор — центрируем текст
      svg
        .append('text')
        .text(data[0].value)
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'central')
        .style('fill', 'white')
        .style('font-size', '16px')
        .style('font-weight', 'bold');
    } else {
      // Несколько секторов — рисуем в каждом
      svg
        .selectAll('text')
        .data(data_ready)
        .enter()
        .append('text')
        .text((d) => d.data.value)
        .attr('transform', (d) => `translate(${arc.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'central')
        .style('fill', 'white')
        .style('font-size', '14px')
        .style('font-weight', 'bold');
    }

    // Draw legend
    const legend = d3
      .select(ref.current)
      .append('g')
      .attr('transform', `translate(${width + 10}, 20)`);

    // const legendItem = legend
    //   .selectAll('g')
    //   .data(data)
    //   .enter()
    //   .append('g')
    //   .attr('transform', (_, i) => `translate(0, ${i * 25})`);
    let offsetY = 0;

    const legendLines = data.map((d) => {
      const words = d.label.split(' ');
      const lines = [];
      let currentLine = '';

      words.forEach((word) => {
        if ((currentLine + ' ' + word).trim().length <= 20) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine.trim());
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine.trim());
      return { ...d, lines };
    });

    const legendItem = legend
      .selectAll('g')
      .data(legendLines)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        const y = offsetY;
        offsetY += d.lines.length * 20; // каждая строка — 20px
        return `translate(0, ${y})`;
      });

    legendItem
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d) => color(d.label));

    // Шаг 1: разбиваем строки заранее и сохраняем их в объект с количеством строк

    // Шаг 2: аккумулируем вертикальное смещение

    // Прямоугольник
    legendItem
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d) => color(d.label));

    // Текст с переносом
    legendItem
      .append('text')
      .attr('x', 24)
      .attr('y', 14)
      .style('font-size', '14px')
      .each(function (d) {
        const text = d3.select(this);
        d.lines.forEach((line, i) => {
          text
            .append('tspan')
            .attr('x', 24)
            .attr('dy', i === 0 ? 0 : '1.2em')
            .text(line);
        });
      });

    // legendItem
    //   .append('text')
    //   .attr('x', 24)
    //   .attr('y', 14)
    //   .style('font-size', '14px')
    //   .each(function (d) {
    //     const maxLineLength = 20; // макс. длина строки
    //     const words = d.label.split(' ');
    //     const lines = [];
    //     let currentLine = '';

    //     words.forEach((word) => {
    //       if ((currentLine + ' ' + word).trim().length <= maxLineLength) {
    //         currentLine += ' ' + word;
    //       } else {
    //         lines.push(currentLine.trim());
    //         currentLine = word;
    //       }
    //     });
    //     if (currentLine) lines.push(currentLine.trim());

    //     const text = d3.select(this);
    //     lines.forEach((line, i) => {
    //       text
    //         .append('tspan')
    //         .attr('x', 24)
    //         .attr('dy', i === 0 ? 0 : '1.2em')
    //         .text(line);
    //     });
    //   });
  }, [data]);

  return <svg ref={ref} style={{ width: '30%', flex: 0.5, height: 'auto' }} />;
}
