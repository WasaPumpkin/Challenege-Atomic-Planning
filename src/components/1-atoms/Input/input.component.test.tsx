// // src/components/1-atoms/Input/input.component.test.tsx
// src/components/1-atoms/Input/input.component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './input.component';

describe('Input component - Accessibility and behavior', () => {
  it('should render with placeholder and default class', () => {
    render(<Input placeholder="Tu nombre" />);
    const input = screen.getByPlaceholderText('Tu nombre');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('input-atom');
  });

  it('should apply error class and aria-invalid if hasError=true', () => {
    render(<Input placeholder="Con error" hasError />);
    const input = screen.getByPlaceholderText('Con error');
    expect(input).toHaveClass('input-atom--error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not have aria-invalid if hasError is undefined', () => {
    render(<Input placeholder="Sin error" />);
    const input = screen.getByPlaceholderText('Sin error');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('should accept and apply attributes like type="email"', () => {
    render(<Input placeholder="Correo" type="email" />);
    const input = screen.getByPlaceholderText('Correo');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should accept autoFocus', () => {
    render(<Input placeholder="Autofocus" autoFocus />);
    const input = screen.getByPlaceholderText('Autofocus');
    expect(input).toBeInTheDocument();
  });

  it('should accept an id and be associated with a label via htmlFor', () => {
    render(
      <>
        <label htmlFor="username">Nombre de usuario</label>
        <Input id="username" name="username" />
      </>
    );
    const label = screen.getByText('Nombre de usuario');
    const input = screen.getByRole('textbox');
    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
  });

  it('should associate with an error message using aria-describedby', () => {
    render(
      <>
        <Input id="email" aria-describedby="email-error" />
        <span id="email-error">El correo es obligatorio</span>
      </>
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(screen.getByText('El correo es obligatorio')).toBeInTheDocument();
  });

  it('should update its value when typing', () => {
    render(<Input placeholder="Escribe algo" />);
    const input = screen.getByPlaceholderText('Escribe algo') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hola mundo' } });
    expect(input.value).toBe('Hola mundo');
  });
});