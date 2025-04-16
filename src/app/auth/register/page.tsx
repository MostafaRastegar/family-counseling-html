'use client';

import Link from 'next/link';
import { Button, Card, Divider, Typography } from 'antd';
import RegisterForm from '@/components/auth/RegisterForm';

const { Title, Paragraph } = Typography;

export default function Register() {
  return (
    <div className="bg-gray-50 flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Title level={2}>ثبت نام</Title>
          <Paragraph className="text-gray-500">
            ایجاد حساب کاربری جدید در سامانه مشاوره خانواده
          </Paragraph>
        </div>

        <RegisterForm />

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
