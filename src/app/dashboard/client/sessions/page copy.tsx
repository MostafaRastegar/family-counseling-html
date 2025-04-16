'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Rate,
  Space,
  Steps,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import SessionStatusBadge from '@/components/sessions/SessionStatusBadge';
import { sessions } from '@/mocks/sessions';

// داده‌های نمونه

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Step } = Steps;

export default function ClientSessions() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSession, setSelectedSession] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // فیلتر کردن جلسات بر اساس وضعیت
  const clientId = 5; // در یک محیط واقعی از ID مراجع حاضر استفاده می‌شود
  const allSessions = sessions.filter(
    (session) => session.clientId === clientId,
  );

  const upcomingSessions = allSessions.filter(
    (session) => session.status === 'confirmed' || session.status === 'pending',
  );

  const completedSessions = allSessions.filter(
    (session) => session.status === 'completed',
  );

  const cancelledSessions = allSessions.filter(
    (session) => session.status === 'cancelled',
  );

  // ثبت نظر برای جلسه
  const handleReviewSubmit = (values) => {
    setLoading(true);

    setTimeout(() => {
      console.log('Review for session:', selectedSession.id, values);
      message.success('نظر شما با موفقیت ثبت شد!');
      setReviewModalVisible(false);
      setLoading(false);
    }, 1000);
  };

  // لغو جلسه
  const handleCancelSession = (values) => {
    setLoading(true);

    setTimeout(() => {
      console.log('Cancel session:', selectedSession.id, values);
      message.success('جلسه با موفقیت لغو شد!');
      setCancelModalVisible(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto">
      <Title level={2}>جلسات مشاوره من</Title>
      <Paragraph className="mb-8 text-gray-500">
        مدیریت جلسات مشاوره، مشاهده تاریخچه و ثبت نظر برای جلسات برگزار شده.
      </Paragraph>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={`جلسات آینده (${upcomingSessions.length})`}
          key="upcoming"
        >
          {upcomingSessions.length > 0 ? (
            <SessionsList
              sessions={upcomingSessions}
              onViewDetails={(session) => {
                setSelectedSession(session);
                setDetailModalVisible(true);
              }}
              onCancelSession={(session) => {
                setSelectedSession(session);
                setCancelModalVisible(true);
              }}
            />
          ) : (
            <Empty
              description="شما هیچ جلسه آینده‌ای ندارید"
              className="my-12"
            />
          )}
        </TabPane>

        <TabPane
          tab={`جلسات برگزار شده (${completedSessions.length})`}
          key="completed"
        >
          {completedSessions.length > 0 ? (
            <SessionsList
              sessions={completedSessions}
              onViewDetails={(session) => {
                setSelectedSession(session);
                setDetailModalVisible(true);
              }}
              onReviewSession={(session) => {
                setSelectedSession(session);
                setReviewModalVisible(true);
              }}
            />
          ) : (
            <Empty
              description="شما هنوز هیچ جلسه‌ای برگزار نکرده‌اید"
              className="my-12"
            />
          )}
        </TabPane>

        <TabPane
          tab={`جلسات لغو شده (${cancelledSessions.length})`}
          key="cancelled"
        >
          {cancelledSessions.length > 0 ? (
            <SessionsList
              sessions={cancelledSessions}
              onViewDetails={(session) => {
                setSelectedSession(session);
                setDetailModalVisible(true);
              }}
            />
          ) : (
            <Empty
              description="شما هیچ جلسه لغو شده‌ای ندارید"
              className="my-12"
            />
          )}
        </TabPane>
      </Tabs>

      {/* نمایش راهنمای رزرو جلسه اگر جلسه‌ای وجود ندارد */}
      {allSessions.length === 0 && (
        <Card className="mt-8">
          <div className="mb-6 text-center">
            <Title level={4}>چگونه یک جلسه مشاوره رزرو کنم؟</Title>
          </div>

          <Steps
            direction="vertical"
            current={-1}
            className="mx-auto max-w-2xl"
          >
            <Step
              title="یافتن مشاور"
              description="از بین مشاوران متخصص، فردی که متناسب با نیازهای شماست را انتخاب کنید."
              icon={<UserOutlined />}
            />
            <Step
              title="انتخاب زمان"
              description="از بین زمان‌های در دسترس مشاور، زمان مناسب خود را انتخاب کنید."
              icon={<CalendarOutlined />}
            />
            <Step
              title="تأیید و پرداخت"
              description="اطلاعات جلسه را تأیید کرده و هزینه جلسه را پرداخت کنید."
              icon={<ClockCircleOutlined />}
            />
          </Steps>

          <div className="mt-8 text-center">
            <Link href="/dashboard/client/consultants">
              <Button type="primary" size="large">
                یافتن مشاور
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* مودال ثبت نظر */}
      <Modal
        title="ثبت نظر برای جلسه مشاوره"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleReviewSubmit}>
          <div className="mb-4">
            <Text>مشاور: {selectedSession?.consultantName}</Text>
            <br />
            <Text>
              تاریخ: {selectedSession?.date} - ساعت: {selectedSession?.time}
            </Text>
          </div>

          <Form.Item
            name="rating"
            label="امتیاز شما به این جلسه"
            rules={[
              { required: true, message: 'لطفاً امتیاز خود را وارد کنید' },
            ]}
            initialValue={5}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="comment"
            label="نظر شما"
            rules={[{ required: true, message: 'لطفاً نظر خود را وارد کنید' }]}
          >
            <TextArea
              rows={4}
              placeholder="تجربه خود از این جلسه مشاوره را بنویسید"
            />
          </Form.Item>

          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setReviewModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                ثبت نظر
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* مودال لغو جلسه */}
      <Modal
        title="لغو جلسه مشاوره"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCancelSession}>
          <div className="mb-4">
            <Text>مشاور: {selectedSession?.consultantName}</Text>
            <br />
            <Text>
              تاریخ: {selectedSession?.date} - ساعت: {selectedSession?.time}
            </Text>
          </div>

          <div className="bg-yellow-50 text-yellow-700 mb-4 rounded p-4">
            <Text strong>توجه:</Text> لغو جلسه کمتر از 24 ساعت قبل از زمان شروع،
            ممکن است مشمول جریمه شود.
          </div>

          <Form.Item
            name="reason"
            label="دلیل لغو جلسه"
            rules={[
              { required: true, message: 'لطفاً دلیل لغو جلسه را وارد کنید' },
            ]}
          >
            <TextArea rows={4} placeholder="دلیل لغو جلسه را وارد کنید" />
          </Form.Item>

          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setCancelModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" danger htmlType="submit" loading={loading}>
                لغو جلسه
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* مودال جزئیات جلسه */}
      <Modal
        title="جزئیات جلسه مشاوره"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            بستن
          </Button>,
        ]}
      >
        {selectedSession && (
          <div>
            <div className="mb-4">
              <Title level={5}>اطلاعات کلی</Title>
              <div className="grid grid-cols-2 gap-2">
                <Text strong>مشاور:</Text>
                <Text>{selectedSession.consultantName}</Text>

                <Text strong>تاریخ:</Text>
                <Text>{selectedSession.date}</Text>

                <Text strong>ساعت:</Text>
                <Text>{selectedSession.time}</Text>

                <Text strong>مدت:</Text>
                <Text>{selectedSession.duration} دقیقه</Text>

                <Text strong>وضعیت:</Text>
                <SessionStatusBadge status={selectedSession.status} />
              </div>
            </div>

            {selectedSession.notes && (
              <div className="mb-4">
                <Title level={5}>یادداشت جلسه</Title>
                <Paragraph>{selectedSession.notes}</Paragraph>
              </div>
            )}

            {selectedSession.status === 'confirmed' && (
              <div className="bg-blue-50 mb-4 rounded p-4">
                <Text strong className="text-blue-700 mb-2 block">
                  راهنمای ارتباط
                </Text>
                <Text className="text-blue-700">
                  این جلسه به صورت آنلاین از طریق{' '}
                  {selectedSession.messengerType || 'تلگرام'} برگزار خواهد شد.
                  در زمان مقرر، مشاور با شما تماس خواهد گرفت.
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// کامپوننت لیست جلسات
const SessionsList = ({
  sessions,
  onViewDetails,
  onReviewSession,
  onCancelSession,
}) => {
  return (
    <List
      itemLayout="vertical"
      dataSource={sessions}
      renderItem={(session) => (
        <List.Item
          key={session.id}
          actions={[
            <Button
              key="details"
              size="small"
              onClick={() => onViewDetails(session)}
            >
              جزئیات
            </Button>,
            onReviewSession && session.status === 'completed' && (
              <Button
                key="review"
                size="small"
                icon={<StarOutlined />}
                onClick={() => onReviewSession(session)}
              >
                ثبت نظر
              </Button>
            ),
            onCancelSession &&
              session.status !== 'cancelled' &&
              session.status !== 'completed' && (
                <Popconfirm
                  key="cancel"
                  title="آیا از لغو این جلسه مطمئن هستید؟"
                  onConfirm={() => onCancelSession(session)}
                  okText="بله"
                  cancelText="خیر"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger size="small">
                    لغو جلسه
                  </Button>
                </Popconfirm>
              ),
          ].filter(Boolean)}
        >
          <List.Item.Meta
            title={
              <Space align="center">
                <span>{session.consultantName}</span>
                <SessionStatusBadge status={session.status} />
              </Space>
            }
            description={
              <Space direction="vertical" size="small">
                <Space>
                  <CalendarOutlined /> تاریخ: {session.date}
                </Space>
                <Space>
                  <ClockCircleOutlined /> ساعت: {session.time} | مدت:{' '}
                  {session.duration} دقیقه
                </Space>
              </Space>
            }
          />
          <div>
            {session.notes && (
              <Paragraph ellipsis={{ rows: 2 }}>
                <Text type="secondary">یادداشت: {session.notes}</Text>
              </Paragraph>
            )}
          </div>
        </List.Item>
      )}
    />
  );
};
