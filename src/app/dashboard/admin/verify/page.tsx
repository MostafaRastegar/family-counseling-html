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
  Badge,
  Button,
  Card,
  Descriptions,
  Empty,
  Form,
  List,
  Modal,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormModal from '@/components/common/FormModal';
import { consultants } from '@/mocks/consultants';

const { Title, Paragraph, Text } = Typography;

// فیلتر کردن فقط مشاوران تأیید نشده
const pendingConsultants = consultants.filter(
  (consultant) => !consultant.isVerified,
);

export default function AdminVerifyConsultants() {
  const [consultantsToVerify, setConsultantsToVerify] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false);
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

  // نمایش دیالوگ تایید رد درخواست
  const showRejectConfirmDialog = (consultant) => {
    setSelectedConsultant(consultant);
    setRejectDialogVisible(true);
  };

  // تایید رد درخواست
  const handleConfirmReject = () => {
    setRejectDialogVisible(false);
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

  // تعریف فیلدهای فرم رد درخواست
  const rejectFields = [
    {
      name: 'reason',
      label: 'دلیل رد درخواست',
      type: 'textarea',
      required: true,
      placeholder:
        'دلیل رد درخواست را وارد کنید. این متن برای مشاور ارسال خواهد شد.',
      rows: 4,
    },
    {
      name: 'additionalInfo',
      label: 'اطلاعات تکمیلی (اختیاری)',
      type: 'textarea',
      placeholder: 'در صورت نیاز، اطلاعات بیشتری را برای مشاور وارد کنید.',
      rows: 3,
    },
  ];

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
                    onClick={() => showRejectConfirmDialog(consultant)}
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
            onClick={() => showRejectConfirmDialog(selectedConsultant)}
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

      {/* دیالوگ تایید رد درخواست */}
      <ConfirmDialog
        visible={rejectDialogVisible}
        title="آیا از رد درخواست این مشاور اطمینان دارید؟"
        content="با رد درخواست، این مشاور نمی‌تواند در سیستم فعالیت کند و باید دلیل رد درخواست را مشخص کنید."
        type="warning"
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectDialogVisible(false)}
        confirmText="بله، رد شود"
        cancelText="انصراف"
        confirmButtonProps={{ danger: true }}
      />

      {/* مودال رد درخواست */}
      <FormModal
        title="رد درخواست مشاور"
        visible={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onSubmit={handleReject}
        submitText="رد درخواست"
        cancelText="انصراف"
        form={form}
        fields={rejectFields}
        loading={loading}
        layout="vertical"
        submitButton={{
          danger: true,
          type: 'primary',
        }}
        beforeForm={
          selectedConsultant && (
            <div className="mb-4">
              <Text>در حال رد درخواست مشاور:</Text>
              <div className="mt-1 font-bold">{selectedConsultant?.name}</div>
            </div>
          )
        }
      />
    </div>
  );
}
