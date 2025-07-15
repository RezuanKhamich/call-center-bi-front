import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-family: sans-serif;
`;

const Th = styled.th`
  background-color: #1e88e5;
  color: white;
  padding: 10px;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #d0d0d0;
  font-size: 14px;
  vertical-align: top;
`;

const Row = styled.tr`
  background-color: ${({ resolved }) => (resolved === 'Решен' ? '#e5f5e9' : '#e3f2fd')};

  &:nth-child(even) {
    background-color: ${({ resolved }) =>
      resolved === 'Решен' ? '#d7eddc' : '#dbeafc'}; // слегка другой оттенок
  }
`;

const Status = styled.span`
  color: ${({ resolved }) => (resolved === 'Решен' ? '#388e3c' : '#1976d2')};
  font-weight: 600;
`;

export default function StyledTable({ reportsList = [] }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(reportsList);
  }, [reportsList]);

  return (
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
            <Td>{row.full_name}</Td>
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
  );
}
