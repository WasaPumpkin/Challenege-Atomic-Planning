//  src/components/2-molecules/InputField/input-field.component.test.tsx
// src/components/2-molecules/InputField/input-field.component.test.tsx
// src/components/2-molecules/InputField/input-field.component.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from './input-field.component';

describe('InputField Component', () => {
  // Basic functionality tests
  describe('Basic Functionality', () => {
    it('should render label and input', () => {
      render(<InputField label="Test Label" />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should use custom id when provided', () => {
      render(<InputField label="Test" id="custom-id" />);
      expect(screen.getByLabelText('Test')).toHaveAttribute('id', 'custom-id');
    });

    it('should generate unique id when not provided', () => {
      const { container } = render(<InputField label="Test" />);
      const inputId = container.querySelector('input')?.id;
      expect(inputId).toMatch(/^input-/); // Simplified check for prefix
    });

    it('should properly associate label with input', () => {
      render(<InputField label="Email Input" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email Input');
      expect(label).toHaveAttribute('for', input.id);
    });
  });

  // Error state tests
  describe('Error State', () => {
    it('should display error message when error exists', () => {
      render(<InputField label="Test" error="Invalid input" />);
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby');
    });

    it('should add error class to container when error exists', () => {
      const { container } = render(<InputField label="Test" error="Error" />);
      expect(container.firstChild).toHaveClass('input-field--error');
    });

    it('should not display error message when error is null/undefined', () => {
      render(<InputField label="Test" error={null} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility (a11y)', () => {
    it('should have proper label association', () => {
      render(<InputField label="Email Address" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAccessibleName('Email Address');
    });

    it('should have aria-describedby when error exists', () => {
      render(<InputField label="Test" error="Required field" />);
      const input = screen.getByRole('textbox');
      const error = screen.getByText('Required field');
      expect(input).toHaveAttribute('aria-describedby', error.id);
    });

    it('should mark error message with role="alert"', () => {
      render(<InputField label="Test" error="Critical error" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // Focus management and keyboard tests
  describe('Focus Management', () => {
    it('should focus input when label is clicked', async () => {
      const user = userEvent.setup();
      render(<InputField label="Test Label" />);
      await user.click(screen.getByText('Test Label'));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('should maintain focus when typing', async () => {
      const user = userEvent.setup();
      render(<InputField label="Test" />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello');
      expect(input).toHaveFocus();
      expect(input).toHaveValue('Hello');
    });
  });

  // Event handling tests
  describe('Event Handling', () => {
    it('should call onChange when input value changes', async () => {
      const mockOnChange = jest.fn();
      const user = userEvent.setup();
      render(<InputField label="Test" onChange={mockOnChange} />);
      await user.type(screen.getByRole('textbox'), 'test');
      expect(mockOnChange).toHaveBeenCalledTimes(4);
    });

    it('should forward all input props to the input element', () => {
      render(
        <InputField
          label="Test"
          placeholder="Enter text"
          disabled
          data-test="custom-attr"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('data-test', 'custom-attr');
    });
  });
});