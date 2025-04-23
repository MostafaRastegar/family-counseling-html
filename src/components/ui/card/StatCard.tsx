import React, { ReactNode } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Statistic, Typography } from 'antd';
import BaseCard from './BaseCard';

const { Text } = Typography;

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  trend?: {
    value: number;
    isIncreasing: boolean;
  };
  loading?: boolean;
  error?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = '#1677ff',
  prefix,
  suffix,
  trend,
  loading = false,
  error,
}) => {
  if (loading || error) {
    return <BaseCard loading={loading} error={error} />;
  }

  const getTrendIcon = () => {
    if (!trend) return null;

    return trend.isIncreasing ? (
      <ArrowUpOutlined style={{ color: '#52c41a' }} />
    ) : (
      <ArrowDownOutlined style={{ color: '#f5222d' }} />
    );
  };

  const getTrendText = () => {
    if (!trend) return null;

    const trendColor = trend.isIncreasing ? 'text-green-500' : 'text-red-500';
    return (
      <Text className={trendColor}>
        {getTrendIcon()} {trend.value}%
      </Text>
    );
  };

  return (
    <BaseCard>
      <div className="mb-4 flex items-center justify-between">
        <Text strong className="text-gray-600">
          {title}
        </Text>
        {icon && (
          <div
            style={{
              backgroundColor: `${color}20`,
              color: color,
              padding: '8px',
              borderRadius: '8px',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <Statistic
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color }}
      />

      {trend && (
        <div className="mt-2">
          <Text type="secondary" className="mr-1">
            نسبت به دوره قبل:
          </Text>
          {getTrendText()}
        </div>
      )}
    </BaseCard>
  );
};

export default StatCard;
