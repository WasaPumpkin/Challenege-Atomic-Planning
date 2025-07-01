// // src/components/1-atoms/EmptySeat/empty-seat.component.tsx
// src/components/1-atoms/EmptySeat/empty-seat.component.test.tsx
import { render } from '@testing-library/react';
import EmptySeat from './empty-seat.component';

describe('EmptySeat component', () => {
  it('should render correctly', () => {
    const { container } = render(<EmptySeat />);
    const div = container.firstChild as HTMLElement;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('empty-seat');
  });
});


