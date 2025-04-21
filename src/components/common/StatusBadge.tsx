'use client';

import React, { ReactNode } from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Badge, Space, Tag, Tooltip } from 'antd';

// Predefined status types
export type StatusType =
  | 'success'
  | 'processing'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'active'
  | 'inactive'
  | 'suspended'
  | string;

export interface StatusConfig {
  color: string;
  icon?: ReactNode;
  text: string;
}

export interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  showIcon?: boolean;
  showText?: boolean;
  useTag?: boolean;
  tooltip?: string;
  customConfig?: StatusConfig;
  className?: string;
  dot?: boolean;
}

/**
 * StatusBadge - A reusable component for displaying statuses
 *
 * This component is designed to replace multiple status badge components
 * by providing a configurable interface for different status types.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  showIcon = true,
  showText = true,
  useTag = true,
  tooltip,
  customConfig,
  className = '',
  dot = false,
}) => {
  // Default status configurations
  const statusConfigs: Record<StatusType, StatusConfig> = {
    success: {
      color: 'success',
      icon: <CheckCircleOutlined />,
      text: 'موفق',
    },
    processing: {
      color: 'processing',
      icon: <InfoCircleOutlined />,
      text: 'در حال پردازش',
    },
    warning: {
      color: 'warning',
      icon: <WarningOutlined />,
      text: 'هشدار',
    },
    error: {
      color: 'error',
      icon: <CloseCircleOutlined />,
      text: 'خطا',
    },
    info: {
      color: 'blue',
      icon: <InfoCircleOutlined />,
      text: 'اطلاعات',
    },
    default: {
      color: 'default',
      icon: <InfoCircleOutlined />,
      text: 'پیش‌فرض',
    },
    pending: {
      color: 'warning',
      icon: <ClockCircleOutlined />,
      text: 'در انتظار تأیید',
    },
    confirmed: {
      color: 'processing',
      icon: <ExclamationCircleOutlined />,
      text: 'تأیید شده',
    },
    completed: {
      color: 'success',
      icon: <CheckCircleOutlined />,
      text: 'برگزار شده',
    },
    cancelled: {
      color: 'error',
      icon: <CloseCircleOutlined />,
      text: 'لغو شده',
    },
    active: {
      color: 'success',
      icon: <CheckCircleOutlined />,
      text: 'فعال',
    },
    inactive: {
      color: 'default',
      icon: <CloseCircleOutlined />,
      text: 'غیرفعال',
    },
    suspended: {
      color: 'error',
      icon: <CloseCircleOutlined />,
      text: 'تعلیق شده',
    },
  };

  // Get configuration for the specified status
  const config = customConfig || statusConfigs[status] || statusConfigs.default;
  const displayText = text || config.text;

  // Handle Tooltip wrapping
  const content = useTag ? (
    <Tag
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      className={className}
    >
      {showText && displayText}
    </Tag>
  ) : (
    <Badge
      status={config.color as any}
      text={showText ? displayText : undefined}
      className={className}
      dot={dot}
    />
  );

  // Return with optional tooltip
  return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
};

export default StatusBadge;
