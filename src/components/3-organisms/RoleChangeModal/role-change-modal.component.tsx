// src/components/3-organisms/RoleChangeModal/role-change-modal.component.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { togglePlayerRole } from '../../../store/slices/gameSlice';
import Button from '../../1-atoms/Button/button.component';
import './role-change-modal.component.scss'; // Crearemos este archivo de estilos

interface RoleChangeModalProps {
  onClose: () => void;
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.game);

  if (!currentUser) return null; // No debería pasar, pero es una buena guarda

  const currentRoleText =
    currentUser.role === 'player' ? 'Jugador' : 'Espectador';
  const newRoleText = currentUser.role === 'player' ? 'Espectador' : 'Jugador';

  const handleConfirm = () => {
    dispatch(togglePlayerRole(currentUser.id));
    onClose(); // Cierra el modal después de confirmar
  };

  return (
    // Usaremos un layout similar al de tus otros modales
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirmar Cambio de Rol</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>
            Tu rol actual es <strong>{currentRoleText}</strong>.
          </p>
          <p>
            ¿Estás seguro de que quieres cambiar tu rol a{' '}
            <strong>{newRoleText}</strong>?
          </p>
        </div>
        <div className="modal-footer">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="solid" onClick={handleConfirm}>
            Confirmar Cambio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleChangeModal;