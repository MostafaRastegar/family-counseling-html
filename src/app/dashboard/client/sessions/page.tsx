'use client';

import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Rate,
  Space,
  Tabs,
  Typography,
  message,
} from 'antd';
import SessionCard from '@/components/sessions/SessionCard';
import SessionStatusBadge from '@/components/sessions/SessionStatusBadge';
import SessionsList from '@/components/sessions/SessionsList';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// داده‌های نمونه برای جلسات
const mockSessions = [
  {
    id: 1,
    consultantName: 'دکتر علی محمدی',
    consultantAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '1404/02/25',
    time: '14:30',
    duration: 60,
    status: 'confirmed',
    notes: 'جلسه مشاوره در مورد مشکلات ارتباطی',
    messengerType: 'telegram',
    messengerId: '@dralimohammadi',
    hasReview: false,
  },
  {
    id: 2,
    consultantName: 'دکتر سارا احمدی',
    consultantAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: '1404/03/05',
    time: '10:00',
    duration: 45,
    status: 'pending',
    notes: 'مشاوره در مورد تربیت فرزند',
    messengerType: 'whatsapp',
    messengerId: '+989123456789',
    hasReview: false,
  },
  {
    id: 3,
    consultantName: 'دکتر علی محمدی',
    consultantAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '1404/01/15',
    time: '16:00',
    duration: 60,
    status: 'completed',
    notes: 'جلسه مشاوره در مورد مسائل زناشویی',
    messengerType: 'telegram',
    messengerId: '@dralimohammadi',
    hasReview: true,
  },
  {
    id: 4,
    consultantName: 'دکتر محمد حسینی',
    consultantAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    date: '1404/01/20',
    time: '11:30',
    duration: 60,
    status: 'cancelled',
    notes: 'مشاوره پیش از ازدواج',
    messengerType: 'whatsapp',
    messengerId: '+989123456788',
    hasReview: false,
  },
  {
    id: 5,
    consultantName: 'دکتر فاطمه نجفی',
    consultantAvatar: 'https://randomuser.me/api/portraits/women/54.jpg',
    date: '1404/03/10',
    time: '15:00',
    duration: 45,
    status: 'confirmed',
    notes: 'مشاوره در مورد مشکلات اضطراب',
    messengerType: 'telegram',
    messengerId: '@drfnajafi',
    hasReview: false,
  },
  {
    id: 6,
    consultantName: 'دکتر زهرا کریمی',
    consultantAvatar: 'https://randomuser.me/api/portraits/women/66.jpg',
    date: '1403/12/10',
    time: '13:00',
    duration: 60,
    status: 'completed',
    notes: 'مشاوره در مورد استرس و مدیریت آن',
    messengerType: 'whatsapp',
    messengerId: '+989123456787',
    hasReview: false,
  },
];

export default function ClientSessions() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [cancelForm] = Form.useForm();
  const [reviewForm] = Form.useForm();

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  // فیلتر کردن جلسات بر اساس وضعیت
  const upcomingSessions = sessions.filter(
    (session) => session.status === 'confirmed' || session.status === 'pending',
  );

  const completedSessions = sessions.filter(
    (session) => session.status === 'completed',
  );

  const cancelledSessions = sessions.filter(
    (session) => session.status === 'cancelled',
  );

  // نمایش جزئیات جلسه
  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setDetailModalVisible(true);
  };

  // لغو جلسه
  const handleCancelSession = (session) => {
    setSelectedSession(session);
    setCancelModalVisible(true);
  };

  // ثبت لغو جلسه
  const handleCancelSubmit = (values) => {
    // در حالت واقعی، اینجا درخواست به API ارسال می‌شود
    setTimeout(() => {
      // بروزرسانی وضعیت جلسه در لیست
      const updatedSessions = sessions.map((session) => {
        if (session.id === selectedSession.id) {
          return { ...session, status: 'cancelled' };
        }
        return session;
      });

      setSessions(updatedSessions);
      setCancelModalVisible(false);
      cancelForm.resetFields();
      message.success('جلسه با موفقیت لغو شد!');
    }, 1000);
  };

  // ثبت نظر
  const handleReviewSubmit = (values) => {
    // در حالت واقعی، اینجا درخواست به API ارسال می‌شود
    setTimeout(() => {
      // بروزرسانی وضعیت نظر در لیست
      const updatedSessions = sessions.map((session) => {
        if (session.id === selectedSession.id) {
          return { ...session, hasReview: true };
        }
        return session;
      });

      setSessions(updatedSessions);
      setReviewModalVisible(false);
      reviewForm.resetFields();
      message.success('نظر شما با موفقیت ثبت شد!');
    }, 1000);
  };

  // نمایش مودال ثبت نظر
  const handleReviewSession = (session) => {
    setSelectedSession(session);
    setReviewModalVisible(true);
  };

  return (
    <div className="container mx-auto">
      <Title level={2}>جلسات مشاوره من</Title>
      <Paragraph className="mb-8 text-gray-500">
        مدیریت جلسات مشاوره، مشاهده تاریخچه و ثبت نظر برای جلسات برگزار شده.
      </Paragraph>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <CalendarOutlined />
              جلسات آینده ({upcomingSessions.length})
            </span>
          }
          key="upcoming"
        >
          {upcomingSessions.length > 0 ? (
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {upcomingSessions.slice(0, 2).map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  type="client"
                  onViewDetails={handleViewDetails}
                  onCancel={handleCancelSession}
                />
              ))}
            </div>
          ) : (
            <Alert
              message="هیچ جلسه آینده‌ای ندارید"
              description="برای رزرو جلسه جدید، می‌توانید به بخش مشاوران مراجعه کنید."
              type="info"
              showIcon
              action={
                <Button type="primary" href="/dashboard/client/consultants">
                  رزرو جلسه جدید
                </Button>
              }
            />
          )}

          <Divider orientation="left">همه جلسات آینده</Divider>

          <SessionsList
            sessions={upcomingSessions}
            loading={loading}
            userType="client"
            onViewDetails={handleViewDetails}
            onCancel={handleCancelSession}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              جلسات برگزار شده ({completedSessions.length})
            </span>
          }
          key="completed"
        >
          {completedSessions.length > 0 ? (
            <>
              <div className="mb-6">
                <Title level={4}>جلساتی که نیاز به ثبت نظر دارند</Title>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {completedSessions
                    .filter((s) => !s.hasReview)
                    .map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        type="client"
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                </div>
                {completedSessions.filter((s) => !s.hasReview).length === 0 && (
                  <Alert
                    message="همه نظرات ثبت شده‌اند"
                    description="برای تمام جلسات برگزار شده، نظر خود را ثبت کرده‌اید. با تشکر از همکاری شما!"
                    type="success"
                    showIcon
                  />
                )}
              </div>

              <Divider orientation="left">همه جلسات برگزار شده</Divider>

              <SessionsList
                sessions={completedSessions}
                loading={loading}
                userType="client"
                onViewDetails={handleViewDetails}
              />
            </>
          ) : (
            <Empty
              description="هنوز هیچ جلسه‌ای برگزار نکرده‌اید"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <CloseCircleOutlined />
              جلسات لغو شده ({cancelledSessions.length})
            </span>
          }
          key="cancelled"
        >
          <SessionsList
            sessions={cancelledSessions}
            loading={loading}
            userType="client"
            onViewDetails={handleViewDetails}
          />
        </TabPane>
      </Tabs>

      {/* مودال جزئیات جلسه */}
      <Modal
        title="جزئیات جلسه مشاوره"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            بستن
          </Button>,
        ]}
      >
        {selectedSession && (
          <div>
            <div className="mb-4">
              <Space align="center">
                <Title level={4} className="!mb-0">
                  جلسه با {selectedSession.consultantName}
                </Title>
                <SessionStatusBadge status={selectedSession.status} />
              </Space>
            </div>

            <Card className="mb-4">
              <div className="grid grid-cols-2 gap-y-2">
                <Text strong>مشاور:</Text>
                <Text>{selectedSession.consultantName}</Text>

                <Text strong>تاریخ:</Text>
                <Text>{selectedSession.date}</Text>

                <Text strong>زمان:</Text>
                <Text>{selectedSession.time}</Text>

                <Text strong>مدت:</Text>
                <Text>{selectedSession.duration} دقیقه</Text>

                <Text strong>پلتفرم ارتباطی:</Text>
                <Text>
                  {selectedSession.messengerType === 'telegram'
                    ? 'تلگرام'
                    : selectedSession.messengerType === 'whatsapp'
                      ? 'واتس‌اپ'
                      : selectedSession.messengerType}
                </Text>
              </div>
            </Card>

            {selectedSession.notes && (
              <div className="mb-4">
                <Text strong>یادداشت جلسه:</Text>
                <Paragraph>{selectedSession.notes}</Paragraph>
              </div>
            )}

            {selectedSession.status === 'completed' &&
              !selectedSession.hasReview && (
                <Button
                  type="primary"
                  icon={<StarOutlined />}
                  onClick={() => {
                    setDetailModalVisible(false);
                    handleReviewSession(selectedSession);
                  }}
                >
                  ثبت نظر
                </Button>
              )}

            {selectedSession.status === 'confirmed' && (
              <div className="mt-4">
                <Alert
                  message="اطلاعات ارتباطی"
                  description={
                    <Text>
                      در زمان مقرر، جلسه از طریق{' '}
                      {selectedSession.messengerType === 'telegram'
                        ? 'تلگرام'
                        : selectedSession.messengerType === 'whatsapp'
                          ? 'واتس‌اپ'
                          : selectedSession.messengerType}{' '}
                      و با شناسه {selectedSession.messengerId} برگزار خواهد شد.
                    </Text>
                  }
                  type="info"
                  showIcon
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* مودال لغو جلسه */}
      <Modal
        title="لغو جلسه مشاوره"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={null}
      >
        <Form form={cancelForm} layout="vertical" onFinish={handleCancelSubmit}>
          <div className="mb-4">
            <Text>در حال لغو جلسه با {selectedSession?.consultantName}</Text>
            <br />
            <Text>
              تاریخ: {selectedSession?.date} - ساعت: {selectedSession?.time}
            </Text>
          </div>

          <Alert
            message="توجه"
            description="لغو جلسه کمتر از 24 ساعت قبل از زمان شروع، ممکن است مشمول جریمه شود."
            type="warning"
            showIcon
            className="mb-4"
          />

          <Form.Item
            name="reason"
            label="دلیل لغو جلسه"
            rules={[
              { required: true, message: 'لطفاً دلیل لغو جلسه را وارد کنید' },
            ]}
          >
            <TextArea rows={4} placeholder="لطفاً دلیل لغو جلسه را وارد کنید" />
          </Form.Item>

          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setCancelModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" danger htmlType="submit">
                لغو جلسه
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* مودال ثبت نظر */}
      <Modal
        title="ثبت نظر برای جلسه مشاوره"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <Form form={reviewForm} layout="vertical" onFinish={handleReviewSubmit}>
          <div className="mb-4">
            <Text>ثبت نظر برای جلسه با {selectedSession?.consultantName}</Text>
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

          <Form.Item name="anonymous" valuePropName="checked">
            <Checkbox>نظر من به صورت ناشناس ثبت شود</Checkbox>
          </Form.Item>

          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setReviewModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" htmlType="submit" icon={<StarOutlined />}>
                ثبت نظر
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
