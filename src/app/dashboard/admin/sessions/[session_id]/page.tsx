'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  EditOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Steps,
  Tabs,
  Tag,
  Timeline,
  Typography,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import StatusBadge from '@/components/ui/StatusBadge';
import ReviewCard from '@/components/ui/card/ReviewCard';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialog';
import { messages as mockMessages } from '@/mocks/messages';
import { reviews as mockReviews } from '@/mocks/reviews';
import { sessions as mockSessions } from '@/mocks/sessions';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

export default function AdminSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.session_id as string;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [sessionReview, setSessionReview] = useState<any>(null);
  const [sessionMessages, setSessionMessages] = useState<any[]>([]);

  // حالت‌های دیالوگ
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmContent, setConfirmContent] = useState('');
  const [confirmType, setConfirmType] = useState<
    'confirm' | 'warning' | 'error'
  >('confirm');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [actionType, setActionType] = useState<
    'cancel' | 'confirm' | 'complete' | null
  >(null);

  // برای ویرایش یادداشت‌ها
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);

  // بارگذاری اطلاعات جلسه
  useEffect(() => {
    // شبیه‌سازی درخواست API
    const timer = setTimeout(() => {
      // یافتن اطلاعات جلسه
      const foundSession = mockSessions.find((s) => s.id === sessionId);
      setSession(foundSession || null);

      if (foundSession) {
        // یافتن نظر مربوط به این جلسه (اگر وجود داشته باشد)
        const foundReview = mockReviews.find((r) => r.sessionId === sessionId);
        setSessionReview(foundReview || null);

        // یافتن پیام‌های مربوط به این جلسه
        const foundMessages = mockMessages.filter(
          (m) => m.sessionId === sessionId,
        );
        setSessionMessages(foundMessages || []);

        // تنظیم یادداشت‌های جلسه
        setSessionNotes(foundSession.notes || '');
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  // تبدیل تاریخ به فرمت مناسب
  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('YYYY/MM/DD HH:mm');
  };

  // رویداد بازگشت به صفحه قبل
  const handleBack = () => {
    router.push('/dashboard/admin/sessions');
  };

  // رویداد مشاهده پروفایل مشاور
  const handleViewConsultant = () => {
    if (!session) return;
    router.push(`/dashboard/admin/consultants/${session.consultantId}`);
  };

  // رویداد مشاهده پروفایل مراجع
  const handleViewClient = () => {
    if (!session) return;
    router.push(`/dashboard/admin/users/${session.client.user.id}`);
  };

  // رویداد لغو جلسه
  const handleCancelSession = () => {
    setActionType('cancel');
    setConfirmTitle('لغو جلسه مشاوره');
    setConfirmContent(
      'آیا از لغو این جلسه مشاوره اطمینان دارید؟ این عملیات قابل بازگشت نیست.',
    );
    setConfirmType('warning');
    setConfirmVisible(true);
  };

  // رویداد تایید جلسه
  const handleConfirmSession = () => {
    setActionType('confirm');
    setConfirmTitle('تایید جلسه مشاوره');
    setConfirmContent('آیا از تایید این جلسه مشاوره اطمینان دارید؟');
    setConfirmType('confirm');
    setConfirmVisible(true);
  };

  // رویداد تکمیل جلسه
  const handleCompleteSession = () => {
    setActionType('complete');
    setConfirmTitle('تکمیل جلسه مشاوره');
    setConfirmContent(
      'آیا از تکمیل این جلسه مشاوره اطمینان دارید؟ پس از تکمیل، مراجع می‌تواند نظر خود را ثبت کند.',
    );
    setConfirmType('confirm');
    setConfirmVisible(true);
  };

  // تایید عملیات
  const handleConfirm = async () => {
    if (!actionType) return;

    setConfirmLoading(true);

    try {
      // شبیه‌سازی درخواست API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let newStatus;
      let actionMessage;

      switch (actionType) {
        case 'cancel':
          newStatus = 'cancelled';
          actionMessage = 'جلسه با موفقیت لغو شد.';
          break;
        case 'confirm':
          newStatus = 'confirmed';
          actionMessage = 'جلسه با موفقیت تایید شد.';
          break;
        case 'complete':
          newStatus = 'completed';
          actionMessage = 'جلسه با موفقیت تکمیل شد.';
          break;
      }

      // به‌روزرسانی وضعیت جلسه
      setSession((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : null,
      );

      // نمایش پیام موفقیت
      notification.success({
        message: 'عملیات موفق',
        description: actionMessage,
      });

      // بستن دیالوگ تایید
      setConfirmVisible(false);
    } catch (err) {
      notification.error({
        message: 'خطا در انجام عملیات',
        description:
          'متأسفانه خطایی در انجام عملیات رخ داده است. لطفا مجددا تلاش کنید.',
      });
    } finally {
      setConfirmLoading(false);
      setActionType(null);
    }
  };

  // لغو عملیات
  const handleCancelConfirm = () => {
    setConfirmVisible(false);
    setActionType(null);
  };

  // رویداد ویرایش یادداشت‌ها
  const handleEditNotes = () => {
    setNotesModalVisible(true);
  };

  // ذخیره یادداشت‌ها
  const handleSaveNotes = () => {
    setNotesLoading(true);

    // شبیه‌سازی ذخیره یادداشت‌ها
    setTimeout(() => {
      // به‌روزرسانی یادداشت‌های جلسه
      setSession((prev) =>
        prev
          ? {
              ...prev,
              notes: sessionNotes,
              updatedAt: new Date().toISOString(),
            }
          : null,
      );

      setNotesLoading(false);
      setNotesModalVisible(false);

      notification.success({
        message: 'یادداشت‌ها ذخیره شد',
        description: 'یادداشت‌های جلسه با موفقیت به‌روزرسانی شد.',
      });
    }, 1000);
  };

  // تعیین مراحل جلسه
  const getStatusSteps = () => {
    const steps = [
      {
        title: 'ثبت جلسه',
        description: 'جلسه توسط مراجع ثبت شده',
        status: 'finish' as const,
      },
      {
        title: 'تایید جلسه',
        description: 'تایید توسط مشاور',
        status: !session
          ? ('wait' as const)
          : session.status === 'pending'
            ? ('process' as const)
            : session.status === 'cancelled' && session.status === 'pending'
              ? ('error' as const)
              : ('finish' as const),
      },
      {
        title: 'برگزاری جلسه',
        description: 'انجام جلسه',
        status: !session
          ? ('wait' as const)
          : session.status === 'confirmed'
            ? ('process' as const)
            : session.status === 'completed'
              ? ('finish' as const)
              : session.status === 'cancelled' &&
                  (session.status === 'confirmed' ||
                    session.status === 'completed')
                ? ('error' as const)
                : ('wait' as const),
      },
      {
        title: 'اتمام جلسه',
        description: 'ثبت بازخورد',
        status: !session
          ? ('wait' as const)
          : session.status === 'completed'
            ? ('finish' as const)
            : ('wait' as const),
      },
    ];

    return steps;
  };

  // اگر جلسه یافت نشد یا در حال بارگذاری است
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🔄</div>
          <Title level={4}>در حال بارگذاری اطلاعات جلسه...</Title>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <Title level={4}>جلسه مورد نظر یافت نشد</Title>
          <Button type="primary" onClick={handleBack} className="mt-4">
            بازگشت به لیست جلسات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-session-detail-page">
      <DashboardBreadcrumb />

      <AdminPageHeader
        title="جزئیات جلسه مشاوره"
        subtitle={`مشاهده جزئیات جلسه مشاوره بین ${session.consultant.user.fullName} و ${session.client.user.fullName}`}
        backButton={{
          onClick: handleBack,
          text: 'بازگشت به لیست جلسات',
        }}
        actions={
          [
            session.status === 'pending' && {
              key: 'confirm',
              text: 'تایید جلسه',
              icon: <CheckCircleOutlined />,
              onClick: handleConfirmSession,
              type: 'primary',
            },
            session.status === 'confirmed' && {
              key: 'complete',
              text: 'تکمیل جلسه',
              icon: <CheckCircleOutlined />,
              onClick: handleCompleteSession,
              type: 'primary',
            },
            (session.status === 'pending' ||
              session.status === 'confirmed') && {
              key: 'cancel',
              text: 'لغو جلسه',
              icon: <ClockCircleOutlined />,
              onClick: handleCancelSession,
              type: 'default',
            },
          ].filter(Boolean) as any[]
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {/* اطلاعات اصلی جلسه */}
          <Card title="اطلاعات جلسه" className="mb-4">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card
                  type="inner"
                  title="مشاور"
                  extra={
                    <Button type="link" onClick={handleViewConsultant}>
                      مشاهده پروفایل
                    </Button>
                  }
                >
                  <div className="flex items-center">
                    <Avatar
                      size={64}
                      src={session.consultant.user.profileImage}
                      icon={
                        !session.consultant.user.profileImage && (
                          <UserOutlined />
                        )
                      }
                      className="ml-4"
                    />
                    <div>
                      <div className="text-lg font-medium">
                        {session.consultant.user.fullName}
                      </div>
                      <div className="text-gray-500">
                        {session.consultant.user.email}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  type="inner"
                  title="مراجع"
                  extra={
                    <Button type="link" onClick={handleViewClient}>
                      مشاهده پروفایل
                    </Button>
                  }
                >
                  <div className="flex items-center">
                    <Avatar
                      size={64}
                      src={session.client.user.profileImage}
                      icon={
                        !session.client.user.profileImage && <UserOutlined />
                      }
                      className="ml-4"
                    />
                    <div>
                      <div className="text-lg font-medium">
                        {session.client.user.fullName}
                      </div>
                      <div className="text-gray-500">
                        {session.client.user.email}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Descriptions
              bordered
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="شناسه جلسه">
                {session.id}
              </Descriptions.Item>
              <Descriptions.Item label="تاریخ و زمان جلسه">
                <div className="flex items-center">
                  <CalendarOutlined className="ml-1" />
                  {formatDateTime(session.date)}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="وضعیت جلسه">
                <StatusBadge status={session.status} />
              </Descriptions.Item>
              <Descriptions.Item label="روش ارتباطی">
                {session.messengerType === 'telegram'
                  ? 'تلگرام'
                  : session.messengerType === 'whatsapp'
                    ? 'واتساپ'
                    : session.messengerType === 'phone'
                      ? 'تماس تلفنی'
                      : session.messengerType || 'تعیین نشده'}
              </Descriptions.Item>
              <Descriptions.Item label="شناسه ارتباط">
                {session.messengerId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="تاریخ ثبت">
                {formatDateTime(session.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="آخرین به‌روزرسانی">
                {formatDateTime(session.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* یادداشت‌های جلسه */}
          <Card
            title="یادداشت‌های جلسه"
            className="mb-4"
            extra={
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={handleEditNotes}
              >
                ویرایش
              </Button>
            }
          >
            {session.notes ? (
              <div className="whitespace-pre-line">{session.notes}</div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                یادداشتی برای این جلسه ثبت نشده است
              </div>
            )}
          </Card>

          {/* بخش نظرات و پیام‌ها */}
          <Card title="نظر و پیام‌ها" className="mb-4">
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <CommentOutlined /> نظر مراجع
                    {sessionReview && (
                      <Tag color="blue" className="mr-1">
                        1
                      </Tag>
                    )}
                  </span>
                }
                key="1"
              >
                {sessionReview ? (
                  <ReviewCard review={sessionReview} />
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    هیچ نظری برای این جلسه ثبت نشده است
                  </div>
                )}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <MessageOutlined /> پیام‌های ارسال شده
                    {sessionMessages.length > 0 && (
                      <Tag color="blue" className="mr-1">
                        {sessionMessages.length}
                      </Tag>
                    )}
                  </span>
                }
                key="2"
              >
                {sessionMessages.length > 0 ? (
                  <Timeline>
                    {sessionMessages.map((message) => (
                      <Timeline.Item key={message.id}>
                        <div className="mb-1">{message.text}</div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime(message.createdAt)} -
                          {message.success ? (
                            <Tag color="success" className="mr-1">
                              ارسال موفق
                            </Tag>
                          ) : (
                            <Tag color="error" className="mr-1">
                              خطا در ارسال
                            </Tag>
                          )}
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    هیچ پیامی برای این جلسه ارسال نشده است
                  </div>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* کارت وضعیت */}
          <Card title="وضعیت جلسه" className="mb-4">
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

          {/* کارت اطلاعات ارتباطی */}
          <Card title="اطلاعات ارتباطی" className="mb-4">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="شماره تماس مشاور">
                <Space>
                  <PhoneOutlined />
                  <a href={`tel:${session.consultant.user.phoneNumber || '-'}`}>
                    {session.consultant.user.phoneNumber || '-'}
                  </a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="ایمیل مشاور">
                <Space>
                  <MailOutlined />
                  <a href={`mailto:${session.consultant.user.email}`}>
                    {session.consultant.user.email}
                  </a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="شماره تماس مراجع">
                <Space>
                  <PhoneOutlined />
                  <a href={`tel:${session.client.user.phoneNumber || '-'}`}>
                    {session.client.user.phoneNumber || '-'}
                  </a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="ایمیل مراجع">
                <Space>
                  <MailOutlined />
                  <a href={`mailto:${session.client.user.email}`}>
                    {session.client.user.email}
                  </a>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* تاریخچه تغییرات */}
          <Card title="تاریخچه تغییرات" className="mb-4">
            <Timeline>
              <Timeline.Item>
                <p>ایجاد جلسه</p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(session.createdAt)}
                </p>
              </Timeline.Item>
              {session.status !== 'pending' && (
                <Timeline.Item
                  color={session.status === 'cancelled' ? 'red' : 'green'}
                >
                  <p>
                    {session.status === 'confirmed'
                      ? 'تایید جلسه'
                      : session.status === 'completed'
                        ? 'تکمیل جلسه'
                        : 'لغو جلسه'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(session.updatedAt)}
                  </p>
                </Timeline.Item>
              )}
              {session.status === 'completed' && sessionReview && (
                <Timeline.Item>
                  <p>ثبت نظر توسط مراجع</p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(sessionReview.createdAt)}
                  </p>
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* دیالوگ تایید عملیات */}
      <ConfirmDialog
        visible={confirmVisible}
        title={confirmTitle}
        content={confirmContent}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirm}
        confirmLoading={confirmLoading}
        type={confirmType}
      />

      {/* مودال ویرایش یادداشت‌ها */}
      <Modal
        title="ویرایش یادداشت‌های جلسه"
        open={notesModalVisible}
        onCancel={() => setNotesModalVisible(false)}
        onOk={handleSaveNotes}
        okText="ذخیره"
        cancelText="انصراف"
        confirmLoading={notesLoading}
      >
        <Form layout="vertical">
          <Form.Item label="یادداشت‌ها">
            <TextArea
              rows={6}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="یادداشت‌های مربوط به این جلسه را وارد کنید..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
