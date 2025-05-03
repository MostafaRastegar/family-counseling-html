// Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  const variants = {
    default: 'bg-white',
    elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow',
    bordered: 'bg-white border border-neutral-gray-200',
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`rounded-lg ${variants[variant]} ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

// Sub-components for better composition
Card.Header = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`mb-4 ${className}`}>{children}</div>;

Card.Body = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`${className}`}>{children}</div>;

Card.Footer = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`mt-4 ${className}`}>{children}</div>;

export default Card;
