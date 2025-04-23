'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Row, Typography } from 'antd';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import SessionCard from '@/components/ui/card/SessionCard';
import StatCard from '@/components/ui/card/StatCard';
import { authData } from '@/mocks/auth';
import { availabilities } from '@/mocks/availabilities';
import { consultants } from '@/mocks/consultants';
import { reviews } from '@/mocks/reviews';
import { sessions } from '@/mocks/sessions';

const { Title, Text, Paragraph } = Typography;

export default function ConsultantDashboardPage() {
  // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
  // اما فعلاً از داده‌های نمونه استفاده می‌کنیم
  const { currentUser } = authData;

  // یافتن اطلاعات مشاور برای کاربر جاری
  const consultantData = consultants.find((c) => c.userId === currentUser?.id);

  // فیلتر کردن جلسات مربوط به این مشاور
  const consultantSessions = sessions.filter(
    (s) => s.consultantId === consultantData?.id,
  );

  // فیلتر کردن نظرات مربوط به این مشاور
  const consultantReviews = reviews.filter(
    (r) => r.consultantId === consultantData?.id,
  );

  // فیلتر کردن زمان‌های در دسترس این مشاور
  const consultantAvailabilities = availabilities.filter(
    (a) => a.consultantId === consultantData?.id,
  );

  // محاسبه تعداد جلسات بر اساس وضعیت
  const pendingSessions = consultantSessions.filter(
    (s) => s.status === 'pending',
  ).length;
  const confirmedSessions = consultantSessions.filter(
    (s) => s.status === 'confirmed',
  ).length;
  const completedSessions = consultantSessions.filter(
    (s) => s.status === 'completed',
  ).length;
  const cancelledSessions = consultantSessions.filter(
    (s) => s.status === 'cancelled',
  ).length;

  // محاسبه تعداد زمان‌های در دسترس و رزرو شده
  const availableSlots = consultantAvailabilities.filter(
    (a) => a.isAvailable,
  ).length;
  const bookedSlots = consultantAvailabilities.filter(
    (a) => !a.isAvailable,
  ).length;

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
    <div className="consultant-dashboard-page">
      <PageHeader
        title={`خوش آمدید، ${currentUser.fullName}`}
        subtitle="داشبورد مشاور - خلاصه فعالیت‌ها و آمار شما"
      />

      {!consultantData?.isVerified && (
        <Card className="border-yellow-300 bg-yellow-50 mb-6">
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div className="mb-4 sm:mb-0">
              <Title level={5} className="text-yellow-800 mb-1">
                تایید حساب کاربری
              </Title>
              <Paragraph className="text-yellow-700 mb-0">
                حساب کاربری شما در انتظار تایید است. پس از تایید توسط تیم
                پشتیبانی، امکان ارائه مشاوره خواهید داشت.
              </Paragraph>
            </div>
            <StatusBadge status="pending" size="large" showIcon />
          </div>
        </Card>
      )}

      {/* بخش آمار */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="جلسات امروز"
            value={confirmedSessions}
            icon={<CalendarOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="جلسات در انتظار تایید"
            value={pendingSessions}
            icon={<ClockCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="زمان‌های در دسترس"
            value={availableSlots}
            icon={<ClockCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="میانگین امتیاز"
            value={consultantData?.rating || 0}
            suffix={`(${consultantData?.reviewCount || 0} نظر)`}
            icon={<StarOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* بخش جلسات آینده */}
      <Card
        title="جلسات آینده"
        className="mb-6"
        extra={
          <Link href="/dashboard/sessions">
            <Button type="link">مشاهده همه</Button>
          </Link>
        }
      >
        {consultantSessions.length > 0 ? (
          <Row gutter={[16, 16]}>
            {consultantSessions
              .filter((session) =>
                ['pending', 'confirmed'].includes(session.status),
              )
              .slice(0, 3)
              .map((session) => (
                <Col xs={24} md={12} lg={8} key={session.id}>
                  <SessionCard session={session as any} userRole="consultant" />
                </Col>
              ))}
          </Row>
        ) : (
          <div className="py-8 text-center">
            <Text type="secondary">هیچ جلسه‌ای در آینده ندارید</Text>
          </div>
        )}
      </Card>

      {/* بخش پروفایل و دسترسی سریع */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={8}>
          <Card title="پروفایل حرفه‌ای" className="h-full">
            <div className="profile-completion mb-4">
              <div className="mb-1 flex justify-between">
                <Text>تکمیل پروفایل</Text>
                <Text strong>
                  {consultantData?.bio && consultantData?.education
                    ? '100%'
                    : '70%'}
                </Text>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{
                    width:
                      consultantData?.bio && consultantData?.education
                        ? '100%'
                        : '70%',
                  }}
                ></div>
              </div>
            </div>

            <Paragraph className="text-gray-500">
              تکمیل پروفایل حرفه‌ای به افزایش اعتماد مراجعان و بهبود رتبه شما در
              نتایج جستجو کمک می‌کند.
            </Paragraph>

            <Divider />

            <Link href="/dashboard/consultant/profile">
              <Button type="primary" block>
                تکمیل پروفایل حرفه‌ای
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="دسترسی سریع" className="h-full">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() =>
                    (window.location.href =
                      '/dashboard/consultant/availability')
                  }
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 mr-4 rounded-full p-3">
                      <CalendarOutlined className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <Text strong className="mb-1 block">
                        مدیریت زمان‌های در دسترس
                      </Text>
                      <Text type="secondary">
                        زمان‌های ارائه مشاوره خود را مدیریت کنید
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12}>
                <Card
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => (window.location.href = '/dashboard/sessions')}
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 mr-4 rounded-full p-3">
                      <TeamOutlined className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <Text strong className="mb-1 block">
                        مدیریت جلسات
                      </Text>
                      <Text type="secondary">
                        جلسات مشاوره خود را مدیریت کنید
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12}>
                <Card
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() =>
                    (window.location.href = '/dashboard/consultant/reviews')
                  }
                >
                  <div className="flex items-center">
                    <div className="bg-yellow-100 mr-4 rounded-full p-3">
                      <StarOutlined className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                      <Text strong className="mb-1 block">
                        نظرات و امتیازها
                      </Text>
                      <Text type="secondary">
                        نظرات مراجعان خود را مشاهده کنید
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12}>
                <Card
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => (window.location.href = '/dashboard/profile')}
                >
                  <div className="flex items-center">
                    <div className="bg-purple-100 mr-4 rounded-full p-3">
                      <UserOutlined className="text-purple-500 text-xl" />
                    </div>
                    <div>
                      <Text strong className="mb-1 block">
                        پروفایل شخصی
                      </Text>
                      <Text type="secondary">
                        اطلاعات شخصی خود را ویرایش کنید
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* بخش آمار و خلاصه عملکرد */}
      <Card title="خلاصه عملکرد">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={6}>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center">
              <Title level={2} className="text-blue-500 mb-0">
                {completedSessions}
              </Title>
              <Text type="secondary">جلسات تکمیل شده</Text>
            </div>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center">
              <Title level={2} className="text-green-500 mb-0">
                {consultantReviews.length}
              </Title>
              <Text type="secondary">نظرات دریافتی</Text>
            </div>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center">
              <Title level={2} className="text-yellow-500 mb-0">
                {availableSlots + bookedSlots}
              </Title>
              <Text type="secondary">کل زمان‌های تنظیم شده</Text>
            </div>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center">
              <Title level={2} className="text-red-500 mb-0">
                {cancelledSessions}
              </Title>
              <Text type="secondary">جلسات لغو شده</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
