'use client';

import React, { ReactNode } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Card, Space, Spin, Typography } from 'antd';

const { Text, Paragraph } = Typography;

export interface LoadingStateProps {
  tip?: string;
  description?: string | ReactNode;
  size?: 'small' | 'default' | 'large';
  fullPage?: boolean;
  fullHeight?: boolean;
  height?: number | string;
  icon?: ReactNode;
  iconSize?: number;
  delay?: number;
  card?: boolean;
  cardClassName?: string;
  className?: string;
  spinning?: boolean;
  children?: ReactNode;
  overlay?: boolean;
  withGradient?: boolean;
}

/**
 * LoadingState - A reusable component for loading states
 *
 * This component provides a consistent way to display loading states
 * with customizable spinner, text, and layout options.
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  tip = 'در حال بارگذاری...',
  description,
  size = 'default',
  fullPage = false,
  fullHeight = false,
  height,
  icon,
  iconSize,
  delay = 0,
  card = false,
  cardClassName = '',
  className = '',
  spinning = true,
  children,
  overlay = false,
  withGradient = false,
}) => {
  // Get spinner size based on size prop
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return iconSize || 24;
      case 'large':
        return iconSize || 48;
      default:
        return iconSize || 36;
    }
  };

  // Custom spinner icon
  const spinnerIcon = icon || (
    <LoadingOutlined style={{ fontSize: getSpinnerSize() }} spin />
  );

  // Define gradient background if enabled
  const gradientStyle = withGradient
    ? {
        background:
          'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)',
      }
    : {};

  // Spinner component with text
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <Spin indicator={spinnerIcon} tip={null} />
      {tip && <div className="mt-3 text-center">{tip}</div>}
      {description && (
        <div className="mt-2 max-w-md text-center">
          {typeof description === 'string' ? (
            <Paragraph type="secondary" className="mb-0">
              {description}
            </Paragraph>
          ) : (
            description
          )}
        </div>
      )}
    </div>
  );

  // If fullPage, render a full page loading state
  if (fullPage) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 ${className}`}
      >
        {spinner}
      </div>
    );
  }

  // If there are children, wrap them with Spin
  if (children) {
    return (
      <Spin
        spinning={spinning}
        indicator={spinnerIcon}
        tip={tip}
        delay={delay}
        className={className}
        wrapperClassName={overlay ? 'position-relative' : ''}
      >
        {children}
      </Spin>
    );
  }

  // Calculate container style
  const containerStyle: React.CSSProperties = {
    height: fullHeight ? '100%' : height || 'auto',
    ...gradientStyle,
  };

  // Basic loading state
  const loadingContent = (
    <div
      className={`flex items-center justify-center ${className}`}
      style={containerStyle}
    >
      {spinner}
    </div>
  );

  // Optionally wrap in a card
  return card ? (
    <Card className={`loading-card ${cardClassName}`}>{loadingContent}</Card>
  ) : (
    loadingContent
  );
};

export default LoadingState;
