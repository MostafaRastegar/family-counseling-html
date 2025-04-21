import React from 'react';
import { Descriptions, Modal, Tag, Typography } from 'antd';
import { Session } from '../types/session.types';

const { Text } = Typography;

interface SessionDetailModalProps {
  visible: boolean;
  session: Session | null;
  onCancel: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  visible,
  session,
  onCancel,
}) => {
  if (!session) return null;

  const getStatusColor = (status: string) => {
    const statusColorMap = {
      pending: 'warning',
      confirmed: 'processing',
      completed: 'success',
      cancelled: 'error',
    };
    return statusColorMap[status] || 'default';
  };

  return (
    <Modal
      title="جزئیات جلسه"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="مشاور">
          {session.consultantName}
        </Descriptions.Item>
        <Descriptions.Item label="مراجع">
          {session.clientName}
        </Descriptions.Item>
        <Descriptions.Item label="تاریخ">{session.date}</Descriptions.Item>
        <Descriptions.Item label="ساعت">{session.time}</Descriptions.Item>
        <Descriptions.Item label="مدت جلسه">
          {session.duration} دقیقه
        </Descriptions.Item>
        <Descriptions.Item label="وضعیت">
          <Tag color={getStatusColor(session.status)}>
            {session.status === 'pending' && 'در انتظار تأیید'}
            {session.status === 'confirmed' && 'تأیید شده'}
            {session.status === 'completed' && 'برگزار شده'}
            {session.status === 'cancelled' && 'لغو شده'}
          </Tag>
        </Descriptions.Item>
        {session.notes && (
          <Descriptions.Item label="یادداشت‌ها">
            {session.notes}
          </Descriptions.Item>
        )}
        {session.messengerType && (
          <Descriptions.Item label="اطلاعات پیام‌رسان">
            <Text>
              نوع: {session.messengerType === 'telegram' ? 'تلگرام' : 'واتس‌اپ'}
            </Text>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};
