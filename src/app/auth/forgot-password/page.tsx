'use client';

import React from 'react';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import AuthLayout from '@/components/layouts/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="بازیابی رمز عبور"
      subtitle="لطفاً آدرس ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
