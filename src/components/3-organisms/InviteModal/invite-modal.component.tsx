// src/components/3-organisms/InviteModal/invite-modal.component.tsx
// src/components/3-organisms/InviteModal/invite-modal.component.tsx
import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/redux-hooks';
import Button from '../../1-atoms/Button/button.component';
import './invite-modal.component.scss';

interface InviteModalProps {
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const gameName = useAppSelector((state) => state.game.gameName);


  const inviteUrl = `${window.location.origin}/${gameName}`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="invite-modal-overlay">
      <div className="invite-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="invite-modal-header">
          <h3>Invitar jugadores</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="invite-modal-body">
          <input type="text" value={inviteUrl} readOnly className="invite-link-input" />
          <Button onClick={handleCopyClick} variant="solid" className="copy-button">
            {copied ? '¡Copiado!' : 'Copiar link'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
