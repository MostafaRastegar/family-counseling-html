import React from 'react';
import {
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';

// Enums for different status types that match with backend
export enum SessionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

// Union type for all possible status values
type StatusType = SessionStatus | VerificationStatus | PaymentStatus | string;

interface StatusConfig {
  color: string;
  icon: React.ReactNode;
  text: string;
}

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  className?: string;
  size?: 'small' | 'default' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
  size = 'default',
}) => {
  // Helper function to get status configuration
  const getStatusConfig = (status: StatusType): StatusConfig => {
    // Session status configs
    if (Object.values(SessionStatus).includes(status as SessionStatus)) {
      switch (status) {
        case SessionStatus.PENDING:
          return {
            color: 'orange',
            icon: <ClockCircleOutlined />,
            text: 'در انتظار تایید',
          };
        case SessionStatus.CONFIRMED:
          return { color: 'blue', icon: <CheckOutlined />, text: 'تایید شده' };
        case SessionStatus.COMPLETED:
          return {
            color: 'green',
            icon: <CheckCircleOutlined />,
            text: 'تکمیل شده',
          };
        case SessionStatus.CANCELLED:
          return {
            color: 'red',
            icon: <CloseCircleOutlined />,
            text: 'لغو شده',
          };
      }
    }

    // Verification status configs
    if (
      Object.values(VerificationStatus).includes(status as VerificationStatus)
    ) {
      switch (status) {
        case VerificationStatus.PENDING:
          return {
            color: 'orange',
            icon: <ClockCircleOutlined />,
            text: 'در انتظار تایید',
          };
        case VerificationStatus.VERIFIED:
          return {
            color: 'green',
            icon: <CheckCircleOutlined />,
            text: 'تایید شده',
          };
        case VerificationStatus.REJECTED:
          return {
            color: 'red',
            icon: <CloseCircleOutlined />,
            text: 'رد شده',
          };
      }
    }

    // Payment status configs
    if (Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      switch (status) {
        case PaymentStatus.PENDING:
          return {
            color: 'orange',
            icon: <SyncOutlined spin />,
            text: 'در حال پردازش',
          };
        case PaymentStatus.SUCCESSFUL:
          return {
            color: 'green',
            icon: <CheckCircleOutlined />,
            text: 'موفق',
          };
        case PaymentStatus.FAILED:
          return { color: 'red', icon: <WarningOutlined />, text: 'ناموفق' };
      }
    }

    // Default for unknown status
    return {
      color: 'default',
      icon: <ClockCircleOutlined />,
      text: status as string,
    };
  };

  const { color, icon, text } = getStatusConfig(status);

  return (
    <Tag
      color={color}
      icon={showIcon ? icon : undefined}
      className={`${className} ${size === 'large' ? 'px-3 py-1 text-sm' : size === 'small' ? 'text-xs' : ''}`}
    >
      {text}
    </Tag>
  );
};

export default StatusBadge;
