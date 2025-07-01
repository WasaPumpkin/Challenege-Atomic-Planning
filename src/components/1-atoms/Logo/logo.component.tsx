// src/components/1-atoms/Logo/logo.component.tsx
import React from 'react';
import './logo.component.scss';

// ======================================================================
// 1. YOUR NEW, MORE DETAILED PragmaLogo SVG COMPONENT
// ======================================================================

interface PragmaLogoProps {
  showText?: boolean;
}

const PragmaLogo: React.FC<PragmaLogoProps> = ({ showText = true }) => (
  <svg
    className="logo-svg"
    viewBox={showText ? '0 0 158 184' : '0 0 158 110'}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Pragma Logo"
  >
    <g id="icon-group">
      <circle cx="79" cy="55" r="53.5" stroke="currentColor" strokeWidth="3" />
      <circle cx="79" cy="55" r="37.5" stroke="currentColor" strokeWidth="3" />
      <g transform="translate(79, 55)">
        <line y1="-37.5" y2="-53.5" stroke="currentColor" strokeWidth="3" />
        <line
          y1="-37.5"
          y2="-53.5"
          stroke="currentColor"
          strokeWidth="3"
          transform="rotate(45)"
        />
        <line
          y1="-37.5"
          y2="-53.5"
          stroke="currentColor"
          strokeWidth="3"
          transform="rotate(90)"
        />
        <line
          y1="-37.5"
          y2="-53.5"
          stroke="currentColor"
          strokeWidth="3"
          transform="rotate(135)"
        />
        <line
          y1="-37.5"
          y2="-53.5"
          stroke="currentColor"
          strokeWidth="3"
          transform="rotate(180)"
        />
        <line
          y1="-37.5"
          y2="-53.5"
          stroke="currentColor"
          strokeWidth="3"
          transform="rotate(225)"
        />
        <line
          y1="-37.5"
          y2="-53.5"
          stroke="currentColor"
          strokeWidth="3"
          transform="rotate(270)"
        />
        <line
          y1="-37.5"
          y2="-53.5"
          stroke="currentColor"
          strokeWidth="3"
          transform="rotate(315)"
        />
      </g>
      <path
        d="M82.1667 46.1667C82.1667 48.4578 80.7911 50.3333 79 50.3333C77.2089 50.3333 75.8333 48.4578 75.8333 46.1667C75.8333 43.8756 77.2089 42 79 42C80.7911 42 82.1667 43.8756 82.1667 46.1667Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M85.5 64.5C85.5 67.8137 82.5939 70.5 79 70.5C75.4061 70.5 72.5 67.8137 72.5 64.5C72.5 61.1863 75.4061 58.5 79 58.5C82.5939 58.5 85.5 61.1863 85.5 64.5Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M73 48C70.6667 52.6667 70.6 61.2 73.5 64.5"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
    </g>

   
  </svg>
);

// ======================================================================
// 2. THE MAIN Logo COMPONENT (The "Wrapper")
// ======================================================================
interface LogoProps {
  size?: 'small' | 'large';
  text?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'large', text }) => {
  const showText = !!text;

  return (
    <div className={`logo-container ${size}`}>
      <PragmaLogo showText={showText} />
    </div>
  );
};

export default Logo;