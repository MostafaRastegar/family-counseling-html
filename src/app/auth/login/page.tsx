'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Typography, message } from 'antd';
import FormBuilder from '@/components/common/FormBuilder';

const { Title, Paragraph } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginFields = [
    {
      name: 'email',
      label: 'ایمیل',
      type: 'email',
      required: true,
      prefix: <MailOutlined />,
      placeholder: 'ایمیل',
      rules: [{ type: 'email', message: 'ایمیل وارد شده معتبر نیست!' }],
    },
    {
      name: 'password',
      label: 'رمز عبور',
      type: 'password',
      required: true,
      prefix: <LockOutlined />,
      placeholder: 'رمز عبور',
    },
    {
      name: 'remember',
      type: 'checkbox',
      text: 'مرا به خاطر بسپار',
      initialValue: true,
    },
  ];

  const onFinish = (values) => {
    setLoading(true);

    // شبیه‌سازی ارسال درخواست به سرور
    setTimeout(() => {
      setLoading(false);
      console.log('Login values:', values);
      message.success('ورود با موفقیت انجام شد!');

      // در حالت استاتیک، هدایت به داشبورد
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Title level={2}>ورود به حساب کاربری</Title>
          <Paragraph className="text-gray-500">
            به سامانه مشاوره خانواده خوش آمدید
          </Paragraph>
        </div>

        <FormBuilder
          form={form}
          fields={loginFields}
          onFinish={onFinish}
          layout="vertical"
          submitButton={{
            text: 'ورود',
            loading: loading,
            block: true,
            size: 'large',
          }}
          footer={
            <div className="mt-2 text-left">
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-500"
              >
                فراموشی رمز عبور
              </Link>
            </div>
          }
        />

        <Divider plain>یا</Divider>

        <div className="text-center">
          <Paragraph className="mb-4">هنوز ثبت‌نام نکرده‌اید؟</Paragraph>
          <Link href="/auth/register">
            <Button type="default" block>
              ساخت حساب جدید
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
