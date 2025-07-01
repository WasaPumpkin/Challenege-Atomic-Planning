// // src/components/1-atoms/Button/button.component.tsx
// src/components/1-atoms/Button/button.component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './button.component';

describe('Button component', () => {
  it('should render the text correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should have default `custom-button--solid` class', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button--solid');
  });

  it('should have `custom-button--outline` class when variant is outline', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button--outline');
  });

  it('should call onClick callback when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should accept and apply disabled attribute', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should accept type="submit" attribute', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});;














