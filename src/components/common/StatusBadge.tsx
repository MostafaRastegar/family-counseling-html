'use client';

import { ReactNode } from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Badge, Tag, Tooltip } from 'antd';

// Predefined status types
export type StatusType =
  | 'success'
  | 'processing'
  | 'warning'
  | 'error'
  | 'default'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'confirmed'
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'verified'
  | 'unverified';

// Status configurations with default values
export const STATUS_CONFIG: Record<
  StatusType,
  { color: string; icon: ReactNode; text: string }
> = {
  success: {
    color: 'success',
    icon: <CheckCircleOutlined />,
    text: 'موفق',
  },
  processing: {
    color: 'processing',
    icon: <ClockCircleOutlined />,
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
  default: {
    color: 'default',
    icon: <InfoCircleOutlined />,
    text: 'پیش‌فرض',
  },
  // Application-specific statuses
  pending: {
    color: 'warning',
    icon: <ClockCircleOutlined />,
    text: 'در انتظار تأیید',
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
  confirmed: {
    color: 'processing',
    icon: <ExclamationCircleOutlined />,
    text: 'تأیید شده',
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
  verified: {
    color: 'success',
    icon: <CheckCircleOutlined />,
    text: 'تأیید شده',
  },
  unverified: {
    color: 'error',
    icon: <CloseCircleOutlined />,
    text: 'تأیید نشده',
  },
};

export type StatusBadgeProps = {
  /**
   * Status type, can be a predefined type or a custom string
   */
  status: StatusType | string;
  /**
   * Display style - 'tag' or 'badge'
   */
  type?: 'tag' | 'badge';
  /**
   * Custom text to display (overrides default)
   */
  text?: string;
  /**
   * Custom color (overrides default)
   */
  color?: string;
  /**
   * Custom icon (overrides default)
   */
  icon?: ReactNode;
  /**
   * Show tooltip with additional info
   */
  tooltip?: string;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Size of the badge or tag
   */
  size?: 'small' | 'default' | 'large';
};

/**
 * A reusable status badge/tag component with predefined styles for common statuses
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'tag',
  text,
  color,
  icon,
  tooltip,
  className = '',
  size = 'default',
}) => {
  // Get configuration for the status, defaulting to 'default' if not found
  const config = STATUS_CONFIG[status as StatusType] || STATUS_CONFIG.default;

  // Use provided props or fall back to config values
  const displayText = text || config.text || status;
  const displayColor = color || config.color;
  const displayIcon = icon || config.icon;

  // Render the status component based on type
  const StatusComponent = () => {
    if (type === 'tag') {
      return (
        <Tag
          color={displayColor}
          icon={displayIcon}
          className={className}
          style={{
            fontSize:
              size === 'small'
                ? '0.85rem'
                : size === 'large'
                  ? '1.1rem'
                  : '1rem',
            padding:
              size === 'small'
                ? '0 4px'
                : size === 'large'
                  ? '2px 8px'
                  : '1px 6px',
          }}
        >
          {displayText}
        </Tag>
      );
    } else {
      return (
        <Badge
          status={displayColor as any}
          text={displayText}
          className={className}
          style={{
            fontSize:
              size === 'small'
                ? '0.85rem'
                : size === 'large'
                  ? '1.1rem'
                  : '1rem',
          }}
        />
      );
    }
  };

  // Wrap in tooltip if provided
  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <span>
          <StatusComponent />
        </span>
      </Tooltip>
    );
  }

  return <StatusComponent />;
};

export default StatusBadge;
