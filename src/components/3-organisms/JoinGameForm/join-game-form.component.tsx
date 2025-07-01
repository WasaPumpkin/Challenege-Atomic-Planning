// src/components/3-organisms/JoinGameForm/join-game-form.component.tsx
import React, { useState } from 'react';
// --- CHANGE 1: Import useAppSelector to get the list of players ---
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { joinGame } from '../../../store/slices/gameSlice';
// --- CHANGE 2: Import our new validator function ---
import { validateName } from '../../../utils/validators';

import Button from '../../1-atoms/Button/button.component';
import Card from '../../1-atoms/Card/card.component';
import InputField from '../../2-molecules/InputField/input-field.component';
import RoleSelector from '../../2-molecules/RoleSelector/role-selector.component';
import './join-game-form.component.scss';

const JoinGameForm: React.FC = () => {
  const dispatch = useAppDispatch();
  // --- CHANGE 3: Get the current players from the Redux store ---
  const players = useAppSelector((state) => state.game.players);
  const existingPlayerNames = players.map((p) => p.name);

  const [name, setName] = useState('');
  const [role, setRole] = useState<'player' | 'spectator'>('player');
  // --- CHANGE 4: Add state to hold the validation error message ---
  const [error, setError] = useState<string | null>(null);

  // --- CHANGE 5: Create a handler for real-time validation ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    // On every keystroke, validate the name against all rules, including uniqueness.
    setError(validateName(newName, existingPlayerNames));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Final validation check before submitting.
    const validationError = validateName(name, existingPlayerNames);
    if (validationError) {
      setError(validationError);
      return;
    }
    // Only dispatch if the name is valid.
    dispatch(joinGame({ name, role }));
  };

  // --- CHANGE 6: Make the button logic smarter ---
  const isButtonDisabled = !!error || name.trim() === '';

  return (
    <div className="join-game-overlay">
      <Card>
        <form className="join-game-form" onSubmit={handleSubmit}>
          <InputField
            label="Tu nombre"
            value={name}
            // --- CHANGE 7: Use the new handler and pass the error down ---
            onChange={handleNameChange}
            required
            autoFocus
            error={error} // Pass the error to the InputField for styling
          />
          <RoleSelector selectedValue={role} onChange={setRole} />
          <Button type="submit" disabled={isButtonDisabled}>
            Continuar
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default JoinGameForm;