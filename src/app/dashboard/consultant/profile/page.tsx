'use client';

import React, { useState } from 'react';
import { Card, Tabs, notification } from 'antd';
import type { TabsProps } from 'antd';
import ConsultantProfileForm from '@/components/consultants/ConsultantProfileForm';
import SpecialtiesSelect from '@/components/consultants/SpecialtiesSelect';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PageHeader from '@/components/ui/PageHeader';
import { authData } from '@/mocks/auth';
import { consultants } from '@/mocks/consultants';

export default function ConsultantProfilePage() {
  // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
  // اما فعلاً از داده‌های نمونه استفاده می‌کنیم
  const { currentUser } = authData;

  // یافتن اطلاعات مشاور برای کاربر جاری
  const consultantData = consultants.find((c) => c.userId === currentUser?.id);

  const [activeKey, setActiveKey] = useState('general');
  const [loading, setLoading] = useState(false);

  // شبیه‌سازی ذخیره اطلاعات پروفایل
  const handleSaveProfile = (values: any) => {
    setLoading(true);
    // شبیه‌سازی تأخیر API
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'اطلاعات با موفقیت ذخیره شد',
        description: 'پروفایل حرفه‌ای شما با موفقیت به‌روزرسانی شد.',
      });
    }, 1500);
  };

  // شبیه‌سازی ذخیره تخصص‌ها
  const handleSaveSpecialties = (specialties: string[]) => {
    setLoading(true);
    // شبیه‌سازی تأخیر API
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'تخصص‌ها با موفقیت ذخیره شد',
        description: `${specialties.length} تخصص برای پروفایل شما ثبت شد.`,
      });
    }, 1000);
  };

  // تب‌های پروفایل حرفه‌ای
  const items: TabsProps['items'] = [
    {
      key: 'general',
      label: 'اطلاعات کلی',
      children: (
        <ConsultantProfileForm
          initialValues={{
            bio: consultantData?.bio || '',
            specialties: consultantData?.specialties || [],
            education: consultantData?.education || '',
            experience: '',
            consultantLicense: consultantData?.consultantLicense || '',
            hourlyRate: 200000,
            sessionDuration: 60,
          }}
          onSuccess={handleSaveProfile}
          loading={loading}
        />
      ),
    },
    {
      key: 'specialties',
      label: 'تخصص‌ها',
      children: (
        <Card>
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-medium">مدیریت تخصص‌ها</h3>
            <p className="text-gray-500">
              تخصص‌های خود را انتخاب کنید تا مراجعان بتوانند شما را بر اساس این
              تخصص‌ها پیدا کنند.
            </p>
          </div>

          <SpecialtiesSelect
            value={consultantData?.specialties || []}
            onChange={handleSaveSpecialties}
            maxCount={15}
            maxTagCount={10}
            allowAdd={true}
            placeholder="تخصص‌های خود را انتخاب کنید"
            loading={loading}
          />
        </Card>
      ),
    },
  ];

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
    <div className="consultant-profile-page">
      <PageHeader
        title="پروفایل حرفه‌ای"
        subtitle="اطلاعات حرفه‌ای خود را تکمیل کنید تا شانس دیده شدن توسط مراجعان افزایش یابد"
      />

      <div className="mb-6">
        <ProfileHeader
          user={{
            id: currentUser.id,
            fullName: currentUser.fullName,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            profileImage: currentUser.profileImage,
            role: 'consultant',
            createdAt: '2024-01-01T10:00:00Z', // تاریخ نمونه
          }}
          consultant={
            consultantData
              ? {
                  isVerified: consultantData.isVerified,
                  rating: consultantData.rating,
                  reviewCount: consultantData.reviewCount,
                  verificationStatus: consultantData.isVerified
                    ? 'verified'
                    : 'pending',
                }
              : undefined
          }
        />
      </div>

      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={setActiveKey}
        type="card"
        className="profile-tabs"
        destroyInactiveTabPane
      />
    </div>
  );
}
