import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Result, Typography } from 'antd';

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!token) {
      setError(
        'توکن بازیابی نامعتبر است. لطفاً مجدداً درخواست بازیابی رمز عبور دهید.',
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <Result
        icon={<CheckCircleOutlined className="text-green-500" />}
        extra={[
          <Button
            type="primary"
            key="login"
            onClick={() => router.push('/auth/login')}
          >
            ورود به حساب کاربری
          </Button>,
        ]}
      />
    );
  }

  return (
    <div className="reset-password-form-container">
      {error && (
        <Alert
          message="خطا"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {!token && (
        <Alert
          message="توکن نامعتبر"
          description="لینک بازیابی رمز عبور نامعتبر یا منقضی شده است. لطفاً مجدداً درخواست بازیابی رمز عبور دهید."
          type="error"
          showIcon
          className="mb-4"
          action={
            <Button
              size="small"
              onClick={() => router.push('/auth/forgot-password')}
            >
              درخواست مجدد
            </Button>
          }
        />
      )}

      <Form
        form={form}
        name="resetPassword"
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        disabled={!token}
      >
        <Form.Item
          name="password"
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
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="تکرار رمز عبور جدید"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'لطفا رمز عبور جدید را تکرار کنید' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
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
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSubmitting}
            disabled={!token}
          >
            تغییر رمز عبور
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
