import { useEffect, useState, useDeferredValue, useMemo } from 'react';
import styled from 'styled-components';
import { customColors } from '../app/theme';
import { Select, MenuItem } from '@mui/material';
import { appealStatusList } from '../app/constants';
import { roles } from '../app/constants';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import SubmitButton from '../shared/SubmitButton';
import DownloadIcon from '@mui/icons-material/Download';

export default function StyledTable({
  reportsList = [],
  role,
  updatedReports,
  departmentList,
  saveChangedReports,
  setUpdatedReports,
}) {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);

  const onStatusChange = (value, report) => {
    setUpdatedReports((prev) => {
      const exists = prev.find((el) => el.id === report.id);
      if (exists) {
        if (value === report.status) {
          return prev.filter((el) => el.id !== report.id);
        }
        return prev.map((el) => (el.id === report.id ? { ...el, status: value } : el));
      }
      return [...prev, { id: report.id, status: value }];
    });

    setData((prev) => prev.map((r) => (r.id === report.id ? { ...r, status: value } : r)));
  };

  const onDepartmentChange = (value, report) => {
    const mo = departmentList.find((el) => el.label === value);

    setUpdatedReports((prev) => {
      const exists = prev.find((el) => el.id === report.id);
      if (exists) {
        return prev.map((el) =>
          el.id === report.id ? { ...el, department: value, moId: mo?.value } : el
        );
      }
      return [...prev, { id: report.id, department: value, moId: mo?.value }];
    });

    setData((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, department: value, moId: mo?.value } : r))
    );
  };

  useEffect(() => {
    setData(reportsList);
  }, [reportsList]);

  const downloadExcel = () => {
    const headers = ['№', 'ФИО', 'Дата', 'Суть обращения', 'Маршрут', 'Тип', 'Тема', 'Статус'];
    const rows = filteredData.map((row, i) => [
      i + 1,
      row.full_name,
      new Date(row.appeal_date).toLocaleDateString('ru-RU'),
      row.description,
      row.route,
      row.appeal_type,
      row.subject,
      row.status,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'reports.xlsx');
  };

  const filteredData = useMemo(() => {
    if (!deferredSearch.trim()) return data;
    const term = deferredSearch.toLowerCase();

    return data.filter((row) =>
      [
        row.id?.toString(),
        row.full_name,
        row.description,
        row.route,
        row.appeal_type,
        row.subject,
        row.status,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [deferredSearch, data]);

  return (
    <>
      <ActionsWrapper>
        <SearchWrapper>
          <SearchInput
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SubmitButton
            label="Скачать в Excel"
            onClickHandler={downloadExcel}
            startIcon={<DownloadIcon />}
          />
          {role === roles.moderator.value ? (
            <SubmitButton
              label="Сохранить"
              disabled={updatedReports.length === 0}
              sx={{
                maxWidth: 160,
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#43A047' },
              }}
              onClickHandler={saveChangedReports}
            />
          ) : null}
        </SearchWrapper>
        <FoundTermsCount>
          {searchTerm ? `Найдено: ${filteredData.length}` : `Всего: ${data.length}`}
        </FoundTermsCount>
      </ActionsWrapper>

      <ScrollWrapper>
        <Table>
          <thead>
            <tr>
              <Th>№</Th>
              <Th>ФИО</Th>
              <Th>Дата</Th>
              <Th>Суть обращения</Th>
              <Th>Маршрут</Th>
              <Th>МО</Th>
              <Th>Тип</Th>
              <Th>Тема</Th>
              <Th>Статус</Th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => {
              const isUpdated = updatedReports.some((u) => u.id === row.id);
              return (
                <Row key={i} resolved={row.status} updated={isUpdated}>
                  <Td>
                    <strong>{row.id}</strong>
                  </Td>
                  <Td>{row.full_name}</Td>
                  <Td>{new Date(row.appeal_date).toLocaleDateString('ru-RU')}</Td>
                  <Td>{row.description}</Td>
                  <Td>{row.route}</Td>
                  <Td>
                    {role === roles.moderator.value ? (
                      <StyledSelect
                        value={row.department}
                        onChange={(e) => onDepartmentChange(e.target.value, row)}
                        size="small"
                      >
                        {departmentList.map((mo, i) => (
                          <MenuItem key={i} value={mo.label}>
                            {mo.label}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    ) : (
                      row.department
                    )}
                  </Td>
                  <Td>{row.appeal_type}</Td>
                  <Td>{row.subject}</Td>
                  <Td>
                    {role === roles.moderator.value ? (
                      <StyledSelect
                        value={row.status}
                        onChange={(e) => onStatusChange(e.target.value, row)}
                        size="small"
                      >
                        {appealStatusList.map((status, i) => (
                          <MenuItem key={i} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    ) : (
                      row.status
                    )}
                  </Td>
                </Row>
              );
            })}
          </tbody>
        </Table>
      </ScrollWrapper>
    </>
  );
}

const ActionsWrapper = styled.div`
  margin-bottom: 20px;
`;

const StyledSelect = styled(Select)`
  & .MuiSelect-select {
    max-width: 200px;
    white-space: normal !important;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.2rem;
    font-size: 12px;
    font-weight: 600;
    padding: 6px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${customColors.primary.main};
    box-shadow: 0 0 4px ${customColors.primary.light};
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  gap: 8px;

  & button {
    width: fit-content;
  }
`;

const FoundTermsCount = styled.span`
  font-size: 12px;
  font-weight: 600;
`;

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
  background-color: ${({ resolved }) => (resolved === 'Решен' ? '#e1f3e3' : '#e4f9fb')};

  &:nth-child(even) {
    background-color: ${({ resolved }) => (resolved === 'Решен' ? '#d5ebd8' : '#d2f2f5')};
  }

  ${({ updated }) =>
    updated &&
    `
    background-color: #fff3cd !important;
  `}
`;
