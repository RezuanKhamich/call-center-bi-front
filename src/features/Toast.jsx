import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
`;

const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ type }) => (type === 'success' ? '#4caf50' : '#f44336')};
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  min-width: 280px;
`;

export function Toast({ toasts }) {
  return (
    <ToastWrapper>
      {toasts.map((toast, index) => (
        <ToastItem key={index} type={toast.type}>
          {toast.type === 'success' ? <CheckCircleIcon size={18} /> : <ErrorIcon size={18} />}
          {toast.message}
        </ToastItem>
      ))}
    </ToastWrapper>
  );
}
