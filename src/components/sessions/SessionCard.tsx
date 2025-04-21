'use client';

import Link from 'next/link';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import GenericCard from '@/components/common/GenericCard';

const SessionCard = ({
  session,
  type = 'client',
  onViewDetails,
  onSendMessage,
  onCancel,
  onEdit,
  onStatusChange,
  isUpcoming = false,
}) => {
  const cardActions = [
    {
      key: 'view',
      text: 'جزئیات',
      icon: onViewDetails ? <EyeOutlined /> : undefined,
      onClick: () => onViewDetails(session),
      hide: !onViewDetails,
      tooltip: 'مشاهده جزئیات',
    },
    {
      key: 'message',
      text: 'ارسال پیام',
      icon: <MessageOutlined />,
      onClick: () => onSendMessage(session),
      hide: !(
        type === 'consultant' &&
        (session.status === 'confirmed' || session.status === 'pending') &&
        onSendMessage
      ),
    },
  ];

  return (
    <GenericCard
      title={
        type === 'client'
          ? `جلسه با ${session.consultantName}`
          : `جلسه با ${session.clientName}`
      }
      status={{
        text:
          session.status === 'pending'
            ? 'در انتظار تأیید'
            : session.status === 'confirmed'
              ? 'تأیید شده'
              : session.status === 'completed'
                ? 'برگزار شده'
                : 'لغو شده',
        color:
          session.status === 'pending'
            ? 'warning'
            : session.status === 'confirmed'
              ? 'processing'
              : session.status === 'completed'
                ? 'success'
                : 'error',
      }}
      avatar={{
        src:
          type === 'client' ? session.consultantAvatar : session.clientAvatar,
        icon: <UserOutlined />,
      }}
      metadata={[
        {
          icon: <CalendarOutlined />,
          text: session.date,
        },
        {
          icon: <ClockCircleOutlined />,
          text: `${session.time} (${session.duration} دقیقه)`,
        },
      ]}
      description={session.notes}
      actions={cardActions}
      className={`session-card ${isUpcoming ? 'border-blue-200' : ''}`}
    />
  );
};

export default SessionCard;
