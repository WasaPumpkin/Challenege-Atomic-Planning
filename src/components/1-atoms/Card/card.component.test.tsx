// // src/components/1-atoms/Card/card.component.tsx
// src/components/1-atoms/Card/card.component.test.tsx
import { render, screen } from '@testing-library/react';
import Card from './card.component';

describe('Card component', () => {
  it('should render the provided content correctly', () => {
    render(
      <Card>
        <p>Contenido dentro de la tarjeta</p>
      </Card>
    );
    expect(screen.getByText('Contenido dentro de la tarjeta')).toBeInTheDocument();
  });

  it('should wrap content in a div with glowing-card class', () => {
    render(
      <Card>
        <span>Contenido</span>
      </Card>
    );
    const span = screen.getByText('Contenido');
    const wrapper = span.parentElement as HTMLElement;

    expect(wrapper).toBeInTheDocument();
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper).toHaveClass('glowing-card');
  });

  it('should accept semantic elements and preserve them', () => {
    render(
      <Card>
        <article>
          <h2>Título</h2>
          <p>Texto</p>
        </article>
      </Card>
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Título');
    expect(screen.getByText('Texto')).toBeInTheDocument();
  });
});




