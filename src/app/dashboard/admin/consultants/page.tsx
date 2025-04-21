'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Descriptions,
  Divider,
  List,
  Modal,
  Rate,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
  message,
} from 'antd';
import DataTable from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import { consultants } from '@/mocks/consultants';
import { reviews } from '@/mocks/reviews';
import { sessions } from '@/mocks/sessions';

const { TabPane } = Tabs;

export default function AdminConsultants() {
  const [allConsultants, setAllConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Define columns for DataTable
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
      sorter: (a, b) => a.rating - b.rating,
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
      filters: [
        { text: 'تأیید شده', value: true },
        { text: 'تأیید نشده', value: false },
      ],
      onFilter: (value, record) => record.isVerified === value,
    },
  ];

  // Define filter options
  const filterOptions = [
    {
      key: 'specialties',
      label: 'تخصص',
      type: 'select',
      mode: 'multiple',
      options: [
        { value: 'مشاوره خانواده', label: 'مشاوره خانواده' },
        { value: 'روابط زناشویی', label: 'روابط زناشویی' },
        { value: 'فرزندپروری', label: 'فرزندپروری' },
        { value: 'مشاوره تحصیلی', label: 'مشاوره تحصیلی' },
      ],
    },
    {
      key: 'rating',
      label: 'حداقل امتیاز',
      type: 'select',
      options: [
        { value: 5, label: '5 ستاره' },
        { value: 4, label: '4 ستاره و بالاتر' },
        { value: 3, label: '3 ستاره و بالاتر' },
      ],
    },
  ];

  // Define row actions
  const rowActions = (record) => [
    {
      key: 'view',
      label: 'مشاهده جزئیات',
      icon: <UserOutlined />,
      onClick: () => showConsultantDetails(record),
    },
    {
      key: 'edit',
      label: 'ویرایش',
      icon: <EditOutlined />,
      href: `/dashboard/admin/consultants/edit/${record.id}`,
    },
    record.isVerified
      ? {
          key: 'reject',
          label: 'لغو تأیید',
          icon: <CloseCircleOutlined />,
          danger: true,
          onClick: () => handleVerificationChange(record.id, false),
        }
      : {
          key: 'verify',
          label: 'تأیید مشاور',
          icon: <CheckCircleOutlined />,
          onClick: () => handleVerificationChange(record.id, true),
        },
    {
      key: 'delete',
      label: 'حذف مشاور',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: 'آیا از حذف این مشاور مطمئن هستید؟',
          icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
          content: 'با حذف مشاور، تمامی اطلاعات مربوط به آن نیز حذف خواهد شد.',
          okText: 'بله',
          cancelText: 'خیر',
          onOk: () => handleDelete(record.id),
        });
      },
    },
  ];

  return (
    <div className="container mx-auto">
      <PageHeader
        title="مدیریت مشاوران"
        description="مدیریت تمامی مشاوران فعال در سیستم و بررسی عملکرد آن‌ها."
      />

      <DataTable
        title="لیست مشاوران"
        dataSource={allConsultants}
        columns={columns}
        rowKey="id"
        rowActions={rowActions}
        filterOptions={filterOptions}
        searchPlaceholder="جستجو بر اساس نام یا تخصص"
        loading={loading}
        onRefresh={() => {
          setLoading(true);
          setTimeout(() => {
            setAllConsultants([...consultants]);
            setLoading(false);
          }, 1000);
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} از ${total} مشاور`,
        }}
      />

      {/* مودال جزئیات مشاور */}
      <Modal
        title="جزئیات مشاور"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="edit" type="default" icon={<EditOutlined />}>
            <Link
              href={
                selectedConsultant
                  ? `/dashboard/admin/consultants/edit/${selectedConsultant.id}`
                  : '#'
              }
            >
              ویرایش اطلاعات
            </Link>
          </Button>,
          selectedConsultant?.isVerified ? (
            <Button
              key="reject"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() =>
                handleVerificationChange(selectedConsultant.id, false)
              }
              disabled={!selectedConsultant}
            >
              لغو تأیید
            </Button>
          ) : (
            <Button
              key="verify"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() =>
                handleVerificationChange(selectedConsultant?.id, true)
              }
              disabled={!selectedConsultant}
            >
              تأیید مشاور
            </Button>
          ),
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
                <h4 className="mb-1 text-xl font-bold">
                  {selectedConsultant.name}
                </h4>
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
                            <span className="font-medium">
                              {review.clientName}
                            </span>
                            <span className="text-gray-500">{review.date}</span>
                          </div>
                          <Rate
                            disabled
                            defaultValue={review.rating}
                            className="mb-2"
                          />
                          <p>{review.comment}</p>
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="py-4 text-center">
                    <span className="text-gray-500">
                      هیچ نظری برای این مشاور ثبت نشده است
                    </span>
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
                              <span>{session.clientName}</span>
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
                              <span>
                                {session.date} - ساعت {session.time}
                              </span>
                              {session.notes && (
                                <span className="text-gray-500">
                                  یادداشت: {session.notes}
                                </span>
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="py-4 text-center">
                    <span className="text-gray-500">
                      هیچ جلسه‌ای برای این مشاور ثبت نشده است
                    </span>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  );
}
