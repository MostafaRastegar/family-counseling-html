import React, { useState } from 'react';
import { LockOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  notification,
} from 'antd';

const { Title, Paragraph } = Typography;

interface PasswordChangeFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  loading?: boolean;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onCancel,
  onSuccess,
  loading: outerLoading,
}) => {
  const [form] = Form.useForm();
  const [innerLoading, setInnerLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // اگر loading از خارج کنترل می‌شود، از آن استفاده می‌کنیم
  // در غیر این صورت از وضعیت داخلی استفاده می‌کنیم
  const loading = outerLoading !== undefined ? outerLoading : innerLoading;

  const handleSubmit = async (values: any) => {
    const { currentPassword, newPassword } = values;

    // پاک کردن وضعیت‌های خطا یا موفقیت قبلی
    setError(null);
    setSuccess(false);

    // اگر loading از بیرون کنترل نمی‌شود، وضعیت داخلی را تنظیم می‌کنیم
    if (outerLoading === undefined) {
      setInnerLoading(true);
    }

    try {
      // در حالت واقعی، اینجا باید درخواست تغییر رمز عبور به سرور ارسال شود
      // اما فعلا یک موفقیت شبیه‌سازی شده نشان می‌دهیم
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // شبیه‌سازی بررسی رمز عبور فعلی
      if (currentPassword === 'wrong-password') {
        throw new Error('رمز عبور فعلی صحیح نیست');
      }

      // تنظیم وضعیت موفقیت
      setSuccess(true);

      // نمایش پیام موفقیت
      notification.success({
        message: 'رمز عبور با موفقیت تغییر کرد',
        description:
          'رمز عبور شما با موفقیت تغییر کرد. لطفاً در دفعات بعدی از رمز عبور جدید استفاده کنید.',
      });

      // پاک کردن فرم
      form.resetFields();

      // فراخوانی تابع callback موفقیت
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // تنظیم پیام خطا
      setError(
        err instanceof Error
          ? err.message
          : 'خطایی در تغییر رمز عبور رخ داده است',
      );

      // نمایش نوتیفیکیشن خطا
      notification.error({
        message: 'خطا در تغییر رمز عبور',
        description:
          err instanceof Error
            ? err.message
            : 'خطایی در تغییر رمز عبور رخ داده است. لطفا مجددا تلاش کنید.',
      });
    } finally {
      // اگر loading از بیرون کنترل نمی‌شود، وضعیت داخلی را تنظیم می‌کنیم
      if (outerLoading === undefined) {
        setInnerLoading(false);
      }
    }
  };

  return (
    <Card className="password-change-form">
      <div className="mb-6">
        <Title level={4}>تغییر رمز عبور</Title>
        <Paragraph type="secondary">
          برای تغییر رمز عبور، ابتدا رمز عبور فعلی و سپس رمز عبور جدید خود را
          وارد کنید.
        </Paragraph>
      </div>

      {error && (
        <Alert
          message="خطا"
          description={error}
          type="error"
          showIcon
          className="mb-4"
          closable
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Alert
          message="رمز عبور با موفقیت تغییر کرد"
          type="success"
          showIcon
          className="mb-4"
          closable
          onClose={() => setSuccess(false)}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="currentPassword"
          label="رمز عبور فعلی"
          rules={[
            { required: true, message: 'لطفا رمز عبور فعلی خود را وارد کنید' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="رمز عبور فعلی خود را وارد کنید"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="رمز عبور جدید"
          rules={[
            { required: true, message: 'لطفا رمز عبور جدید را وارد کنید' },
            { min: 8, message: 'رمز عبور باید حداقل 8 کاراکتر باشد' },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="رمز عبور جدید را وارد کنید"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="تکرار رمز عبور جدید"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: 'لطفا رمز عبور جدید را تکرار کنید' },
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
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="رمز عبور جدید را مجدد وارد کنید"
          />
        </Form.Item>

        <div className="mt-4 flex justify-end">
          <Space>
            {onCancel && <Button onClick={onCancel}>انصراف</Button>}
            <Button type="primary" htmlType="submit" loading={loading}>
              تغییر رمز عبور
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default PasswordChangeForm;
