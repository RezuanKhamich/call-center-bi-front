import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { customColors } from '../app/theme';

const colours = [
  {
    value: [85, 100],
    color: '#8dd66b', // мягкий светло-зелёный
  },
  {
    value: [60, 84],
    color: '#f4dd75', // светло-жёлтый, тёплый и спокойный
  },
  {
    value: [0, 59],
    color: '#f77e7e', // мягкий кораллово-красный
  },
];

export const HexbinChart = ({ data = [], onSelectHex }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Проверка на наличие данных
    if (!Array.isArray(data) || data.length === 0) return;
    // Удаление пустых/некорректных записей
    const sanitizedData = data
      .filter((d) => Array.isArray(d) && d.length > 0)
      .map((d) => {
        // Дополняем значениями null, если не хватает данных
        const filled = [...d];
        while (filled.length < 3) filled.push(null);
        return filled;
      });

    if (sanitizedData.length === 0) return;

    const radius = 70;
    const hexbinGenerator = hexbin().radius(radius);
    const hexWidth = Math.sqrt(3) * radius;
    const hexHeight = 2 * radius * 0.75;

    const cols = Math.ceil(Math.sqrt(sanitizedData.length));
    const rows = Math.ceil(sanitizedData.length / cols);

    const width = 1000;
    const height = 800;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', width)
      .style('background-color', 'white')
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${120},${height / 5})`);

    const hexData = sanitizedData.map((d, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const xOffset = col * hexWidth + (row % 2 ? hexWidth / 2 : 0);
      const yOffset = row * hexHeight;
      return {
        x: xOffset,
        y: yOffset,
        id: index,
        moId: d[3],
        label: d[0],
        values: d?.slice(1),
        moName: d[4],
      };
    });

    const getColor = (resolved, total) => {
      if (!total || total === 0) return '#79d8df'; // голубой

      const percent = (resolved / total) * 100;

      const matchingColour = colours.find(
        (range) => percent >= range.value[0] && percent <= range.value[1]
      );

      return matchingColour?.color || '#ccc';
    };

    const hexGroups = g
      .selectAll('.hex-group')
      .data(hexData)
      .enter()
      .append('g')
      .attr('class', 'hex-group')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`);

    // Добавляем шестиугольники внутрь групп
    hexGroups
      .append('path')
      .attr('class', 'hexagon')
      .attr('id', (d) => `hex-${d.id}`)
      .attr('d', hexbinGenerator.hexagon(0))
      .attr('fill', (d) => getColor(d.values[0], d.values[1]))
      .attr('stroke', customColors.primary.backgroundLight)
      .attr('d', (d) => hexbinGenerator.hexagon(radius)); // Анимация появления соты

    // Добавляем текстовые метки внутрь групп
    const labelTopGroup = hexGroups
      .append('g')
      .attr('class', 'label-top-group')
      .attr('transform', 'translate(0, -30)');

    // квадрат перед текстом
    labelTopGroup
      .append('rect')
      .attr('x', -32) // сместить влево от текста
      .attr('y', -3)
      .attr('width', 12)
      .attr('height', 12)
      .attr('opacity', 0)
      .attr('fill', 'green') // или d.color, если динамически
      .attr('rx', 2) // скругление
      .attr('opacity', 1)
      .attr('transform', 'scale(1)');

    // текст рядом с квадратом - Значение 1
    labelTopGroup
      .append('text')
      .attr('class', 'label-top')
      .attr('x', -16)
      .attr('y', 4)
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .attr('fill', customColors.primary.text)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text((d) => (d?.values[0] != undefined ? `${d.values[0]}` : ''));

    hexGroups
      .append('text')
      .attr('class', 'label-center')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', customColors.primary.text)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .each(function (d, i) {
        const textEl = d3.select(this);
        const words = d?.label?.split(' ') || [];
        const lines = [];

        for (let j = 0; j < words.length; j += 2) {
          lines.push(words.slice(j, j + 2).join(' '));
        }
        lines.forEach((line, lineIndex) => {
          textEl
            .append('tspan')
            .attr('x', 0)
            .attr('dy', lineIndex === 0 ? 0 : 14)
            .text(line)
            .style('opacity', 0)
            .style('opacity', 1);
        });
      });

    const labelBottomGroup = hexGroups
      .append('g')
      .attr('class', 'label-bottom-group')
      .attr('transform', 'translate(0, 30)');

    // квадрат перед нижним текстом
    labelBottomGroup
      .append('rect')
      .attr('x', -32) // смещение влево
      .attr('y', -3)
      .attr('width', 12)
      .attr('height', 12)
      .attr('opacity', 0)
      .attr('fill', '#1e88e5') // голубой
      .attr('rx', 2) // немного скруглён
      .attr('opacity', 1)
      .attr('transform', 'scale(1)');

    // текст нижнего значения
    labelBottomGroup
      .append('text')
      .attr('class', 'label-bottom')
      .attr('x', -16) // смещение, чтобы не налегал на квадрат
      .attr('y', 4)
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .attr('fill', customColors.primary.text)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text((d) => (d?.values[1] != undefined ? `${d.values[1]}` : ''));

    // Добавляем текст в SVG (по умолчанию невидимый)
    const hoverText = g
      .append('text')
      .attr('class', 'hover-label')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', customColors.primary.text)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .style('opacity', 0); // Скрываем по умолчанию

    hexGroups
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .raise() // Поднимаем группу наверх
          .transition()
          .duration(300)
          .attr('transform', `translate(${d.x}, ${d.y}) scale(1.4)`); // Увеличение с анимацией

        // Показываем текст с анимацией
        hoverText
          .text(d.moName)
          .attr('x', width / 2.5)
          .attr('y', -140)
          .transition()
          .duration(300)
          .style('opacity', 1);
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('transform', `translate(${d.x}, ${d.y}) scale(1)`); // Плавное уменьшение

        // Скрываем текст
        hoverText.transition().duration(300).style('opacity', 0);
      })
      .on('click', function (event, d) {
        if (typeof onSelectHex === 'function') {
          console.log('d', d);
          onSelectHex(d.moId);
        }
      });
  }, [data]);

  return <svg ref={svgRef} />;
};
