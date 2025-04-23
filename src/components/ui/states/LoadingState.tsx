import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface LoadingStateProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullPage?: boolean;
  height?: string | number;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'default',
  tip = 'در حال بارگذاری...',
  fullPage = false,
  height = 300,
  className = '',
}) => {
  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: size === 'small' ? 24 : size === 'large' ? 40 : 32 }}
      spin
    />
  );

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: fullPage ? '100vh' : height,
    width: '100%',
  };

  return (
    <div style={containerStyles} className={className}>
      <Spin indicator={antIcon} tip={tip} size={size} />
    </div>
  );
};

export default LoadingState;
