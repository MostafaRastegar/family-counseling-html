import React from 'react';
import { Card as AntCard, Skeleton, Typography } from 'antd';
import { CardProps as AntCardProps } from 'antd/lib/card';

const { Text } = Typography;

interface BaseCardProps extends AntCardProps {
  loading?: boolean;
  error?: string;
  className?: string;
  bodyStyle?: React.CSSProperties;
}

const BaseCard: React.FC<BaseCardProps> = ({
  loading = false,
  error,
  children,
  className = '',
  bodyStyle,
  ...props
}) => {
  return (
    <AntCard
      className={`h-full overflow-hidden ${className}`}
      bodyStyle={{ padding: '16px', ...bodyStyle }}
      {...props}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : error ? (
        <div className="text-red-500 py-4 text-center">
          <Text type="danger">{error}</Text>
        </div>
      ) : (
        children
      )}
    </AntCard>
  );
};

export default BaseCard;
