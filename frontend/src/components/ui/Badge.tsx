import { forwardRef, type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
  dotColor?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot, dotColor, className = '', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-surface-container text-on-surface-variant',
      secondary: 'bg-secondary-container text-on-secondary-container',
      success: 'bg-secondary-container text-on-secondary-container',
      warning: 'bg-tertiary-container text-on-tertiary-fixed',
      error: 'bg-error-container text-on-error-container',
      info: 'bg-primary-fixed text-on-primary-fixed',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-label-sm',
      md: 'px-2.5 py-1 text-label-md',
    };

    return (
      <span
        ref={ref}
        className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full font-semibold inline-flex items-center gap-1.5 ${className}`}
        {...props}
      >
        {dot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor || 'currentColor' }} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';