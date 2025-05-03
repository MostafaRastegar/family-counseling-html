// Typography.tsx
import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyLarge' | 'caption';
  className?: string;
  color?: 'primary' | 'secondary' | 'muted' | 'inherit';
  align?: 'left' | 'center' | 'right';
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  className = '',
  color = 'primary',
  align = 'left',
}) => {
  const variants = {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
    body: 'text-base',
    bodyLarge: 'text-lg',
    caption: 'text-sm text-text-muted',
  };

  const colors = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    muted: 'text-text-muted',
    inherit: '',
  };

  const aligns = {
    left: 'text-right',
    center: 'text-center',
    right: 'text-right',
  };

  const Component = variant.startsWith('h') ? variant : 'p';

  return React.createElement(
    Component,
    {
      className: `${variants[variant]} ${colors[color]} ${aligns[align]} ${className}`,
    },
    children,
  );
};

export default Typography;
