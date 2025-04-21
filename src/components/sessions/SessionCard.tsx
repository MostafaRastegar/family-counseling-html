'use client';

import {
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import GenericCard from '@/components/common/GenericCard';
import StatusBadge from '@/components/common/StatusBadge';

const SessionCard = ({
  session,
  type = 'client',
  onViewDetails,
  onSendMessage,
  isUpcoming = false,
}: any) => {
  // Prepare status tag
  const sessionStatus =
    session.status === 'pending'
      ? 'pending'
      : session.status === 'confirmed'
        ? 'confirmed'
        : session.status === 'completed'
          ? 'completed'
          : 'cancelled';

  // Prepare actions for the card
  const cardActions = [
    {
      key: 'view',
      label: 'جزئیات',
      icon: <EyeOutlined />,
      onClick: () => onViewDetails?.(session),
      hide: !onViewDetails,
    },
    {
      key: 'message',
      label: 'ارسال پیام',
      icon: <MessageOutlined />,
      onClick: () => onSendMessage?.(session),
      hide: !(
        type === 'consultant' &&
        (session.status === 'confirmed' || session.status === 'pending') &&
        onSendMessage
      ),
    },
  ].filter((action) => !action.hide);

  return (
    <GenericCard
      item={session}
      title={
        type === 'client'
          ? `جلسه با ${session.consultantName}`
          : `جلسه با ${session.clientName}`
      }
      status={<StatusBadge status={sessionStatus} type="tag" />}
      imageUrl={
        type === 'client' ? session.consultantAvatar : session.clientAvatar
      }
      description={session.notes}
      tags={[session.status]}
      secondaryContent={
        <div>
          <div>
            <CalendarOutlined className="mr-2" />
            {session.date}
          </div>
          <div>
            <ClockCircleOutlined className="mr-2" />
            {session.time} ({session.duration} دقیقه)
          </div>
        </div>
      }
      actions={cardActions}
      className={`session-card ${isUpcoming ? 'border-blue-200' : ''}`}
    />
  );
};

export default SessionCard;
