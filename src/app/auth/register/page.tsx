'use client';

import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/layouts/AuthLayout';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="ثبت‌نام در سامانه"
      subtitle="برای دسترسی به خدمات سامانه مشاوره خانواده، ثبت‌نام کنید"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
