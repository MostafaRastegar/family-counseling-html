'use client';

import React, { useState } from 'react';
import { Tabs, Typography, notification } from 'antd';
import type { TabsProps } from 'antd';
import AvatarUpload from '@/components/profile/AvatarUpload';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PageHeader from '@/components/ui/PageHeader';
import { authData } from '@/mocks/auth';
import { consultants } from '@/mocks/consultants';

const { Title } = Typography;

export default function ProfilePage() {
  // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
  // اما فعلاً از داده‌های نمونه استفاده می‌کنیم
  const { currentUser } = authData;

  // اگر کاربر مشاور باشد، اطلاعات مشاور را دریافت می‌کنیم
  const consultant =
    currentUser?.role === 'consultant'
      ? consultants.find((c) => c.userId === currentUser.id)
      : undefined;

  const [activeKey, setActiveKey] = useState('info');
  const [loading, setLoading] = useState(false);

  // شبیه‌سازی ذخیره اطلاعات پروفایل
  const handleSaveProfile = (values: any) => {
    setLoading(true);
    // شبیه‌سازی تأخیر API
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'اطلاعات پروفایل به‌روزرسانی شد',
        description: 'اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد.',
      });
    }, 1500);
  };

  // شبیه‌سازی تغییر تصویر پروفایل
  const handleAvatarChange = (imageUrl: string) => {
    // در یک برنامه واقعی، این مقدار به API ارسال می‌شود
    console.log('تصویر پروفایل تغییر کرد:', imageUrl);
  };

  // تب‌های پروفایل
  const items: TabsProps['items'] = [
    {
      key: 'info',
      label: 'اطلاعات پروفایل',
      children: (
        <ProfileForm
          initialValues={{
            fullName: currentUser?.fullName,
            email: currentUser?.email,
            phoneNumber: currentUser?.phoneNumber,
            bio: consultant?.bio,
            education: consultant?.education,
            consultantLicense: consultant?.consultantLicense,
          }}
          userRole={currentUser?.role as any}
          onSuccess={handleSaveProfile}
          loading={loading}
        />
      ),
    },
    {
      key: 'avatar',
      label: 'تصویر پروفایل',
      children: (
        <AvatarUpload
          currentImage={currentUser?.profileImage}
          userId={currentUser?.id}
          onSuccess={handleAvatarChange}
        />
      ),
    },
    {
      key: 'password',
      label: 'تغییر رمز عبور',
      children: <PasswordChangeForm />,
    },
  ];

  // اگر کاربری وجود نداشته باشد، پیام مناسب نمایش داده می‌شود
  if (!currentUser) {
    return (
      <div className="my-20 text-center">
        <Title level={3}>اطلاعات کاربر در دسترس نیست</Title>
        <p>لطفاً مجدداً وارد شوید یا با پشتیبانی تماس بگیرید.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <PageHeader
        title="پروفایل من"
        subtitle="اطلاعات پروفایل خود را مشاهده و ویرایش کنید"
      />

      <div className="mb-6">
        <ProfileHeader
          user={{
            id: currentUser.id,
            fullName: currentUser.fullName,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            profileImage: currentUser.profileImage,
            role: currentUser.role as any,
            createdAt: '2024-01-01T10:00:00Z', // تاریخ نمونه
          }}
          consultant={{
            isVerified: consultant?.isVerified,
            rating: consultant?.rating,
            reviewCount: consultant?.reviewCount,
            verificationStatus: consultant?.isVerified ? 'verified' : 'pending',
          }}
          onEdit={() => setActiveKey('info')}
          onChangePassword={() => setActiveKey('password')}
          onUploadImage={() => setActiveKey('avatar')}
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
