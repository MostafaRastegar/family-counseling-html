'use client';

import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  List,
  Modal,
  Select,
  Space,
  Tabs,
  Tag,
  TimePicker,
  Typography,
  message,
} from 'antd';
import SessionStatusBadge from '@/components/sessions/SessionStatusBadge';
import { sessions } from '@/mocks/sessions';

// داده‌های نمونه

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

export default function ConsultantSessions() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSession, setSelectedSession] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // فیلتر کردن جلسات بر اساس وضعیت
  const consultantId = 1; // در یک محیط واقعی از ID مشاور حاضر استفاده می‌شود
  const allSessions = sessions.filter(
    (session) => session.consultantId === consultantId,
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

  // تغییر وضعیت جلسه
  const handleStatusChange = (values) => {
    setLoading(true);

    setTimeout(() => {
      console.log('Status change for session:', selectedSession.id, values);
      message.success('وضعیت جلسه با موفقیت تغییر کرد!');
      setStatusModalVisible(false);
      setLoading(false);
    }, 1000);
  };

  // ثبت یادداشت برای جلسه
  const handleNotesSubmit = (values) => {
    setLoading(true);

    setTimeout(() => {
      console.log('Notes for session:', selectedSession.id, values);
      message.success('یادداشت جلسه با موفقیت ثبت شد!');
      setNotesModalVisible(false);
      setLoading(false);
    }, 1000);
  };

  // ارسال پیام به مراجع
  const handleMessageSubmit = (values) => {
    setLoading(true);

    setTimeout(() => {
      console.log('Message to client:', selectedSession.clientId, values);
      message.success('پیام با موفقیت ارسال شد!');
      setMessageModalVisible(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto">
      <Title level={2}>مدیریت جلسات مشاوره</Title>
      <Paragraph className="mb-8 text-gray-500">
        در این بخش می‌توانید جلسات مشاوره خود را مدیریت کنید.
      </Paragraph>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={`جلسات آینده (${upcomingSessions.length})`}
          key="upcoming"
        >
          <SessionsList
            sessions={upcomingSessions}
            onStatusChange={(session) => {
              setSelectedSession(session);
              setStatusModalVisible(true);
            }}
            onNotesClick={(session) => {
              setSelectedSession(session);
              setNotesModalVisible(true);
              form.setFieldsValue({ notes: session.notes || '' });
            }}
            onMessageClick={(session) => {
              setSelectedSession(session);
              setMessageModalVisible(true);
            }}
          />
        </TabPane>
        <TabPane
          tab={`جلسات برگزار شده (${completedSessions.length})`}
          key="completed"
        >
          <SessionsList
            sessions={completedSessions}
            onNotesClick={(session) => {
              setSelectedSession(session);
              setNotesModalVisible(true);
              form.setFieldsValue({ notes: session.notes || '' });
            }}
          />
        </TabPane>
        <TabPane
          tab={`جلسات لغو شده (${cancelledSessions.length})`}
          key="cancelled"
        >
          <SessionsList sessions={cancelledSessions} />
        </TabPane>
      </Tabs>

      {/* مودال تغییر وضعیت جلسه */}
      <Modal
        title="تغییر وضعیت جلسه"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleStatusChange}>
          <Form.Item
            name="status"
            label="وضعیت جدید"
            rules={[
              { required: true, message: 'لطفاً وضعیت جدید را انتخاب کنید' },
            ]}
            initialValue="confirmed"
          >
            <Select>
              <Option value="confirmed">تأیید شده</Option>
              <Option value="completed">برگزار شده</Option>
              <Option value="cancelled">لغو شده</Option>
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="توضیحات (اختیاری)">
            <TextArea
              rows={4}
              placeholder="توضیحات خود را در مورد تغییر وضعیت وارد کنید"
            />
          </Form.Item>
          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setStatusModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                ثبت تغییر
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* مودال ثبت یادداشت */}
      <Modal
        title="یادداشت جلسه"
        open={notesModalVisible}
        onCancel={() => setNotesModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleNotesSubmit}>
          <Form.Item
            name="notes"
            label="یادداشت‌های جلسه"
            rules={[
              { required: true, message: 'لطفاً یادداشت خود را وارد کنید' },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="یادداشت‌های خود از جلسه را وارد کنید"
            />
          </Form.Item>
          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setNotesModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                ذخیره یادداشت
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* مودال ارسال پیام */}
      <Modal
        title="ارسال پیام به مراجع"
        open={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleMessageSubmit}>
          <Form.Item
            name="messageType"
            label="روش ارسال پیام"
            rules={[
              {
                required: true,
                message: 'لطفاً روش ارسال پیام را انتخاب کنید',
              },
            ]}
            initialValue="telegram"
          >
            <Select>
              <Option value="telegram">تلگرام</Option>
              <Option value="whatsapp">واتس‌اپ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="message"
            label="متن پیام"
            rules={[{ required: true, message: 'لطفاً متن پیام را وارد کنید' }]}
          >
            <TextArea
              rows={4}
              placeholder="متن پیام خود را به مراجع وارد کنید"
            />
          </Form.Item>
          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setMessageModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                ارسال پیام
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// کامپوننت لیست جلسات
const SessionsList = ({
  sessions,
  onStatusChange,
  onNotesClick,
  onMessageClick,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="py-16 text-center">
        <Title level={4} className="text-gray-500">
          هیچ جلسه‌ای یافت نشد
        </Title>
      </div>
    );
  }

  return (
    <List
      dataSource={sessions}
      renderItem={(session) => (
        <List.Item
          key={session.id}
          actions={[
            onStatusChange &&
              session.status !== 'completed' &&
              session.status !== 'cancelled' && (
                <Button
                  key="status"
                  size="small"
                  onClick={() => onStatusChange(session)}
                >
                  تغییر وضعیت
                </Button>
              ),
            onNotesClick && (
              <Button
                key="notes"
                size="small"
                onClick={() => onNotesClick(session)}
              >
                یادداشت
              </Button>
            ),
            onMessageClick && session.status !== 'cancelled' && (
              <Button
                key="message"
                size="small"
                onClick={() => onMessageClick(session)}
              >
                ارسال پیام
              </Button>
            ),
          ].filter(Boolean)}
        >
          <List.Item.Meta
            title={
              <Space align="center">
                <span>{session.clientName}</span>
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
                {session.notes && (
                  <div>
                    <Text type="secondary">
                      یادداشت: {session.notes.substring(0, 50)}...
                    </Text>
                  </div>
                )}
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};
