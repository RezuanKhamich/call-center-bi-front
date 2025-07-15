import React from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1301;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 360px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  ${({ variant, color }) =>
    variant === 'confirm' &&
    `
      background-color: ${color || 'gray'};
      color: white;
    `}

  ${({ variant }) =>
    variant === 'cancel' &&
    `
      background: #eee;
      color: #333;
    `}
`;

export default function ModalConfirm({ text, confirmLabel, onConfirm, onCancel, color = 'gray' }) {
  return ReactDOM.createPortal(
    <Overlay>
      <Modal>
        <p>{text}</p>
        <Buttons>
          <Button variant="confirm" color={color} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="cancel" onClick={onCancel}>
            Отмена
          </Button>
        </Buttons>
      </Modal>
    </Overlay>,
    document.getElementById('modal-root')
  );
}
