'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, notification } from 'antd';
import AvailabilityForm from '@/components/consultants/AvailabilityForm';
import PageHeader from '@/components/ui/PageHeader';
import { authData } from '@/mocks/auth';
import { consultants } from '@/mocks/consultants';

export default function AddAvailabilityPage() {
  const router = useRouter();

  // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
  // اما فعلاً از داده‌های نمونه استفاده می‌کنیم
  const { currentUser } = authData;

  // یافتن اطلاعات مشاور برای کاربر جاری
  const consultantData = consultants.find((c) => c.userId === currentUser?.id);

  const [loading, setLoading] = useState(false);

  // شبیه‌سازی افزودن زمان‌های جدید
  const handleAddAvailability = (data: any) => {
    setLoading(true);
    // شبیه‌سازی تأخیر API
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'زمان‌ها با موفقیت اضافه شدند',
        description: 'زمان‌های در دسترس شما با موفقیت ثبت شدند.',
      });
      // بازگشت به صفحه قبل
      router.push('/dashboard/consultant/availability');
    }, 1500);
  };

  // بازگشت به صفحه قبل
  const handleCancel = () => {
    router.push('/dashboard/consultant/availability');
  };

  // اگر کاربر مشاور نباشد، پیام مناسب نمایش داده می‌شود
  if (currentUser?.role !== 'consultant') {
    return (
      <div className="my-20 text-center">
        <h2 className="mb-2 text-2xl font-semibold">صفحه مختص مشاوران</h2>
        <p className="text-gray-500">
          این صفحه فقط برای کاربران با نقش مشاور قابل دسترسی است.
        </p>
      </div>
    );
  }

  return (
    <div className="add-availability-page">
      <PageHeader
        title="افزودن زمان‌های جدید"
        subtitle="زمان‌های جدیدی که برای ارائه مشاوره در دسترس هستید را تعیین کنید"
        backButton={{
          onClick: handleCancel,
          text: 'بازگشت به صفحه قبل',
        }}
      />

      <Card>
        <AvailabilityForm
          consultantId={consultantData?.id}
          onSuccess={handleAddAvailability}
          onCancel={handleCancel}
          loading={loading}
        />
      </Card>
    </div>
  );
}
