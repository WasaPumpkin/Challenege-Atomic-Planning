// src/components/3-organisms/CreateGameForm/create-game-form.component.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import { createGame } from '../../../store/slices/gameSlice';
import Button from '../../1-atoms/Button/button.component';
import InputField from '../../2-molecules/InputField/input-field.component';
import Logo from '../../1-atoms/Logo/logo.component';
import { validateName } from '../../../utils/validators';
import './create-game-form.component.scss';

const CreateGameForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [gameName, setGameName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setGameName(newName);
    setError(validateName(newName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateName(gameName);
    if (validationError) {
      setError(validationError);
      return;
    }
    dispatch(createGame(gameName));
  };

  const isButtonDisabled = !!error || gameName.trim() === '';

  return (
    <div className="create-game-container">
      {/* --- CAMBIO: El header ahora contiene el Logo y un h1 por separado --- */}
      <header className="create-game-header">
        <Logo size="small" />
        <h1 className="create-game-title">Crear partida</h1>
      </header>
      {/* --- FIN DEL CAMBIO --- */}
      <main className="create-game-main">
        <form className="create-game-form" onSubmit={handleSubmit}>
          <InputField
            label="Nombra la partida"
            value={gameName}
            onChange={handleNameChange}
            required
            autoFocus
            error={error}
          />
          <Button type="submit" disabled={isButtonDisabled}>
            Crear partida
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CreateGameForm;
