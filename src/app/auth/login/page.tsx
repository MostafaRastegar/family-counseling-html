'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/layouts/AuthLayout';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  return (
    <AuthLayout
      title="ورود به حساب کاربری"
      subtitle="برای استفاده از خدمات سامانه مشاوره خانواده وارد حساب کاربری خود شوید"
    >
      <LoginForm redirectUrl={next || '/dashboard'} />
    </AuthLayout>
  );
}
