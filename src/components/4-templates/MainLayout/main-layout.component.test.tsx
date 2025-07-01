// src/components/4-templates/MainLayout/main-layout.component.test.tsx
// src/components/4-templates/MainLayout/main-layout.component.test.tsx
import { render, screen } from '@testing-library/react';
import { MainLayout } from './main-layout.component';

describe('Plantilla MainLayout', () => {
  it('renderiza el encabezado, contenido principal y pie de página', () => {
    render(
      <MainLayout>
        <div>Contenido Principal Aquí</div>
      </MainLayout>
    );

    // Encabezado (Header)
    expect(screen.getByText('Atomic App')).toBeInTheDocument();

    // Contenido proporcionado como children
    expect(screen.getByText('Contenido Principal Aquí')).toBeInTheDocument();

    // Pie de página (Footer)
    expect(screen.getByText(/Atomic Design App/)).toBeInTheDocument();
  });
});
