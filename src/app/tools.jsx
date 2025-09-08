import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { appealStatusList, appealTypesList, departmentsList, subjectsList } from './constants';

export const parseReportExcel = async (file) => {
  const errors = [];
  const result = [];

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

  jsonData.forEach((row, index) => {
    const rowIndex = index;

    const department = row['Наименование МО']?.trim();
    const appealDate = row['Дата обращения']?.trim();
    const route = row['Маршрут']?.trim();
    const status = row['Статус']?.trim();
    const description = row['Суть обращения']?.trim();
    const subject = row['Тема']?.trim();
    const type = row['Тип обращения']?.trim();
    const fullName = row['ФИО/контактный номер']?.trim();

    // Проверки
    if (!department)
      errors.push({ row: rowIndex, field: 'Наименование МО', message: 'Поле обязательно' });

    const parsedDate = dayjs(appealDate, ['MM/DD/YY', 'M/D/YY', 'DD.MM.YYYY', 'D.M.YYYY'], true); // строгое сравнение
    if (!parsedDate.isValid()) {
      errors.push({ row: rowIndex, field: 'Дата обращения', message: 'Неверный формат даты' });
    }
    const date = parsedDate.format('YYYY-MM-DD');

    if (!appealStatusList.includes(status)) {
      errors.push({ row: rowIndex, field: 'Статус', message: `Недопустимое значение: ${status}` });
    }

    if (!departmentsList.includes(department)) {
      errors.push({
        row: rowIndex,
        field: 'Наименование МО',
        message: `Недопустимое значение: ${department}`,
      });
    }

    if (!description)
      errors.push({ row: rowIndex, field: 'Суть обращения', message: 'Поле обязательно' });

    if (!subjectsList.includes(subject)) {
      errors.push({ row: rowIndex, field: 'Тема', message: `Недопустимая тема: ${subject}` });
    }

    if (!appealTypesList.includes(type)) {
      errors.push({
        row: rowIndex,
        field: 'Тип обращения',
        message: `Недопустимое значение: ${type}`,
      });
    }

    if (!fullName)
      errors.push({ row: rowIndex, field: 'ФИО/контактный номер', message: 'Поле обязательно' });

    result.push({
      department,
      date,
      route,
      status,
      description,
      subject,
      type,
      fullName,
    });
  });

  return { data: result, errors };
};

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0'); // 04
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 07
  const year = date.getFullYear(); // 2025

  return `${day}.${month}.${year}`; // "04.07.2025"
}
