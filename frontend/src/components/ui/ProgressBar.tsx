import { HTMLAttributes, forwardRef } from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  height?: 'sm' | 'md' | 'lg';
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  rounded?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({
    value,
    max = 100,
    height = 'md',
    color,
    backgroundColor = 'surface-container',
    showLabel = false,
    label,
    rounded = true,
    className = '',
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const heightStyles = {
      sm: 'h-1',
      md: 'h-1.5',
      lg: 'h-2',
    };

    const radiusStyles = rounded ? 'rounded-full' : 'rounded';

    return (
      <div ref={ref} className={`${className}`} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-1.5">
            <span>{label || `${Math.round(percentage)}%`}</span>
            {label && <span className="text-on-surface font-medium">{Math.round(percentage)}%</span>}
          </div>
        )}
        <div className={`w-full ${heightStyles[height]} ${radiusStyles} bg-${backgroundColor} overflow-hidden`}>
          <div
            className={`h-full ${radiusStyles} transition-all duration-500 ease-out`}
            style={{
              width: `${percentage}%`,
              backgroundColor: color || 'var(--color-primary-container)',
            }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';