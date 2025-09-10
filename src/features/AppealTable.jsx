import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { customColors } from '../app/theme';
import { Select, MenuItem } from '@mui/material';
import { appealStatusList } from '../app/constants';
import { roles } from '../app/constants';

export default function StyledTable({ reportsList = [], role, updatedReports, setUpdatedReports }) {
  const [data, setData] = useState([]);

  const onStatusChange = (value, report) => {
    setUpdatedReports(prev => {
      const exists = prev.find(el => el.id === report.id);
      if (exists) {
        if (value === report.status) {
          return prev.filter(el => el.id !== report.id);
        }
        return prev.map(el =>
          el.id === report.id ? { ...el, status: value } : el
        );
      }
      return [...prev, { id: report.id, status: value }];
    });

    // синхронно обновляем локальные данные
    setData(prev =>
      prev.map(r => (r.id === report.id ? { ...r, status: value } : r))
    );
  };

  useEffect(() => {
    setData(reportsList);
  }, [reportsList]);

  return (
    <ScrollWrapper>
      <Table>
        <thead>
          <tr>
            <Th>ФИО</Th>
            <Th>Суть обращения</Th>
            <Th>Маршрут</Th>
            <Th>Тип</Th>
            <Th>Тема</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isUpdated = updatedReports.some(u => u.id === row.id);
            return (
              <Row key={i} resolved={row.status} updated={isUpdated}>
                <Td>
                  {i + 1}. {row.full_name}
                </Td>
                <Td>{row.description}</Td>
                <Td>{row.route}</Td>
                <Td>{row.appeal_type}</Td>
                <Td>{row.subject}</Td>
                <Td>
                  {
                    role === roles.moderator.value ? (
                      <Select
                        value={row.status}
                        onChange={e => onStatusChange(e.target.value, row)}
                        size="small"
                      >
                        {appealStatusList.map((status, i) => (
                          <MenuItem key={i} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : 
                      row.status
                  }
                </Td>
              </Row>
            );
          })}
        </tbody>
      </Table>
    </ScrollWrapper>
  );
}

const ScrollWrapper = styled.div`
  max-height: 900px;
  width: 100%;
  overflow-y: auto;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-family: sans-serif;
`;

const Th = styled.th`
  background-color: ${customColors.primary.main};
  color: white;
  padding: 10px;
  text-align: left;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #d0d0d0;
  font-size: 14px;
  vertical-align: top;
`;

const Row = styled.tr`
  background-color: ${({ resolved }) =>
    resolved === 'Решен' ? '#e1f3e3' : '#e4f9fb'};

  &:nth-child(even) {
    background-color: ${({ resolved }) =>
      resolved === 'Решен' ? '#d5ebd8' : '#d2f2f5'};
  }

  /* подсветка изменённых строк */
  ${({ updated }) =>
    updated &&
    `
    background-color: #fff3cd !important; /* мягкий желтый */
  `}
`;


const Status = styled.span`
  color: ${({ resolved }) => (resolved === 'Решен' ? '#59b377' : '#498488ff')};
  font-weight: 600;
`;
