import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'dark' | 'light';
  pulse?: boolean;
  className?: string;
}

export const TelemetryBadge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  pulse = false,
  className = '',
}) => {
  const variantClasses: Record<string, string> = {
    green: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    dark: 'bg-emerald-950 text-emerald-200 border border-emerald-800',
    light: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variantClasses[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
        </span>
      )}
      {children}
    </span>
  );
};
