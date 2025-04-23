import React from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import BaseCard from './BaseCard';

const { Title, Text } = Typography;

// Enum for session status that matches with backend
enum SessionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Interface for the session data
interface SessionData {
  id: string;
  date: string;
  status: SessionStatus;
  notes?: string;
  consultant: {
    id: string;
    user: {
      fullName: string;
      profileImage?: string;
    };
  };
  client: {
    id: string;
    user: {
      fullName: string;
      profileImage?: string;
    };
  };
}

interface SessionCardProps {
  session: SessionData;
  loading?: boolean;
  error?: string;
  userRole?: 'admin' | 'consultant' | 'client';
  onViewDetails?: (sessionId: string) => void;
  onUpdateStatus?: (sessionId: string, status: SessionStatus) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  loading = false,
  error,
  userRole = 'client',
  onViewDetails,
  onUpdateStatus,
}) => {
  if (loading || error) {
    return <BaseCard loading={loading} error={error} />;
  }

  const { id, date, status, consultant, client } = session;

  // Format date and time
  const sessionDate = dayjs(date);
  const formattedDate = sessionDate.format('YYYY/MM/DD');
  const formattedTime = sessionDate.format('HH:mm');

  // Determine whose information to display based on userRole
  const displayPerson = userRole === 'consultant' ? client : consultant;

  // Helper function for status color and text
  const getStatusProps = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.PENDING:
        return { color: 'orange', text: 'در انتظار تایید' };
      case SessionStatus.CONFIRMED:
        return { color: 'blue', text: 'تایید شده' };
      case SessionStatus.COMPLETED:
        return { color: 'green', text: 'تکمیل شده' };
      case SessionStatus.CANCELLED:
        return { color: 'red', text: 'لغو شده' };
      default:
        return { color: 'default', text: 'نامشخص' };
    }
  };

  const statusProps = getStatusProps(status);

  // Get available actions based on session status and user role
  const getAvailableActions = () => {
    if (userRole === 'admin') {
      return [
        <Button key="view" type="link" onClick={() => onViewDetails?.(id)}>
          مشاهده جزئیات
        </Button>,
      ];
    }

    const actions = [
      <Button key="view" type="link" onClick={() => onViewDetails?.(id)}>
        مشاهده جزئیات
      </Button>,
    ];

    if (status === SessionStatus.PENDING) {
      if (userRole === 'consultant') {
        actions.push(
          <Button
            key="confirm"
            type="primary"
            onClick={() => onUpdateStatus?.(id, SessionStatus.CONFIRMED)}
          >
            تایید جلسه
          </Button>,
        );
      }

      actions.push(
        <Button
          key="cancel"
          danger
          onClick={() => onUpdateStatus?.(id, SessionStatus.CANCELLED)}
        >
          لغو جلسه
        </Button>,
      );
    } else if (status === SessionStatus.CONFIRMED) {
      actions.push(
        <Button
          key="complete"
          type="primary"
          onClick={() => onUpdateStatus?.(id, SessionStatus.COMPLETED)}
        >
          تکمیل جلسه
        </Button>,
      );
    }

    return actions;
  };

  return (
    <BaseCard
      className="session-card"
      extra={<Tag color={statusProps.color}>{statusProps.text}</Tag>}
      actions={getAvailableActions()}
    >
      <div className="flex items-start">
        <Avatar
          src={displayPerson.user.profileImage}
          icon={!displayPerson.user.profileImage && <UserOutlined />}
          className="ml-4 mr-0"
          alt={displayPerson.user.fullName}
          size={48}
        />

        <div className="flex-1">
          <Title level={5} className="mb-2">
            جلسه با {displayPerson.user.fullName}
          </Title>

          <Space direction="vertical" size="small" className="w-full">
            <div className="flex items-center">
              <CalendarOutlined className="ml-2 text-gray-500" />
              <Text>{formattedDate}</Text>
            </div>

            <div className="flex items-center">
              <ClockCircleOutlined className="ml-2 text-gray-500" />
              <Text>{formattedTime}</Text>
            </div>
          </Space>
        </div>
      </div>
    </BaseCard>
  );
};

export default SessionCard;
