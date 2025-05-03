// ImagePlaceholder.tsx
import React from 'react';

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = 400,
  height = 300,
  alt = 'placeholder',
  className = '',
  rounded = 'md',
}) => {
  const roundedStyles = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <img
      src={`/api/placeholder/${width}/${height}`}
      alt={alt}
      className={`${roundedStyles[rounded]} ${className}`}
      width={width}
      height={height}
    />
  );
};

export default ImagePlaceholder;
