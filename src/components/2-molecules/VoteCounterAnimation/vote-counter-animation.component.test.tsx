// src/components/2-molecules/VoteCounterAnimation/vote-counter-animation.component.test.tsx
// src/components/2-molecules/VoteCounterAnimation/vote-counter-animation.component.test.tsx
import { render, screen } from '@testing-library/react';
import VoteCounterAnimation from './vote-counter-animation.component';

describe('VoteCounterAnimation Component', () => {
  it('renders the animation container with correct class', () => {
    const { container } = render(<VoteCounterAnimation />);
    expect(container.firstChild).toHaveClass('vote-counter-animation-container');
  });

  it('renders exactly four loading dots', () => {
    render(<VoteCounterAnimation />);
    const dots = document.querySelectorAll('.dot');
    expect(dots.length).toBe(4);
  });

  it('displays the counting text in Spanish', () => {
    render(<VoteCounterAnimation />);
    expect(screen.getByText('Contando Votos...')).toBeInTheDocument();
  });

  it('has proper accessibility attributes when modified', () => {
    const { container } = render(<VoteCounterAnimation />);
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer.getAttribute('aria-live')).toBe('polite');
    expect(mainContainer.getAttribute('aria-busy')).toBe('true');
  });
});
