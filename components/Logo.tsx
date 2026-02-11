
import React from 'react';

interface LogoProps {
  className?: string;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", inverted = false }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M12 2L21.5 7.5V16.5L12 22L2.5 16.5V7.5L12 2Z" 
        className="fill-current" 
      />
      <path 
        d="M8.5 7.5V16.5M15.5 7.5V16.5M8.5 12H15.5" 
        stroke={inverted ? "currentColor" : "white"} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};
