import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const HardShadowCard: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const hoverClass = hover
    ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer'
    : 'transition-shadow duration-200';

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 shadow-sm ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
