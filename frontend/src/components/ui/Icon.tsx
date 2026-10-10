import { forwardRef, type HTMLAttributes } from 'react';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  fill?: 0 | 1;
  grade?: -50 | 0 | 50 | 100 | 150 | 200;
  opticalSize?: number;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({
    name,
    size = 'md',
    weight = 400,
    fill = 0,
    grade = 0,
    opticalSize = 24,
    className = '',
    style,
    ...props
  }, ref) => {
    const sizeMap: Record<string, string> = {
      xs: '16px',
      sm: '18px',
      md: '20px',
      lg: '24px',
      xl: '28px',
    };

    const fontSize = typeof size === 'number' ? `${size}px` : sizeMap[size] || '20px';

    return (
      <span
        ref={ref}
        className={`material-symbols-outlined ${className}`}
        style={{
          fontSize,
          fontVariationSettings: `'wght' ${weight}, 'FILL' ${fill}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
          ...style,
        }}
        {...props}
      >
        {name}
      </span>
    );
  }
);

Icon.displayName = 'Icon';