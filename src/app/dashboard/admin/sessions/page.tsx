'use client';

import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
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
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function AdminSessions() {
  const [allSessions, setAllSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      setAllSessions(sessions);
      setFilteredSessions(sessions);
      setLoading(false);
    }, 1000);
  }, []);

  // اعمال فیلترها
  useEffect(() => {
    let result = [...allSessions];

    // فیلتر بر اساس متن جستجو
    if (searchText) {
      result = result.filter(
        (session) =>
          session.consultantName
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          session.clientName.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // فیلتر بر اساس وضعیت
    if (statusFilter) {
      result = result.filter((session) => session.status === statusFilter);
    }

    // فیلتر بر اساس تاریخ
    if (dateRange) {
      // این قسمت نیاز به پیاده‌سازی دقیق‌تری با تبدیل تاریخ دارد
      // اما در حالت استاتیک نمونه می‌ماند
    }

    // فیلتر بر اساس تب فعال
    if (activeTab === 'pending') {
      result = result.filter((session) => session.status === 'pending');
    } else if (activeTab === 'confirmed') {
      result = result.filter((session) => session.status === 'confirmed');
    } else if (activeTab === 'completed') {
      result = result.filter((session) => session.status === 'completed');
    } else if (activeTab === 'cancelled') {
      result = result.filter((session) => session.status === 'cancelled');
    }

    setFilteredSessions(result);
  }, [searchText, statusFilter, dateRange, activeTab, allSessions]);

  // نمایش جزئیات جلسه
  const showSessionDetails = (session) => {
    setSelectedSession(session);
    setDetailModalVisible(true);
  };

  // نمایش مودال ویرایش جلسه
  const showEditModal = (session) => {
    setSelectedSession(session);
    form.setFieldsValue({
      status: session.status,
      notes: session.notes || '',
    });
    setDetailModalVisible(false);
    setEditModalVisible(true);
  };

  // ذخیره تغییرات جلسه
  const handleUpdateSession = (values) => {
    setLoading(true);

    setTimeout(() => {
      // بروزرسانی جلسه در لیست
      const updatedSessions = allSessions.map((session) => {
        if (session.id === selectedSession.id) {
          return { ...session, ...values };
        }
        return session;
      });

      setAllSessions(updatedSessions);
      setEditModalVisible(false);
      message.success('اطلاعات جلسه با موفقیت بروزرسانی شد!');
      setLoading(false);
    }, 1000);
  };

  // ستون‌های جدول
  const columns = [
    {
      title: 'مشاور',
      dataIndex: 'consultantName',
      key: 'consultant',
    },
    {
      title: 'مراجع',
      dataIndex: 'clientName',
      key: 'client',
    },
    {
      title: 'تاریخ',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'ساعت',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <SessionStatusBadge status={status} />,
    },
    {
      title: 'عملیات',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showSessionDetails(record)}
            size="small"
          >
            جزئیات
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            size="small"
          >
            ویرایش
          </Button>
        </Space>
      ),
    },
  ];

  // مقادیر تب‌ها
  const tabItems = [
    { key: 'all', label: 'همه جلسات', count: allSessions.length },
    {
      key: 'pending',
      label: 'در انتظار تأیید',
      count: allSessions.filter((s) => s.status === 'pending').length,
    },
    {
      key: 'confirmed',
      label: 'تأیید شده',
      count: allSessions.filter((s) => s.status === 'confirmed').length,
    },
    {
      key: 'completed',
      label: 'برگزار شده',
      count: allSessions.filter((s) => s.status === 'completed').length,
    },
    {
      key: 'cancelled',
      label: 'لغو شده',
      count: allSessions.filter((s) => s.status === 'cancelled').length,
    },
  ];

  return (
    <div className="container mx-auto">
      <Title level={2}>مدیریت جلسات</Title>
      <Paragraph className="mb-8 text-gray-500">
        نمایش و مدیریت تمامی جلسات مشاوره در سیستم.
      </Paragraph>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map((item) => ({
            key: item.key,
            label: (
              <span>
                {item.label} <Tag>{item.count}</Tag>
              </span>
            ),
          }))}
        />

        {/* ابزارهای فیلتر */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            placeholder="جستجوی نام مشاور یا مراجع"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select
            placeholder="فیلتر بر اساس وضعیت"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: '100%' }}
          >
            <Option value="pending">در انتظار تأیید</Option>
            <Option value="confirmed">تأیید شده</Option>
            <Option value="completed">برگزار شده</Option>
            <Option value="cancelled">لغو شده</Option>
          </Select>

          <RangePicker
            placeholder={['از تاریخ', 'تا تاریخ']}
            style={{ width: '100%' }}
            onChange={setDateRange}
          />
        </div>

        {/* جدول جلسات */}
        <Table
          columns={columns}
          dataSource={filteredSessions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} از ${total} جلسه`,
          }}
        />
      </Card>

      {/* مودال جزئیات جلسه */}
      <Modal
        title="جزئیات جلسه مشاوره"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(selectedSession)}
          >
            ویرایش
          </Button>,
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            بستن
          </Button>,
        ]}
      >
        {selectedSession && (
          <div>
            <Descriptions title="اطلاعات جلسه" bordered column={1}>
              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined /> مشاور
                  </Space>
                }
              >
                {selectedSession.consultantName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined /> مراجع
                  </Space>
                }
              >
                {selectedSession.clientName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <CalendarOutlined /> تاریخ
                  </Space>
                }
              >
                {selectedSession.date}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <ClockCircleOutlined /> زمان
                  </Space>
                }
              >
                {`${selectedSession.time} (${selectedSession.duration} دقیقه)`}
              </Descriptions.Item>
              <Descriptions.Item label="وضعیت">
                <SessionStatusBadge status={selectedSession.status} />
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {selectedSession.notes && (
              <div className="mb-4">
                <Title level={5}>یادداشت جلسه:</Title>
                <Paragraph>{selectedSession.notes}</Paragraph>
              </div>
            )}

            {(selectedSession.messengerId || selectedSession.messengerType) && (
              <div className="mb-4">
                <Title level={5}>اطلاعات پیام‌رسان:</Title>
                <Descriptions bordered column={1} size="small">
                  {selectedSession.messengerType && (
                    <Descriptions.Item label="نوع پیام‌رسان">
                      {selectedSession.messengerType}
                    </Descriptions.Item>
                  )}
                  {selectedSession.messengerId && (
                    <Descriptions.Item label="شناسه پیام‌رسان">
                      {selectedSession.messengerId}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* مودال ویرایش جلسه */}
      <Modal
        title="ویرایش جلسه مشاوره"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        {selectedSession && (
          <Form form={form} layout="vertical" onFinish={handleUpdateSession}>
            <div className="mb-4">
              <Text>
                جلسه مشاوره بین{' '}
                <strong>{selectedSession.consultantName}</strong> و{' '}
                <strong>{selectedSession.clientName}</strong>
              </Text>
              <br />
              <Text>
                تاریخ: {selectedSession.date} - ساعت: {selectedSession.time}
              </Text>
            </div>

            <Form.Item
              name="status"
              label="وضعیت جلسه"
              rules={[
                { required: true, message: 'لطفاً وضعیت جلسه را انتخاب کنید' },
              ]}
            >
              <Select>
                <Option value="pending">در انتظار تأیید</Option>
                <Option value="confirmed">تأیید شده</Option>
                <Option value="completed">برگزار شده</Option>
                <Option value="cancelled">لغو شده</Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="یادداشت جلسه">
              <TextArea
                rows={4}
                placeholder="یادداشت‌های مربوط به این جلسه را وارد کنید"
              />
            </Form.Item>

            <Form.Item className="mb-0 text-left">
              <Space>
                <Button onClick={() => setEditModalVisible(false)}>
                  انصراف
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  ذخیره تغییرات
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
