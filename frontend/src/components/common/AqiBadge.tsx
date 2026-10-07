import React from 'react';

interface AqiBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Good: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/30' },
  Satisfactory: { bg: 'bg-lime-500/10 dark:bg-lime-500/20', text: 'text-lime-700 dark:text-lime-400', border: 'border-lime-500/30' },
  Moderate: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/30' },
  Poor: { bg: 'bg-red-500/10 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-500/30' },
  'Very Poor': { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500/30' },
  Severe: { bg: 'bg-rose-950/20 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-700/50' }
};

export const AqiBadge: React.FC<AqiBadgeProps> = ({ category, size = 'md' }) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['Moderate'];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-sm font-bold',
    lg: 'px-4 py-1.5 text-base font-extrabold tracking-wider'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}>
      <span className="w-2 h-2 rounded-full bg-current mr-1.5 animate-pulse" />
      {category.toUpperCase()}
    </span>
  );
};
