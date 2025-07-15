import React, { useId } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';

import { parseReportExcel } from '../app/tools';
import { reportStatus } from '../app/constants';

const ExcelUploadButton = ({ id, onChangeReports, isEditBtn = false }) => {
  const inputId = useId();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const { data, errors } = await parseReportExcel(file);
    console.log(data);
    if (errors.length > 0) {
      onChangeReports(id, 'status', reportStatus.error);
      onChangeReports(id, 'error', errors);
      console.error('Ошибки при валидации:', errors);
    } else {
      onChangeReports(id, 'data', data);
      onChangeReports(id, 'status', reportStatus.success);
      console.log('Данные успешно обработаны:', data);
    }
  };

  const triggerFileInput = () => {
    document.getElementById(inputId).click();
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsm"
        id={inputId}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      {isEditBtn ? (
        <Button
          variant="contained"
          color="primary"
          onClick={triggerFileInput}
          startIcon={<EditIcon />}
        >
          Изменить
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={triggerFileInput}
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': { backgroundColor: '#43A047' },
          }}
        >
          Загрузить
        </Button>
      )}
    </>
  );
};

export default ExcelUploadButton;
