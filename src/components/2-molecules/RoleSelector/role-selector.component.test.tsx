// src/components/2-molecules/RoleSelector/role-selector.component.test.tsx
// src/components/2-molecules/RoleSelector/role-selector.component.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleSelector from './role-selector.component';

describe('RoleSelector Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both role options', () => {
    render(<RoleSelector selectedValue="player" onChange={mockOnChange} />);
    expect(screen.getByLabelText('Jugador')).toBeInTheDocument();
    expect(screen.getByLabelText('Espectador')).toBeInTheDocument();
  });

  it('marks the selected role as checked', () => {
    const { rerender } = render(
      <RoleSelector selectedValue="player" onChange={mockOnChange} />
    );

    expect(screen.getByLabelText('Jugador')).toBeChecked();
    expect(screen.getByLabelText('Espectador')).not.toBeChecked();

    rerender(<RoleSelector selectedValue="spectator" onChange={mockOnChange} />);

    expect(screen.getByLabelText('Jugador')).not.toBeChecked();
    expect(screen.getByLabelText('Espectador')).toBeChecked();
  });

  it('calls onChange when selecting a different role', () => {
    render(<RoleSelector selectedValue="player" onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('Jugador'));
    expect(mockOnChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Espectador'));
    expect(mockOnChange).toHaveBeenCalledWith('spectator');
  });

  it('has proper accessibility attributes', () => {
    render(<RoleSelector selectedValue="player" onChange={mockOnChange} />);

    const playerRadio = screen.getByLabelText('Jugador');
    const spectatorRadio = screen.getByLabelText('Espectador');

    expect(playerRadio).toHaveAttribute('type', 'radio');
    expect(spectatorRadio).toHaveAttribute('type', 'radio');
    expect(playerRadio).toHaveAttribute('name', 'role');
    expect(spectatorRadio).toHaveAttribute('name', 'role');
  });
});
