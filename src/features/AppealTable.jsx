import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { customColors } from '../app/theme';

const ScrollWrapper = styled.div`
  max-height: 600px;
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
  background-color: ${({ resolved }) => (resolved === 'Решен' ? '#e1f3e3' : '#e4f9fb')};

  &:nth-child(even) {
    background-color: ${({ resolved }) => (resolved === 'Решен' ? '#d5ebd8' : '#d2f2f5')};
  }
`;

const Status = styled.span`
  color: ${({ resolved }) => (resolved === 'Решен' ? '#59b377' : '#498488ff')};
  font-weight: 600;
`;

export default function StyledTable({ reportsList = [] }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(reportsList);
  }, [reportsList]);

  return (
    <ScrollWrapper>
      <Table>
        <thead>
          <tr>
            <Th>ФИО</Th>
            <Th>Содержание</Th>
            <Th>Тип</Th>
            <Th>Тема</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <Row key={i} resolved={row.status}>
              <Td>
                {i + 1}. {row.full_name}
              </Td>
              <Td>{row.route}</Td>
              <Td>{row.appeal_type}</Td>
              <Td>{row.subject}</Td>
              <Td>
                <Status resolved={row.status}>{row.status}</Status>
              </Td>
            </Row>
          ))}
        </tbody>
      </Table>
    </ScrollWrapper>
  );
}
