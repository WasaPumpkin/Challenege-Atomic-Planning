// // src/components/1-atoms/Button/button.component.ts
import React from 'react';
import './button.component.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;

  variant?: 'solid' | 'outline' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  ...props
}) => {
 
  const buttonClassName = `custom-button custom-button--${variant}`;

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;