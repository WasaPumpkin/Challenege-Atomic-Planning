// src/components/2-molecules/InputField/input-field.component.tsx
// import React from 'react';
// import Input from '../../1-atoms/Input/input.component';
// import './input-field.component.scss';

// interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   error?: string | null;
// }

// const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => {
  
//   const containerClassName = `input-field ${error ? 'input-field--error' : ''}`;
//   return (
//     <div className={containerClassName}>
//       <label className="input-field__label">{label}</label>
//       <Input
//         hasError={!!error}
//         {...props}     />
//       {error && <span className="input-field__error">{error}</span>}
//     </div>
//   );
// };

// export default InputField;


// src/components/2-molecules/InputField/input-field.component.tsx
import React, { useId } from 'react';
import Input from '../../1-atoms/Input/input.component';
import './input-field.component.scss';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

const InputField: React.FC<InputFieldProps> = ({ label, error, id, ...props }) => {
  const generatedId = useId(); // genera ID único si no se proporciona
  const inputId = id || `input-${generatedId}`;
  const errorId = `${inputId}-error`;

  const containerClassName = `input-field ${error ? 'input-field--error' : ''}`;

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="input-field__label">
        {label}
      </label>
      <Input
        id={inputId}
        hasError={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="input-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
