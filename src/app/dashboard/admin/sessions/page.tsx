'use client';

import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
} from 'antd';
import DataTable from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { sessions } from '@/mocks/sessions';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function AdminSessions() {
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      setAllSessions(sessions);
      setLoading(false);
    }, 1000);
  }, []);

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
      setLoading(false);
    }, 1000);
  };

  // Define columns for DataTable
  const columns = [
    {
      title: 'مشاور',
      dataIndex: 'consultantName',
      key: 'consultant',
      sorter: (a, b) => a.consultantName.localeCompare(b.consultantName),
    },
    {
      title: 'مراجع',
      dataIndex: 'clientName',
      key: 'client',
      sorter: (a, b) => a.clientName.localeCompare(b.clientName),
    },
    {
      title: 'تاریخ',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
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
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  // Define filter options for DataTable
  const filterOptions = [
    {
      key: 'status',
      label: 'وضعیت',
      type: 'select',
      options: [
        { value: 'pending', label: 'در انتظار تأیید' },
        { value: 'confirmed', label: 'تأیید شده' },
        { value: 'completed', label: 'برگزار شده' },
        { value: 'cancelled', label: 'لغو شده' },
      ],
    },
    {
      key: 'dateRange',
      label: 'بازه زمانی',
      type: 'dateRange',
      placeholder: 'انتخاب تاریخ',
    },
  ];

  // Define row actions for DataTable
  const rowActions = [
    {
      key: 'view',
      label: 'جزئیات',
      icon: <EyeOutlined />,
      onClick: showSessionDetails,
    },
    {
      key: 'edit',
      label: 'ویرایش',
      icon: <EditOutlined />,
      onClick: showEditModal,
    },
  ];

  // Get tab items for DataTable
  const tabItems = [
    { key: 'all', label: 'همه جلسات' },
    { key: 'pending', label: 'در انتظار تأیید' },
    { key: 'confirmed', label: 'تأیید شده' },
    { key: 'completed', label: 'برگزار شده' },
    { key: 'cancelled', label: 'لغو شده' },
  ];

  // Handle tab change filtering
  const handleTabChange = (key) => {
    if (key === 'all') {
      return allSessions;
    }
    return allSessions.filter((session) => session.status === key);
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="مدیریت جلسات"
        description="نمایش و مدیریت تمامی جلسات مشاوره در سیستم."
      />

      <DataTable
        title="لیست جلسات"
        dataSource={allSessions}
        columns={columns}
        rowKey="id"
        loading={loading}
        rowActions={rowActions}
        filterOptions={filterOptions}
        searchPlaceholder="جستجوی نام مشاور یا مراجع"
        onSearch={(value) => {
          console.log('Search:', value);
          // در پیاده‌سازی واقعی، جستجو روی داده‌ها انجام می‌شود
        }}
        onFilter={(filters) => {
          console.log('Filters applied:', filters);
          // در پیاده‌سازی واقعی، فیلترها روی داده‌ها اعمال می‌شوند
        }}
        onRefresh={() => {
          setLoading(true);
          setTimeout(() => {
            setAllSessions([...sessions]);
            setLoading(false);
          }, 1000);
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} از ${total} جلسه`,
        }}
        tabs={{
          items: tabItems,
          onChange: handleTabChange,
        }}
      />

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
                <StatusBadge status={selectedSession.status} />
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
        onOk={() => form.submit()}
        okText="ذخیره تغییرات"
        cancelText="انصراف"
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
          </Form>
        )}
      </Modal>
    </div>
  );
}
