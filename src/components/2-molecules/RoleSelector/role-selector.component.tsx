// src/components/2-molecules/RoleSelector/role-selector.component.tsx
import React from 'react';
import './role-selector.component.scss';

type UserRole = 'player' | 'spectator';

interface RoleSelectorProps {
  selectedValue: UserRole;
  onChange: (value: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedValue,
  onChange,
}) => {
  return (
    <div className="role-selector">
      <label className="role-option">
        <input
          type="radio"
          name="role"
          value="player"
          checked={selectedValue === 'player'}
          onChange={() => onChange('player')}
        />
        <span className="checkmark"></span>
        Jugador
      </label>
      <label className="role-option">
        <input
          type="radio"
          name="role"
          value="spectator"
          checked={selectedValue === 'spectator'}
          onChange={() => onChange('spectator')}
        />
        <span className="checkmark"></span>
        Espectador
      </label>
    </div>
  );
};

export default RoleSelector;