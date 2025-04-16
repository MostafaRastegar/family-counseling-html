'use client';

import Link from 'next/link';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const SessionCard = ({
  session,
  type = 'client', // 'client', 'consultant', 'admin'
  onViewDetails,
  onSendMessage,
  onCancel,
  onEdit,
  onStatusChange,
}) => {
  // تبدیل وضعیت به رنگ و متن مناسب
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'warning',
          text: 'در انتظار تأیید',
          icon: <InfoCircleOutlined />,
        };
      case 'confirmed':
        return {
          color: 'processing',
          text: 'تأیید شده',
          icon: <CheckCircleOutlined />,
        };
      case 'completed':
        return {
          color: 'success',
          text: 'برگزار شده',
          icon: <CheckCircleOutlined />,
        };
      case 'cancelled':
        return {
          color: 'error',
          text: 'لغو شده',
          icon: <CloseCircleOutlined />,
        };
      default:
        return {
          color: 'default',
          text: status,
          icon: <InfoCircleOutlined />,
        };
    }
  };

  // بررسی اینکه جلسه مربوط به آینده است یا خیر
  const isUpcoming = () => {
    const sessionDateTime = dayjs(`${session.date} ${session.time}`);
    return sessionDateTime.isAfter(dayjs());
  };

  const statusInfo = getStatusInfo(session.status);
  const upcoming = isUpcoming();

  // تعیین عملیات مجاز بر اساس نوع کاربر و وضعیت جلسه
  const canCancel =
    (type === 'client' || type === 'consultant') &&
    (session.status === 'pending' || session.status === 'confirmed') &&
    upcoming;

  const canEdit =
    (type === 'consultant' || type === 'admin') &&
    session.status !== 'cancelled' &&
    (session.status !== 'completed' || type === 'admin');

  const canSendMessage =
    type === 'consultant' &&
    (session.status === 'confirmed' || session.status === 'pending');

  return (
    <Card
      className={`session-card ${upcoming ? 'border-blue-200' : ''}`}
      actions={[
        onViewDetails && (
          <Tooltip title="مشاهده جزئیات">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(session)}
            >
              جزئیات
            </Button>
          </Tooltip>
        ),
        canSendMessage && onSendMessage && (
          <Tooltip title="ارسال پیام">
            <Button
              type="link"
              icon={<MessageOutlined />}
              onClick={() => onSendMessage(session)}
            >
              ارسال پیام
            </Button>
          </Tooltip>
        ),
        canEdit && onEdit && (
          <Tooltip title="ویرایش جلسه">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(session)}
            >
              ویرایش
            </Button>
          </Tooltip>
        ),
        canCancel && onCancel && (
          <Tooltip title="لغو جلسه">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onCancel(session)}
            >
              لغو
            </Button>
          </Tooltip>
        ),
      ].filter(Boolean)}
    >
      <div className="mb-3 flex items-start justify-between">
        <Space direction="vertical" size={1}>
          <Title level={5} className="mb-0">
            {type === 'client'
              ? `جلسه با ${session.consultantName}`
              : `جلسه با ${session.clientName}`}
          </Title>
          <Space className="text-sm text-gray-500">
            <CalendarOutlined />
            <span>{session.date}</span>
            <ClockCircleOutlined />
            <span>{session.time}</span>
            <span>({session.duration} دقیقه)</span>
          </Space>
        </Space>
        <Tag color={statusInfo.color} icon={statusInfo.icon}>
          {statusInfo.text}
        </Tag>
      </div>

      <div className="mb-3">
        <div className="mb-2 flex items-center">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            src={
              type === 'client'
                ? session.consultantAvatar
                : session.clientAvatar
            }
            className="mr-2"
          />
          <Text>
            {type === 'client' ? session.consultantName : session.clientName}
          </Text>
        </div>

        {session.messengerType && (
          <div className="flex items-center text-sm text-gray-500">
            <MessageOutlined className="mr-1" />
            <Text type="secondary">
              پلتفرم:{' '}
              {session.messengerType === 'telegram'
                ? 'تلگرام'
                : session.messengerType === 'whatsapp'
                  ? 'واتس‌اپ'
                  : session.messengerType}
            </Text>
          </div>
        )}
      </div>

      {session.notes && (
        <div className="mb-3">
          <Text strong>یادداشت:</Text>
          <Paragraph ellipsis={{ rows: 2 }} className="text-gray-600">
            {session.notes}
          </Paragraph>
        </div>
      )}

      {upcoming && session.status === 'confirmed' && (
        <div className="bg-blue-50 text-blue-600 rounded p-2 text-sm">
          <InfoCircleOutlined className="mr-1" />
          این جلسه به زودی برگزار خواهد شد. لطفاً در زمان مقرر آماده باشید.
        </div>
      )}

      {type === 'consultant' &&
        session.status === 'completed' &&
        !session.hasReview && (
          <div className="bg-yellow-50 text-yellow-600 rounded p-2 text-sm">
            <InfoCircleOutlined className="mr-1" />
            هنوز برای این جلسه نظری ثبت نشده است.
          </div>
        )}

      {type === 'client' &&
        session.status === 'completed' &&
        !session.hasReview && (
          <div className="mt-2">
            <Link
              href={`/dashboard/client/reviews/add?sessionId=${session.id}`}
            >
              <Button type="primary" size="small" icon={<StarOutlined />}>
                ثبت نظر
              </Button>
            </Link>
          </div>
        )}

      {onStatusChange && type === 'consultant' && (
        <div className="mt-3 flex justify-end">
          <Space>
            {session.status === 'pending' && (
              <Button
                type="primary"
                size="small"
                onClick={() => onStatusChange(session, 'confirmed')}
                icon={<CheckCircleOutlined />}
              >
                تأیید جلسه
              </Button>
            )}
            {session.status === 'confirmed' && upcoming && (
              <Button
                type="primary"
                size="small"
                onClick={() => onStatusChange(session, 'completed')}
                icon={<CheckCircleOutlined />}
              >
                علامت‌گذاری به عنوان انجام شده
              </Button>
            )}
          </Space>
        </div>
      )}
    </Card>
  );
};

export default SessionCard;
