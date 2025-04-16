'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Popconfirm,
  Rate,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import { consultants } from '@/mocks/consultants';
// داده‌های نمونه
import { reviews } from '@/mocks/reviews';
// داده‌های نمونه
import { sessions } from '@/mocks/sessions';

// داده‌های نمونه

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

export default function AdminConsultants() {
  const [allConsultants, setAllConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [consultantReviews, setConsultantReviews] = useState([]);
  const [consultantSessions, setConsultantSessions] = useState([]);

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      setAllConsultants(consultants);
      setLoading(false);
    }, 1000);
  }, []);

  // فیلتر کردن مشاوران
  const filteredConsultants = allConsultants.filter(
    (consultant) =>
      consultant.name.toLowerCase().includes(searchText.toLowerCase()) ||
      consultant.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchText.toLowerCase()),
      ),
  );

  // نمایش جزئیات مشاور
  const showConsultantDetails = (consultant) => {
    setSelectedConsultant(consultant);

    // فیلتر کردن نظرات مربوط به این مشاور
    const filteredReviews = reviews.filter(
      (review) => review.consultantId === consultant.id,
    );
    setConsultantReviews(filteredReviews);

    // فیلتر کردن جلسات مربوط به این مشاور
    const filteredSessions = sessions.filter(
      (session) => session.consultantId === consultant.id,
    );
    setConsultantSessions(filteredSessions);

    setDetailModalVisible(true);
  };

  // تغییر وضعیت تأیید مشاور
  const handleVerificationChange = (consultantId, isVerified) => {
    const updatedConsultants = allConsultants.map((consultant) => {
      if (consultant.id === consultantId) {
        return { ...consultant, isVerified };
      }
      return consultant;
    });

    setAllConsultants(updatedConsultants);

    if (selectedConsultant && selectedConsultant.id === consultantId) {
      setSelectedConsultant({ ...selectedConsultant, isVerified });
    }

    message.success(`مشاور با موفقیت ${isVerified ? 'تأیید' : 'رد'} شد`);
  };

  // حذف مشاور
  const handleDelete = (consultantId) => {
    setAllConsultants(
      allConsultants.filter((consultant) => consultant.id !== consultantId),
    );
    message.success('مشاور با موفقیت حذف شد!');
  };

  // ستون‌های جدول
  const columns = [
    {
      title: 'نام و نام خانوادگی',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.image} icon={!record.image && <UserOutlined />} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'تخصص‌ها',
      dataIndex: 'specialties',
      key: 'specialties',
      render: (specialties) => (
        <span>
          {specialties.map((specialty, index) => {
            if (index < 2) {
              return (
                <Tag color="blue" key={specialty}>
                  {specialty}
                </Tag>
              );
            }
            return index === 2 ? (
              <Tag key="more">+{specialties.length - 2}</Tag>
            ) : null;
          })}
        </span>
      ),
    },
    {
      title: 'امتیاز',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Space>
          <Rate disabled defaultValue={rating} style={{ fontSize: '14px' }} />
          <span>({rating})</span>
        </Space>
      ),
    },
    {
      title: 'وضعیت تأیید',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified) =>
        isVerified ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            تأیید شده
          </Tag>
        ) : (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            تأیید نشده
          </Tag>
        ),
    },
    {
      title: 'عملیات',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => showConsultantDetails(record)}
              >
                مشاهده جزئیات
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>
                <Link href={`/dashboard/admin/consultants/edit/${record.id}`}>
                  ویرایش
                </Link>
              </Menu.Item>
              <Menu.Divider />
              {record.isVerified ? (
                <Menu.Item
                  key="reject"
                  icon={<CloseCircleOutlined />}
                  danger
                  onClick={() => handleVerificationChange(record.id, false)}
                >
                  لغو تأیید
                </Menu.Item>
              ) : (
                <Menu.Item
                  key="verify"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleVerificationChange(record.id, true)}
                >
                  تأیید مشاور
                </Menu.Item>
              )}
              <Menu.Divider />
              <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
                <Popconfirm
                  title="آیا از حذف این مشاور مطمئن هستید؟"
                  onConfirm={() => handleDelete(record.id)}
                  okText="بله"
                  cancelText="خیر"
                >
                  حذف مشاور
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="container mx-auto">
      <Title level={2}>مدیریت مشاوران</Title>
      <Paragraph className="mb-8 text-gray-500">
        مدیریت تمامی مشاوران فعال در سیستم و بررسی عملکرد آن‌ها.
      </Paragraph>

      <Card>
        {/* ابزار جستجو */}
        <div className="mb-6">
          <Input
            placeholder="جستجو بر اساس نام یا تخصص"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </div>

        {/* جدول مشاوران */}
        <Table
          columns={columns}
          dataSource={filteredConsultants}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} از ${total} مشاور`,
          }}
        />
      </Card>

      {/* مودال جزئیات مشاور */}
      <Modal
        title="جزئیات مشاور"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            بستن
          </Button>,
        ]}
      >
        {selectedConsultant && (
          <div>
            <div className="mb-6 flex items-center">
              <Avatar
                size={80}
                src={selectedConsultant.image}
                icon={!selectedConsultant.image && <UserOutlined />}
                className="ml-4"
              />
              <div>
                <Title level={4} className="mb-1">
                  {selectedConsultant.name}
                </Title>
                <div className="mb-2">
                  {selectedConsultant.isVerified ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      تأیید شده
                    </Tag>
                  ) : (
                    <Tag color="error" icon={<CloseCircleOutlined />}>
                      تأیید نشده
                    </Tag>
                  )}
                </div>
                <div>
                  {selectedConsultant.specialties.map((specialty) => (
                    <Tag color="blue" key={specialty} className="mb-1 ml-1">
                      {specialty}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            <Row gutter={16} className="mb-6">
              <Col span={8}>
                <Statistic
                  title="امتیاز"
                  value={selectedConsultant.rating}
                  precision={1}
                  suffix={<StarOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="تعداد نظرات"
                  value={selectedConsultant.reviewCount}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="جلسات"
                  value={consultantSessions.length}
                  suffix={<CalendarOutlined />}
                />
              </Col>
            </Row>

            <Tabs defaultActiveKey="1">
              <TabPane tab="اطلاعات شخصی" key="1">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="شرح حال">
                    {selectedConsultant.bio}
                  </Descriptions.Item>
                  <Descriptions.Item label="تحصیلات و سوابق">
                    {selectedConsultant.education}
                  </Descriptions.Item>
                  {selectedConsultant.consultantLicense && (
                    <Descriptions.Item label="شماره پروانه مشاوره">
                      {selectedConsultant.consultantLicense}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </TabPane>
              <TabPane tab={`نظرات (${consultantReviews.length})`} key="2">
                {consultantReviews.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={consultantReviews}
                    renderItem={(review) => (
                      <List.Item>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <Text strong>{review.clientName}</Text>
                            <Text type="secondary">{review.date}</Text>
                          </div>
                          <Rate
                            disabled
                            defaultValue={review.rating}
                            className="mb-2"
                          />
                          <Paragraph>{review.comment}</Paragraph>
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="py-4 text-center">
                    <Text type="secondary">
                      هیچ نظری برای این مشاور ثبت نشده است
                    </Text>
                  </div>
                )}
              </TabPane>
              <TabPane tab={`جلسات (${consultantSessions.length})`} key="3">
                {consultantSessions.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={consultantSessions}
                    renderItem={(session) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <Space>
                              <Text>{session.clientName}</Text>
                              <Tag
                                color={
                                  session.status === 'completed'
                                    ? 'success'
                                    : session.status === 'cancelled'
                                      ? 'error'
                                      : session.status === 'confirmed'
                                        ? 'processing'
                                        : 'warning'
                                }
                              >
                                {session.status === 'completed'
                                  ? 'برگزار شده'
                                  : session.status === 'cancelled'
                                    ? 'لغو شده'
                                    : session.status === 'confirmed'
                                      ? 'تأیید شده'
                                      : 'در انتظار تأیید'}
                              </Tag>
                            </Space>
                          }
                          description={
                            <Space direction="vertical">
                              <Text>
                                {session.date} - ساعت {session.time}
                              </Text>
                              {session.notes && (
                                <Text type="secondary">
                                  یادداشت: {session.notes}
                                </Text>
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="py-4 text-center">
                    <Text type="secondary">
                      هیچ جلسه‌ای برای این مشاور ثبت نشده است
                    </Text>
                  </div>
                )}
              </TabPane>
            </Tabs>

            <Divider />

            <div className="flex justify-between">
              <Space>
                <Button
                  type={selectedConsultant.isVerified ? 'default' : 'primary'}
                  icon={<CheckCircleOutlined />}
                  onClick={() =>
                    handleVerificationChange(selectedConsultant.id, true)
                  }
                  disabled={selectedConsultant.isVerified}
                >
                  تأیید مشاور
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() =>
                    handleVerificationChange(selectedConsultant.id, false)
                  }
                  disabled={!selectedConsultant.isVerified}
                >
                  لغو تأیید
                </Button>
              </Space>
              <Link
                href={`/dashboard/admin/consultants/edit/${selectedConsultant.id}`}
              >
                <Button type="default" icon={<EditOutlined />}>
                  ویرایش اطلاعات
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
