'use client';

import React, { useState } from 'react';
import { BellOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Tabs,
  Typography,
  notification,
} from 'antd';
import type { TabsProps } from 'antd';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import PageHeader from '@/components/ui/PageHeader';
import FormActions from '@/components/ui/forms/FormActions';
import FormSection from '@/components/ui/forms/FormSection';
import { authData } from '@/mocks/auth';

const { Text } = Typography;
const { Option } = Select;

export default function SettingsPage() {
  const [generalForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationsForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Current user
  const currentUser = authData.currentUser;

  // Handle general settings submit
  const handleGeneralSubmit = (values: any) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'تنظیمات با موفقیت ذخیره شد',
        description: 'تنظیمات عمومی حساب شما با موفقیت به‌روزرسانی شد.',
      });
    }, 1000);
  };

  // Handle security settings submit
  const handleSecuritySubmit = (values: any) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'تنظیمات امنیتی به‌روزرسانی شد',
        description: 'تنظیمات امنیتی حساب شما با موفقیت به‌روزرسانی شد.',
      });

      // Reset password fields
      securityForm.resetFields([
        'currentPassword',
        'newPassword',
        'confirmPassword',
      ]);
    }, 1000);
  };

  // Handle notification settings submit
  const handleNotificationsSubmit = (values: any) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'تنظیمات اعلان‌ها به‌روزرسانی شد',
        description: 'تنظیمات اعلان‌های شما با موفقیت به‌روزرسانی شد.',
      });
    }, 1000);
  };

  // Settings tabs
  const tabs: TabsProps['items'] = [
    {
      key: 'general',
      label: (
        <span>
          <UserOutlined />
          تنظیمات عمومی
        </span>
      ),
      children: (
        <Form
          form={generalForm}
          layout="vertical"
          initialValues={{
            language: 'fa',
            timezone: 'Asia/Tehran',
            theme: 'light',
          }}
          onFinish={handleGeneralSubmit}
        >
          <FormSection
            title="تنظیمات زبان و منطقه زمانی"
            description="زبان و منطقه زمانی مورد نظر خود را انتخاب کنید"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="language"
                  label="زبان"
                  rules={[
                    { required: true, message: 'لطفاً زبان را انتخاب کنید' },
                  ]}
                >
                  <Select placeholder="انتخاب زبان">
                    <Option value="fa">فارسی</Option>
                    <Option value="en">English</Option>
                    <Option value="ar">العربية</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="timezone"
                  label="منطقه زمانی"
                  rules={[
                    {
                      required: true,
                      message: 'لطفاً منطقه زمانی را انتخاب کنید',
                    },
                  ]}
                >
                  <Select placeholder="انتخاب منطقه زمانی">
                    <Option value="Asia/Tehran">تهران (GMT+3:30)</Option>
                    <Option value="Asia/Dubai">دبی (GMT+4:00)</Option>
                    <Option value="Europe/London">لندن (GMT+0:00)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="theme"
              label="تم"
              rules={[{ required: true, message: 'لطفاً تم را انتخاب کنید' }]}
            >
              <Select placeholder="انتخاب تم">
                <Option value="light">روشن</Option>
                <Option value="dark">تیره</Option>
                <Option value="system">سیستم</Option>
              </Select>
            </Form.Item>
          </FormSection>

          <FormSection
            title="اطلاعات تماس"
            description="اطلاعات تماس خود را وارد کنید"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="ایمیل"
                  initialValue={currentUser?.email}
                  rules={[
                    { required: true, message: 'لطفاً ایمیل خود را وارد کنید' },
                    {
                      type: 'email',
                      message: 'لطفاً یک ایمیل معتبر وارد کنید',
                    },
                  ]}
                >
                  <Input placeholder="ایمیل خود را وارد کنید" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phoneNumber"
                  label="شماره تماس"
                  initialValue={currentUser?.phoneNumber}
                  rules={[
                    {
                      required: true,
                      message: 'لطفاً شماره تماس خود را وارد کنید',
                    },
                    {
                      pattern: /^09\d{9}$/,
                      message: 'شماره تماس نامعتبر است',
                    },
                  ]}
                >
                  <Input placeholder="مثال: 09123456789" />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          <FormActions
            submitText="ذخیره تنظیمات"
            loading={loading}
            showReset={true}
          />
        </Form>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined />
          امنیت و حریم خصوصی
        </span>
      ),
      children: (
        <Form
          form={securityForm}
          layout="vertical"
          onFinish={handleSecuritySubmit}
        >
          <FormSection
            title="تغییر رمز عبور"
            description="رمز عبور خود را به‌روزرسانی کنید"
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
              <Input.Password placeholder="رمز عبور فعلی خود را وارد کنید" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="رمز عبور جدید"
              rules={[
                { required: true, message: 'لطفاً رمز عبور جدید را وارد کنید' },
                { min: 8, message: 'رمز عبور باید حداقل 8 کاراکتر باشد' },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="رمز عبور جدید را وارد کنید" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="تکرار رمز عبور جدید"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'لطفاً رمز عبور جدید را تکرار کنید',
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
              <Input.Password placeholder="رمز عبور جدید را مجدد وارد کنید" />
            </Form.Item>
          </FormSection>

          <FormSection
            title="احراز هویت دو مرحله‌ای"
            description="امنیت حساب خود را با احراز هویت دو مرحله‌ای افزایش دهید"
          >
            <Form.Item
              name="twoFactorAuth"
              initialValue={false}
              valuePropName="checked"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>احراز هویت دو مرحله‌ای</Text>
                  <div className="text-gray-500">
                    با فعال کردن این گزینه، هنگام ورود به حساب کاربری، یک کد
                    تأیید به شماره تلفن یا ایمیل شما ارسال خواهد شد.
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>
          </FormSection>

          <FormActions submitText="ذخیره تنظیمات امنیتی" loading={loading} />
        </Form>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined />
          اعلان‌ها
        </span>
      ),
      children: (
        <Form
          form={notificationsForm}
          layout="vertical"
          initialValues={{
            emailNotifications: true,
            smsNotifications: true,
            sessionReminder: true,
            newMessage: true,
            systemUpdates: false,
            marketingEmails: false,
          }}
          onFinish={handleNotificationsSubmit}
        >
          <FormSection
            title="تنظیمات اعلان‌ها"
            description="نحوه دریافت اعلان‌ها و اطلاع‌رسانی‌ها را تنظیم کنید"
          >
            <Form.Item name="emailNotifications" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>اعلان‌های ایمیلی</Text>
                  <div className="text-gray-500">
                    دریافت اعلان‌ها و به‌روزرسانی‌ها از طریق ایمیل
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <Divider />

            <Form.Item name="smsNotifications" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>اعلان‌های پیامکی</Text>
                  <div className="text-gray-500">
                    دریافت اعلان‌ها و به‌روزرسانی‌ها از طریق پیامک
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>
          </FormSection>

          <FormSection
            title="اعلان‌های رویدادها"
            description="مشخص کنید که برای کدام رویدادها اعلان دریافت کنید"
          >
            <Form.Item name="sessionReminder" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>یادآوری جلسات</Text>
                  <div className="text-gray-500">
                    یادآوری‌های قبل از جلسات مشاوره
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <Divider />

            <Form.Item name="newMessage" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>پیام‌های جدید</Text>
                  <div className="text-gray-500">
                    اعلان دریافت پیام‌های جدید
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <Divider />

            <Form.Item name="systemUpdates" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>به‌روزرسانی‌های سیستم</Text>
                  <div className="text-gray-500">
                    اطلاع‌رسانی درباره تغییرات و به‌روزرسانی‌های سیستم
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>

            <Divider />

            <Form.Item name="marketingEmails" valuePropName="checked">
              <div className="flex items-center justify-between">
                <div>
                  <Text strong>ایمیل‌های تبلیغاتی</Text>
                  <div className="text-gray-500">
                    دریافت اخبار، پیشنهادات و تخفیف‌های ویژه
                  </div>
                </div>
                <Switch />
              </div>
            </Form.Item>
          </FormSection>

          <FormActions submitText="ذخیره تنظیمات اعلان‌ها" loading={loading} />
        </Form>
      ),
    },
  ];

  return (
    <div className="settings-page">
      <DashboardBreadcrumb />

      <PageHeader
        title="تنظیمات حساب کاربری"
        subtitle="تنظیمات و پیکربندی حساب کاربری خود را مدیریت کنید"
      />

      <Card>
        <Tabs defaultActiveKey="general" items={tabs} />
      </Card>
    </div>
  );
}
