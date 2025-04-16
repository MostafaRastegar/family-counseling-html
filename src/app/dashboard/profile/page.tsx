'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ExclamationCircleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Space,
  Tabs,
  Typography,
  Upload,
  message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Password } = Input;
const { confirm } = Modal;

// داده‌های نمونه برای کاربر
const mockUser = {
  id: 1,
  fullName: 'علی محمدی',
  email: 'ali@example.com',
  phoneNumber: '09123456789',
  role: 'consultant',
  profileImage: null, // در حالت واقعی، آدرس تصویر قرار می‌گیرد
};

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌های کاربر از API
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);

      // پر کردن فرم با داده‌های کاربر
      profileForm.setFieldsValue({
        fullName: mockUser.fullName,
        email: mockUser.email,
        phoneNumber: mockUser.phoneNumber,
      });

      if (mockUser.profileImage) {
        setImageUrl(mockUser.profileImage);
      }
    }, 1000);
  }, [profileForm]);

  // بروزرسانی اطلاعات شخصی
  const handleProfileUpdate = (values) => {
    setSaving(true);

    // شبیه‌سازی ارسال درخواست به API
    setTimeout(() => {
      setUser({
        ...user,
        ...values,
      });

      message.success('اطلاعات شخصی با موفقیت بروزرسانی شد!');
      setSaving(false);
    }, 1500);
  };

  // تغییر رمز عبور
  const handlePasswordChange = (values) => {
    setSaving(true);

    // شبیه‌سازی ارسال درخواست به API
    setTimeout(() => {
      message.success('رمز عبور با موفقیت تغییر کرد!');
      setSaving(false);
      passwordForm.resetFields();
    }, 1500);
  };

  // تأیید قبل از تغییر ایمیل
  const confirmEmailChange = (newEmail) => {
    if (newEmail !== user.email) {
      confirm({
        title: 'آیا از تغییر ایمیل خود مطمئن هستید؟',
        icon: <ExclamationCircleOutlined />,
        content:
          'بعد از این تغییر، شما باید ایمیل جدید خود را تأیید کنید و مجدداً وارد سیستم شوید.',
        okText: 'بله، تغییر بده',
        cancelText: 'انصراف',
        onOk() {
          // ادامه روند ذخیره فرم
          profileForm.submit();
        },
        onCancel() {
          // بازگرداندن ایمیل به مقدار قبلی
          profileForm.setFieldsValue({
            email: user.email,
          });
        },
      });
      return false; // جلوگیری از ادامه روند ذخیره
    }
    return true; // ادامه روند ذخیره
  };

  // آپلود تصویر پروفایل
  const handleImageUpload = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      // در حالت واقعی، از URL تصویر آپلود شده از سرور استفاده می‌شود
      // اما در اینجا از FileReader برای نمایش تصویر استفاده می‌کنیم
      getBase64(info.file.originFileObj, (url) => {
        setUploadLoading(false);
        setImageUrl(url);
        message.success('تصویر پروفایل با موفقیت آپلود شد!');
      });
    }
  };

  // کاستومایز آپلود تصویر
  const uploadButton = (
    <div>
      {uploadLoading ? (
        <div className="animate-spin">⏳</div>
      ) : (
        <UploadOutlined />
      )}
      <div style={{ marginTop: 8 }}>آپلود تصویر</div>
    </div>
  );

  // تبدیل فایل به Base64 برای نمایش
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  // بررسی نوع فایل آپلود شده
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('فقط فایل‌های JPG/PNG مجاز هستند!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('حجم تصویر باید کمتر از 2MB باشد!');
    }

    return isJpgOrPng && isLt2M;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-2">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2}>پروفایل کاربری</Title>
      <Paragraph className="mb-8 text-gray-500">
        مشاهده و ویرایش اطلاعات شخصی حساب کاربری شما.
      </Paragraph>

      <Card>
        <div className="mb-8 flex flex-col md:flex-row">
          <div className="mb-6 flex flex-col items-center md:mb-0 md:w-1/4">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" // آدرس API آپلود در حالت واقعی
              beforeUpload={beforeUpload}
              onChange={handleImageUpload}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={user.fullName}
                  style={{ width: '100%', borderRadius: '100%' }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
            <Text className="mt-2 text-lg font-bold">{user.fullName}</Text>
            <Text className="text-gray-500">{user.email}</Text>
          </div>

          <div className="md:w-3/4 md:pr-8">
            <Descriptions title="اطلاعات حساب کاربری" column={1} bordered>
              <Descriptions.Item label="نقش کاربری">
                {user.role === 'admin'
                  ? 'مدیر'
                  : user.role === 'consultant'
                    ? 'مشاور'
                    : 'مراجع'}
              </Descriptions.Item>
              <Descriptions.Item label="شماره تماس">
                {user.phoneNumber || 'تنظیم نشده'}
              </Descriptions.Item>
              <Descriptions.Item label="تاریخ عضویت">
                1401/01/15
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Divider />

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <UserOutlined />
                اطلاعات شخصی
              </span>
            }
            key="1"
          >
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileUpdate}
              onValuesChange={(changedValues) => {
                if (changedValues.email) {
                  confirmEmailChange(changedValues.email);
                }
              }}
            >
              <Form.Item
                name="fullName"
                label="نام و نام خانوادگی"
                rules={[
                  {
                    required: true,
                    message: 'لطفاً نام و نام خانوادگی خود را وارد کنید',
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="email"
                label="ایمیل"
                rules={[
                  { required: true, message: 'لطفاً ایمیل خود را وارد کنید' },
                  { type: 'email', message: 'ایمیل وارد شده معتبر نیست' },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label="شماره تماس"
                rules={[
                  {
                    required: true,
                    message: 'لطفاً شماره تماس خود را وارد کنید',
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={saving}
                >
                  ذخیره تغییرات
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LockOutlined />
                تغییر رمز عبور
              </span>
            }
            key="2"
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="رمز عبور فعلی"
                rules={[
                  {
                    required: true,
                    message: 'لطفاً رمز عبور فعلی خود را وارد کنید',
                  },
                ]}
              >
                <Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="رمز عبور جدید"
                rules={[
                  {
                    required: true,
                    message: 'لطفاً رمز عبور جدید را وارد کنید',
                  },
                  { min: 6, message: 'رمز عبور باید حداقل 6 کاراکتر باشد' },
                ]}
              >
                <Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="تکرار رمز عبور جدید"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: 'لطفاً تکرار رمز عبور جدید را وارد کنید',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('رمز عبور و تکرار آن مطابقت ندارند'),
                      );
                    },
                  }),
                ]}
              >
                <Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={saving}
                >
                  تغییر رمز عبور
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
