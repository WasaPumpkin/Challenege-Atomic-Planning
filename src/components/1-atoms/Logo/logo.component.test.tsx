// // src/components/1-atoms/Logo/Logo/logo.component.tsx
// src/components/1-atoms/Logo/logo.component.test.tsx
import { render, screen } from '@testing-library/react';
import Logo from './logo.component';

describe('Logo component', () => {
  it('should render the SVG logo correctly', () => {
    render(<Logo />);
    const svg = screen.getByLabelText('Pragma Logo');
    expect(svg).toBeInTheDocument();
    expect(svg.tagName).toBe('svg');
  });

  it('should have default "large" size class', () => {
    render(<Logo />);
    const container = screen.getByLabelText('Pragma Logo').parentElement;
    expect(container).toHaveClass('logo-container', 'large');
  });

  it('should apply "small" class when size="small" is passed', () => {
    render(<Logo size="small" />);
    const container = screen.getByLabelText('Pragma Logo').parentElement;
    expect(container).toHaveClass('logo-container', 'small');
  });

  it('should change SVG viewBox when text is passed', () => {
    render(<Logo text="PRAGMA" />);
    const svg = screen.getByLabelText('Pragma Logo');
    expect(svg).toHaveAttribute('viewBox', '0 0 158 184');
  });

  it('should use reduced viewBox when no text is passed', () => {
    render(<Logo />);
    const svg = screen.getByLabelText('Pragma Logo');
    expect(svg).toHaveAttribute('viewBox', '0 0 158 110');
  });
});