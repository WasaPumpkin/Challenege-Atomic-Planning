// // src/components/3-organisms/GameHeader/game-header.component.tsx
// src/components/3-organisms/GameHeader/game-header.component.tsx
import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/redux-hooks';
import Button from '../../1-atoms/Button/button.component';

// 1. IMPORT YOUR LOGO COMPONENT
import Logo from '../../1-atoms/Logo/logo.component';

import InviteModal from '../InviteModal/invite-modal.component';
import HostPrivilegesModal from '../HostPrivilegesModal/host-privileges-modal.component';
import RoleChangeModal from '../RoleChangeModal/role-change-modal.component';
import './game-header.component.scss';

const getInitials = (name: string = '') =>
  name.trim().slice(0, 2).toUpperCase();

const GameHeader: React.FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isRoleChangeModalOpen, setIsRoleChangeModalOpen] = useState(false);

  const { gameName, currentUser, hostId } = useAppSelector(
    (state) => state.game
  );

  const isCurrentUserTheHost = currentUser?.id === hostId;

  const handleAvatarClick = () => {
    if (!currentUser) return;
    if (isCurrentUserTheHost) {
      setIsHostModalOpen(true);
    } else {
      setIsRoleChangeModalOpen(true);
    }
  };

  return (
    <>
      <header className="game-header">
        {/* 2. REPLACE THE DIV WITH THE LOGO COMPONENT */}
        {/* We use size="small" because it's in a compact header */}
        <Logo size="small" />

        <div className="game-header__room-name">{gameName}</div>
        <div className="game-header__user-info">
          {currentUser && (
            <button
              className="user-avatar-button"
              onClick={handleAvatarClick}
              disabled={false}
              title={
                isCurrentUserTheHost
                  ? 'Administrar partida'
                  : `Tu rol es ${
                      currentUser.role === 'player' ? 'Jugador' : 'Espectador'
                    }. Haz clic para cambiar.`
              }
            >
              <div className="user-avatar">{getInitials(currentUser.name)}</div>
            </button>
          )}
          <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
            Invitar jugadores
          </Button>
        </div>
      </header>

      {/* --- Modals remain unchanged --- */}
      {isInviteModalOpen && <InviteModal onClose={() => setIsInviteModalOpen(false)} />}
      {isHostModalOpen && <HostPrivilegesModal onClose={() => setIsHostModalOpen(false)} />}
      {isRoleChangeModalOpen && <RoleChangeModal onClose={() => setIsRoleChangeModalOpen(false)} />}
    </>
  );
};

export default GameHeader;
