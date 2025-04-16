'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Typography,
  message,
} from 'antd';
import LoginForm from '@/components/auth/LoginForm';

const { Title, Paragraph } = Typography;

export default function Login() {
  return (
    <div className="bg-gray-50 flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Title level={2}>ورود به حساب کاربری</Title>
          <Paragraph className="text-gray-500">
            به سامانه مشاوره خانواده خوش آمدید
          </Paragraph>
        </div>

        <LoginForm />

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
