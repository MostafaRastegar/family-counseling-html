'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { consultants } from '@/mocks/consultants';

// داده‌های نمونه

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// فیلتر کردن فقط مشاوران تأیید نشده
const pendingConsultants = consultants.filter(
  (consultant) => !consultant.isVerified,
);

export default function AdminVerifyConsultants() {
  const [consultantsToVerify, setConsultantsToVerify] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      setConsultantsToVerify(pendingConsultants);
      setLoading(false);
    }, 1000);
  }, []);

  // نمایش جزئیات مشاور
  const showConsultantDetails = (consultant) => {
    setSelectedConsultant(consultant);
    setDetailModalVisible(true);
  };

  // تأیید مشاور
  const handleApprove = (consultantId) => {
    setLoading(true);

    setTimeout(() => {
      // حذف مشاور از لیست در انتظار تأیید
      setConsultantsToVerify(
        consultantsToVerify.filter((c) => c.id !== consultantId),
      );
      setDetailModalVisible(false);
      message.success('مشاور با موفقیت تأیید شد!');
      setLoading(false);
    }, 1000);
  };

  // نمایش مودال رد درخواست
  const showRejectModal = (consultant) => {
    setSelectedConsultant(consultant);
    setDetailModalVisible(false);
    setRejectModalVisible(true);
  };

  // رد درخواست مشاور
  const handleReject = (values) => {
    setLoading(true);

    setTimeout(() => {
      // حذف مشاور از لیست در انتظار تأیید
      setConsultantsToVerify(
        consultantsToVerify.filter((c) => c.id !== selectedConsultant.id),
      );
      setRejectModalVisible(false);
      message.success('درخواست مشاور رد شد!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto">
      <Title level={2}>تأیید مشاوران</Title>
      <Paragraph className="mb-8 text-gray-500">
        درخواست‌های جدید مشاوران برای تأیید و فعال‌سازی حساب کاربری.
      </Paragraph>

      <Card>
        {consultantsToVerify.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={consultantsToVerify}
            loading={loading}
            renderItem={(consultant) => (
              <List.Item
                actions={[
                  <Button
                    key="view"
                    onClick={() => showConsultantDetails(consultant)}
                  >
                    مشاهده جزئیات
                  </Button>,
                  <Button
                    key="approve"
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleApprove(consultant.id)}
                  >
                    تأیید
                  </Button>,
                  <Button
                    key="reject"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => showRejectModal(consultant)}
                  >
                    رد
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size="large"
                      src={consultant.image}
                      icon={!consultant.image && <UserOutlined />}
                    />
                  }
                  title={consultant.name}
                  description={
                    <Space direction="vertical">
                      <Space>
                        {consultant.specialties.map((specialty) => (
                          <Tag key={specialty} color="blue">
                            {specialty}
                          </Tag>
                        ))}
                      </Space>
                      <Text type="secondary" ellipsis={{ rows: 2 }}>
                        {consultant.bio.substring(0, 100)}...
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="هیچ درخواست تأییدی وجود ندارد"
          />
        )}
      </Card>

      {/* مودال جزئیات مشاور */}
      <Modal
        title="جزئیات درخواست مشاور"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={700}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            بستن
          </Button>,
          <Button
            key="reject"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => showRejectModal(selectedConsultant)}
          >
            رد درخواست
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(selectedConsultant?.id)}
          >
            تأیید مشاور
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
                <Title level={4} className="mb-2">
                  {selectedConsultant.name}
                </Title>
                <Space>
                  {selectedConsultant.specialties.map((specialty) => (
                    <Tag color="blue" key={specialty}>
                      {specialty}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>

            <Descriptions
              title="اطلاعات شخصی"
              bordered
              column={1}
              className="mb-4"
            >
              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined /> ایمیل
                  </Space>
                }
              >
                example@mail.com
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <PhoneOutlined /> شماره تماس
                  </Space>
                }
              >
                09123456789
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="اطلاعات تخصصی"
              bordered
              column={1}
              className="mb-4"
            >
              <Descriptions.Item label="شرح حال">
                {selectedConsultant.bio}
              </Descriptions.Item>
              <Descriptions.Item label="تحصیلات و سوابق">
                {selectedConsultant.education}
              </Descriptions.Item>
              {selectedConsultant.consultantLicense && (
                <Descriptions.Item
                  label={
                    <Space>
                      <FileTextOutlined /> شماره پروانه مشاوره
                    </Space>
                  }
                >
                  {selectedConsultant.consultantLicense}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="bg-yellow-50 border-yellow-200 mb-4 rounded border p-4">
              <Space>
                <QuestionCircleOutlined className="text-yellow-500" />
                <Text>
                  لطفاً قبل از تأیید مشاور، اطلاعات و مدارک ارائه شده را به دقت
                  بررسی کنید.
                </Text>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* مودال رد درخواست */}
      <Modal
        title="رد درخواست مشاور"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleReject}>
          <div className="mb-4">
            <Text>در حال رد درخواست مشاور:</Text>
            <div className="mt-1 font-bold">{selectedConsultant?.name}</div>
          </div>

          <Form.Item
            name="reason"
            label="دلیل رد درخواست"
            rules={[
              { required: true, message: 'لطفاً دلیل رد درخواست را وارد کنید' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="دلیل رد درخواست را وارد کنید. این متن برای مشاور ارسال خواهد شد."
            />
          </Form.Item>

          <Form.Item name="additionalInfo" label="اطلاعات تکمیلی (اختیاری)">
            <TextArea
              rows={3}
              placeholder="در صورت نیاز، اطلاعات بیشتری را برای مشاور وارد کنید."
            />
          </Form.Item>

          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setRejectModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" danger htmlType="submit" loading={loading}>
                رد درخواست
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
