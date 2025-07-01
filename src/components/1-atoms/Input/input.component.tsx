// src/components/1-atoms/Input/input.component.tsx
// src/components/1-atoms/Input/input.component.tsx
import React from 'react';
import './input.component.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input: React.FC<InputProps> = ({ hasError, ...props }) => {
  const className = `input-atom ${hasError ? 'input-atom--error' : ''}`;

  return (
    <input
      className={className}
      aria-invalid={hasError || undefined}
      {...props}
    />
  );
};

export default Input;
