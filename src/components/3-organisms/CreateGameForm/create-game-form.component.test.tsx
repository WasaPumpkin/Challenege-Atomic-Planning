// // src/components/1-atoms/PokerCard/create-game-form.component.tsx
// src/components/1-atoms/PokerCard/create-game-form.component.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer, { createGame } from '../../../store/slices/gameSlice';
import CreateGameForm from './create-game-form.component';

expect.extend(toHaveNoViolations); // 👈 Extiende Jest con accesibilidad

const renderWithStore = (ui: React.ReactElement, dispatch = jest.fn()) => {
  const store = configureStore({
    reducer: { game: gameReducer },
  });

  store.dispatch = dispatch;

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};

describe('<CreateGameForm />', () => {
  let dispatch: jest.Mock;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('renders the form correctly', () => {
    renderWithStore(<CreateGameForm />, dispatch);

    expect(screen.getByText('Crear partida')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombra la partida')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /crear partida/i })
    ).toBeDisabled();
  });

  it('disables the button with invalid input', () => {
    renderWithStore(<CreateGameForm />, dispatch);
    const input = screen.getByLabelText('Nombra la partida');
    fireEvent.change(input, { target: { value: '  ' } });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('enables the button with valid input', () => {
    renderWithStore(<CreateGameForm />, dispatch);
    const input = screen.getByLabelText('Nombra la partida');
    fireEvent.change(input, { target: { value: 'Valid123' } });
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('dispatches createGame on valid submit', () => {
    renderWithStore(<CreateGameForm />, dispatch);
    const input = screen.getByLabelText('Nombra la partida');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'MiPartida' } });
    fireEvent.click(button);

    expect(dispatch).toHaveBeenCalledWith(createGame('MiPartida'));
  });

  it('shows error on invalid input (special characters)', () => {
    renderWithStore(<CreateGameForm />, dispatch);
    const input = screen.getByLabelText('Nombra la partida');
    fireEvent.change(input, { target: { value: 'Inv@lidName123' } });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se permiten caracteres especiales'
    );
  });

  it('is accessible (axe)', async () => {
    const { container } = renderWithStore(<CreateGameForm />, dispatch);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
