import React, { useState } from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  EditOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Modal,
  Row,
  Space,
  Steps,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import type { Session, SessionStatus } from '@/components/sessions/session';
import StatusBadge from '../ui/StatusBadge';
import ConfirmDialog from '../ui/modals/ConfirmDialog';
import ErrorState from '../ui/states/ErrorState';
import LoadingState from '../ui/states/LoadingState';

const { Title, Text, Paragraph } = Typography;

interface SessionDetailProps {
  session?: Session;
  loading?: boolean;
  error?: string;
  userRole?: 'admin' | 'consultant' | 'client';
  onUpdateStatus?: (sessionId: string, status: SessionStatus) => void;
  onEditNotes?: (sessionId: string, notes: string) => void;
  onAddReview?: (sessionId: string) => void;
  onSendMessage?: (sessionId: string) => void;
}

const SessionDetail: React.FC<SessionDetailProps> = ({
  session,
  loading = false,
  error,
  userRole = 'client',
  onUpdateStatus,
  onEditNotes,
  onAddReview,
  onSendMessage,
}) => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<SessionStatus | null>(
    null,
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editNotesVisible, setEditNotesVisible] = useState(false);
  const [notes, setNotes] = useState('');

  // Check if user can review this session
  const canReview = () => {
    if (!session) return false;
    return (
      userRole === 'client' && session.status === 'completed'
      // في حالة وجود API، نتحقق هنا إذا كان المستخدم قد قام بالتقييم بالفعل
    );
  };

  // Check if session is active
  const isActiveSession = () => {
    if (!session) return false;
    return session.status === 'confirmed' && isSessionNow();
  };

  // Check if session is now (within 15 minutes of scheduled time)
  const isSessionNow = () => {
    if (!session) return false;

    const sessionTime = dayjs(session.date);
    const now = dayjs();
    const diffMinutes = Math.abs(sessionTime.diff(now, 'minute'));

    return diffMinutes <= 15;
  };

  // Handle status update confirmation
  const handleUpdateStatusConfirm = (status: SessionStatus) => {
    setConfirmAction(status);
    setConfirmModalVisible(true);
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!session || !confirmAction) return;

    setConfirmLoading(true);

    try {
      if (onUpdateStatus) {
        onUpdateStatus(session.id, confirmAction);
      }

      // Close modal after successful update
      setConfirmModalVisible(false);
    } catch (err) {
      console.error('Error updating session status:', err);
    } finally {
      setConfirmLoading(false);
    }
  };

  // Handle edit notes
  const handleEditNotes = () => {
    if (!session) return;
    setNotes(session.notes || '');
    setEditNotesVisible(true);
  };

  // Handle save notes
  const handleSaveNotes = () => {
    if (!session) return;

    if (onEditNotes) {
      onEditNotes(session.id, notes);
    }

    setEditNotesVisible(false);
  };

  // Format date and time
  const formatDateTime = (dateStr: string) => {
    const date = dayjs(dateStr);
    return {
      date: date.format('YYYY/MM/DD'),
      time: date.format('HH:mm'),
      dayName: date.format('dddd'),
      fullDateTime: date.format('YYYY/MM/DD HH:mm'),
    };
  };

  // Get session participant info based on user role
  const getParticipantInfo = () => {
    if (!session) return { name: '', image: '' };

    if (userRole === 'consultant') {
      return {
        name: session.client.user.fullName,
        image: session.client.user.profileImage,
      };
    } else {
      return {
        name: session.consultant.user.fullName,
        image: session.consultant.user.profileImage,
      };
    }
  };

  // Get possible actions based on session status and user role
  const getActions = () => {
    if (!session) return [];

    const actions = [];

    // Adding review is only for clients on completed sessions
    if (canReview()) {
      actions.push(
        <Button
          key="add-review"
          type="primary"
          icon={<CommentOutlined />}
          onClick={() => onAddReview && onAddReview(session.id)}
        >
          ثبت نظر
        </Button>,
      );
    }

    // Join active session
    if (isActiveSession()) {
      actions.push(
        <Button
          key="join-session"
          type="primary"
          onClick={() =>
            window.open(`/dashboard/sessions/${session.id}/join`, '_blank')
          }
        >
          ورود به جلسه
        </Button>,
      );
    }

    // Cancel session
    if (['pending', 'confirmed'].includes(session.status)) {
      actions.push(
        <Button
          key="cancel-session"
          danger
          onClick={() =>
            handleUpdateStatusConfirm('cancelled' as SessionStatus)
          }
        >
          لغو جلسه
        </Button>,
      );
    }

    // Confirm session (only for consultants)
    if (userRole === 'consultant' && session.status === 'pending') {
      actions.push(
        <Button
          key="confirm-session"
          type="primary"
          onClick={() =>
            handleUpdateStatusConfirm('confirmed' as SessionStatus)
          }
        >
          تایید جلسه
        </Button>,
      );
    }

    // Complete session (only for consultants)
    if (userRole === 'consultant' && session.status === 'confirmed') {
      actions.push(
        <Button
          key="complete-session"
          type="primary"
          onClick={() =>
            handleUpdateStatusConfirm('completed' as SessionStatus)
          }
        >
          اتمام جلسه
        </Button>,
      );
    }

    // Send message
    if (onSendMessage) {
      actions.push(
        <Button
          key="send-message"
          icon={<MessageOutlined />}
          onClick={() => onSendMessage(session.id)}
        >
          ارسال پیام
        </Button>,
      );
    }

    return actions;
  };

  // Get session status steps
  const getStatusSteps = () => {
    const steps = [
      {
        title: 'ثبت جلسه',
        description: 'جلسه ثبت شده',
        status: 'finish' as const,
      },
      {
        title: 'تایید جلسه',
        description: 'تایید توسط مشاور',
        status:
          session?.status === 'pending'
            ? ('process' as const)
            : session?.status === 'cancelled' && session?.status === 'pending'
              ? ('error' as const)
              : ('finish' as const),
      },
      {
        title: 'برگزاری جلسه',
        description: 'انجام جلسه',
        status:
          session?.status === 'confirmed'
            ? ('process' as const)
            : session?.status === 'completed'
              ? ('finish' as const)
              : session?.status === 'cancelled' &&
                  (session?.status === 'confirmed' ||
                    session?.status === 'completed')
                ? ('error' as const)
                : ('wait' as const),
      },
      {
        title: 'اتمام جلسه',
        description: 'ثبت بازخورد',
        status:
          session?.status === 'completed'
            ? ('finish' as const)
            : ('wait' as const),
      },
    ];

    return steps;
  };

  // Render loading state
  if (loading) {
    return <LoadingState />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorState
        title="خطا در بارگذاری اطلاعات جلسه"
        subTitle={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Render no session data
  if (!session) {
    return (
      <Card>
        <div className="py-10 text-center">
          <Title level={4} className="text-gray-500">
            اطلاعات جلسه موجود نیست
          </Title>
        </div>
      </Card>
    );
  }

  const { date, time, dayName } = formatDateTime(session.date);
  const participant = getParticipantInfo();
  const actions = getActions();

  return (
    <div className="session-detail">
      {/* Session Header */}
      <Card className="mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Space size="large">
              <Avatar
                src={participant.image}
                icon={!participant.image && <UserOutlined />}
                size={64}
              />
              <div>
                <Title level={4} className="mb-1">
                  جلسه مشاوره با {participant.name}
                </Title>
                <Space split={<Divider type="vertical" />}>
                  <Text>
                    <CalendarOutlined className="ml-1" />
                    {dayName} {date}
                  </Text>
                  <Text>
                    <ClockCircleOutlined className="ml-1" />
                    {time}
                  </Text>
                  <StatusBadge status={session.status} size="large" />
                </Space>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8} className="flex justify-end">
            <Space wrap>{actions}</Space>
          </Col>
        </Row>
      </Card>

      {/* Session Information */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="اطلاعات جلسه" className="mb-4">
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="تاریخ و زمان">
                {formatDateTime(session.date).fullDateTime}
              </Descriptions.Item>
              <Descriptions.Item label="وضعیت">
                <StatusBadge status={session.status} />
              </Descriptions.Item>
              <Descriptions.Item label="مشاور">
                {session.consultant.user.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="مراجع">
                {session.client.user.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="نوع ارتباط" span={2}>
                {session.messengerType === 'telegram'
                  ? 'تلگرام'
                  : session.messengerType === 'whatsapp'
                    ? 'واتساپ'
                    : session.messengerType === 'phone'
                      ? 'تماس تلفنی'
                      : session.messengerType || 'تعیین نشده'}
              </Descriptions.Item>
              <Descriptions.Item label="شناسه ارتباط" span={2}>
                {session.messengerId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="تاریخ ایجاد">
                {formatDateTime(session.createdAt).fullDateTime}
              </Descriptions.Item>
              <Descriptions.Item label="آخرین به‌روزرسانی">
                {formatDateTime(session.updatedAt).fullDateTime}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="flex items-center justify-between">
              <Title level={5}>یادداشت‌ها</Title>
              <Tooltip title="ویرایش یادداشت‌ها">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleEditNotes}
                />
              </Tooltip>
            </div>
            <div className="bg-gray-50 mt-2 min-h-20 rounded-md p-4">
              {session.notes ? (
                <Paragraph>{session.notes}</Paragraph>
              ) : (
                <Text type="secondary" italic>
                  یادداشتی ثبت نشده است
                </Text>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="مراحل جلسه" className="mb-4">
            <Steps
              direction="vertical"
              current={
                session.status === 'pending'
                  ? 1
                  : session.status === 'confirmed'
                    ? 2
                    : session.status === 'completed'
                      ? 3
                      : 0
              }
              status={session.status === 'cancelled' ? 'error' : 'process'}
              items={getStatusSteps()}
            />
          </Card>

          {session.status === 'confirmed' && (
            <Card title="اطلاعات ارتباط" className="mb-4">
              <Paragraph>
                لطفاً در زمان تعیین شده از طریق روش ارتباطی انتخاب شده آماده
                گفتگو باشید:
              </Paragraph>
              <div className="mt-4">
                <div className="bg-blue-50 rounded-md p-4 text-center">
                  <Title level={5}>
                    {session.messengerType === 'telegram'
                      ? 'تلگرام'
                      : session.messengerType === 'whatsapp'
                        ? 'واتساپ'
                        : session.messengerType === 'phone'
                          ? 'تماس تلفنی'
                          : 'روش ارتباطی'}
                  </Title>
                  <Paragraph className="mb-0">
                    {session.messengerId || 'اطلاعات ارتباطی ثبت نشده است'}
                  </Paragraph>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Status Update Confirmation Modal */}
      <ConfirmDialog
        visible={confirmModalVisible}
        title={
          confirmAction === 'cancelled'
            ? 'آیا از لغو این جلسه اطمینان دارید؟'
            : confirmAction === 'confirmed'
              ? 'آیا از تایید این جلسه اطمینان دارید؟'
              : 'آیا از اتمام این جلسه اطمینان دارید؟'
        }
        content={
          confirmAction === 'cancelled'
            ? 'با لغو این جلسه، قرار ملاقات از برنامه شما حذف خواهد شد.'
            : confirmAction === 'confirmed'
              ? 'با تایید این جلسه، زمان مشخص شده برای مشاوره رزرو خواهد شد.'
              : 'با اتمام این جلسه، مراجع می‌تواند نظر خود را ثبت کند.'
        }
        onCancel={() => setConfirmModalVisible(false)}
        onConfirm={handleUpdateStatus}
        confirmLoading={confirmLoading}
        type={confirmAction === 'cancelled' ? 'warning' : 'confirm'}
      />

      {/* Edit Notes Modal */}
      <Modal
        title="ویرایش یادداشت‌ها"
        open={editNotesVisible}
        onCancel={() => setEditNotesVisible(false)}
        onOk={handleSaveNotes}
        okText="ذخیره"
        cancelText="انصراف"
      >
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-32 w-full rounded-md border border-gray-300 p-2"
          placeholder="یادداشت‌های خود را وارد کنید..."
        />
      </Modal>
    </div>
  );
};

export default SessionDetail;
