'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Divider, Form, Typography, message } from 'antd';
import FormBuilder from '@/components/common/FormBuilder';

const { Title, Paragraph } = Typography;

export default function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const registerFields = [
    {
      name: 'fullName',
      label: 'نام و نام خانوادگی',
      type: 'text',
      required: true,
      prefix: <UserOutlined />,
      placeholder: 'نام و نام خانوادگی',
    },
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
      name: 'phoneNumber',
      label: 'شماره تماس',
      type: 'text',
      required: true,
      prefix: <PhoneOutlined />,
      placeholder: 'شماره تماس',
    },
    {
      name: 'password',
      label: 'رمز عبور',
      type: 'password',
      required: true,
      prefix: <LockOutlined />,
      placeholder: 'رمز عبور',
      rules: [{ min: 6, message: 'رمز عبور باید حداقل 6 کاراکتر باشد!' }],
    },
    {
      name: 'confirmPassword',
      label: 'تأیید رمز عبور',
      type: 'password',
      required: true,
      prefix: <LockOutlined />,
      placeholder: 'تأیید رمز عبور',
      dependencies: ['password'],
      rules: [
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error('رمز عبور و تأیید آن مطابقت ندارند!'),
            );
          },
        }),
      ],
    },
    {
      name: 'role',
      label: 'نوع کاربری',
      type: 'radio',
      required: true,
      initialValue: 'client',
      options: [
        { label: 'مراجع', value: 'client' },
        { label: 'مشاور', value: 'consultant' },
      ],
      buttonStyle: 'solid',
      optionType: 'button',
    },
  ];

  const onFinish = (values) => {
    setLoading(true);

    // شبیه‌سازی ارسال درخواست به سرور
    setTimeout(() => {
      setLoading(false);
      console.log('Register values:', values);
      message.success('ثبت نام با موفقیت انجام شد!');

      // در حالت استاتیک، هدایت به صفحه ورود
      router.push('/auth/login');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Title level={2}>ثبت نام</Title>
          <Paragraph className="text-gray-500">
            ایجاد حساب کاربری جدید در سامانه مشاوره خانواده
          </Paragraph>
        </div>

        <FormBuilder
          form={form}
          fields={registerFields}
          onFinish={onFinish}
          layout="vertical"
          submitButton={{
            text: 'ثبت نام',
            loading: loading,
            block: true,
            size: 'large',
          }}
        />

        <Divider plain>یا</Divider>

        <div className="text-center">
          <Paragraph className="mb-4">قبلاً ثبت‌نام کرده‌اید؟</Paragraph>
          <Link href="/auth/login">
            <Button type="default" block>
              ورود به حساب
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
