'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import AuthLayout from '@/components/layouts/AuthLayout';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <AuthLayout
      title="تنظیم رمز عبور جدید"
      subtitle="لطفاً رمز عبور جدید خود را وارد کنید"
    >
      <ResetPasswordForm token={token || undefined} />
    </AuthLayout>
  );
}
