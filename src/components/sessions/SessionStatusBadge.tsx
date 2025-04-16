'use client';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';

const SessionStatusBadge = ({ status }: any) => {
  switch (status) {
    case 'pending':
      return (
        <Tag color="warning" icon={<ClockCircleOutlined />}>
          در انتظار تأیید
        </Tag>
      );
    case 'confirmed':
      return (
        <Tag color="processing" icon={<ExclamationCircleOutlined />}>
          تأیید شده
        </Tag>
      );
    case 'completed':
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          برگزار شده
        </Tag>
      );
    case 'cancelled':
      return (
        <Tag color="error" icon={<CloseCircleOutlined />}>
          لغو شده
        </Tag>
      );
    default:
      return null;
  }
};

export default SessionStatusBadge;
