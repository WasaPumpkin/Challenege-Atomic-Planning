// src/components/1-atoms/PokerCard/poker-card.component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import PokerCard from './poker-card.component';

describe('PokerCard Component', () => {
  const mockOnClick = jest.fn();
  const testValue = '5';

  it('should render the card with correct value', () => {
    render(
      <PokerCard value={testValue} isSelected={false} onClick={mockOnClick} />
    );

    const card = screen.getByRole('button', { name: testValue });
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent(testValue);
  });

  it('should apply selected class when isSelected is true', () => {
    render(
      <PokerCard value={testValue} isSelected={true} onClick={mockOnClick} />
    );

    const card = screen.getByRole('button');
    expect(card).toHaveClass('poker-card');
    expect(card).toHaveClass('poker-card--selected');
  });

  it('should not have selected class when isSelected is false', () => {
    render(
      <PokerCard value={testValue} isSelected={false} onClick={mockOnClick} />
    );

    const card = screen.getByRole('button');
    expect(card).toHaveClass('poker-card');
    expect(card).not.toHaveClass('poker-card--selected');
  });

  it('should call onClick handler with correct value when clicked', () => {
    render(
      <PokerCard value={testValue} isSelected={false} onClick={mockOnClick} />
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(testValue);
  });

  it('should render as a button element', () => {
    render(
      <PokerCard value={testValue} isSelected={false} onClick={mockOnClick} />
    );

    const card = screen.getByRole('button');
    expect(card.tagName).toBe('BUTTON');
  });
});
