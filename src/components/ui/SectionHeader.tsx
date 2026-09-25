import React from 'react';

interface SectionHeaderProps {
  category?: string;
  title: string;
  description?: string;
  badge?: string;
  className?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  category,
  title,
  description,
  badge,
  className = '',
  centered = false,
}) => {
  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start'} ${className}`}>
      {category && (
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {category}
          </span>
          {badge && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {badge}
            </span>
          )}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
