import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Result, Typography } from 'antd';
import AuthLayout from '../layouts/AuthLayout';

const { Title, Text, Paragraph } = Typography;

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (values: ForgotPasswordFormValues) => {
    const { email } = values;

    // شبیه‌سازی ارسال درخواست
    setIsSubmitting(true);
    setError(null);

    // در حالت واقعی باید درخواست به سرور ارسال شود
    // اما فعلاً شبیه‌سازی می‌کنیم
    setTimeout(() => {
      setIsSubmitting(false);

      // شبیه‌سازی موفقیت
      setIsSubmitted(true);

      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
  };

  // اگر فرم با موفقیت ارسال شده باشد، نتیجه را نشان می‌دهیم
  if (isSubmitted) {
    return (
      <AuthLayout
        title="ایمیل بازیابی ارسال شد"
        subtitle={
          <div className="text-center">
            <Paragraph>
              لینک بازیابی رمز عبور به آدرس ایمیل شما ارسال شد. لطفاً صندوق
              ورودی خود را بررسی کنید.
            </Paragraph>
            <Paragraph className="text-gray-500">
              اگر ایمیلی دریافت نکردید، پوشه اسپم را بررسی کنید یا مجدداً تلاش
              نمایید.
            </Paragraph>
          </div>
        }
      >
        <Result
          icon={<CheckCircleOutlined className="text-green-500" />}
          extra={[
            <Button
              type="primary"
              key="login"
              onClick={() => router.push('/auth/login')}
            >
              بازگشت به صفحه ورود
            </Button>,
            <Button
              key="retry"
              onClick={() => {
                setIsSubmitted(false);
                form.resetFields();
              }}
            >
              ارسال مجدد
            </Button>,
          ]}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="بازیابی رمز عبور"
      subtitle="لطفاً آدرس ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود"
    >
      <div className="forgot-password-form-container">
        {error && (
          <Alert
            message="خطا"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          form={form}
          name="forgotPassword"
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'لطفا ایمیل خود را وارد کنید' },
              { type: 'email', message: 'لطفا یک ایمیل معتبر وارد کنید' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="ایمیل خود را وارد کنید"
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
            >
              ارسال لینک بازیابی
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text>
              <Link href="/auth/login" className="text-primary-500">
                <Text className="hover:text-primary-600">
                  بازگشت به صفحه ورود
                </Text>
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
