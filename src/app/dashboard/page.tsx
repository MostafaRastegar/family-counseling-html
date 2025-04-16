'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Badge, Card, Col, List, Row, Statistic, Tag, Typography } from 'antd';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import DashboardStats from '@/components/dashboard/DashboardStats';

const { Title } = Typography;

// داده‌های نمونه
const activities = [
  {
    id: 1,
    type: 'session',
    title: 'جلسه مشاوره با دکتر علی محمدی',
    time: '1401/01/15 - 14:30',
    status: 'confirmed',
  },
  {
    id: 2,
    type: 'review',
    title: 'یک نظر جدید دریافت کردید',
    time: '1401/01/10 - 18:45',
    status: 'new',
  },
  {
    id: 3,
    type: 'session',
    title: 'جلسه مشاوره با خانم زهرا کریمی',
    time: '1401/01/05 - 10:00',
    status: 'completed',
  },
];

export default function Dashboard() {
  const [userRole, setUserRole] = useState('client'); // استاتیک، بعداً به نقش واقعی کاربر متصل می‌شود
  const router = useRouter();

  useEffect(() => {
    // در محیط واقعی، بررسی وضعیت لاگین و دریافت نقش کاربر
    // اگر کاربر لاگین نباشد، به صفحه ورود هدایت می‌شود

    // شبیه‌سازی تأخیر در دریافت نقش کاربر
    const timer = setTimeout(() => {
      // بررسی نقش کاربر و هدایت به داشبورد مناسب
      if (userRole === 'client') {
        router.push('/dashboard/client');
      } else if (userRole === 'consultant') {
        router.push('/dashboard/consultant');
      } else if (userRole === 'admin') {
        router.push('/dashboard/admin');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [userRole, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2}>داشبورد</Title>
      <p className="mb-8 text-gray-500">به پنل کاربری خود خوش آمدید.</p>

      <div className="py-16 text-center">
        <div className="border-blue-500 inline-block size-16 animate-spin rounded-full border-b-2"></div>
        <p className="mt-4 text-lg">
          در حال انتقال به داشبورد{' '}
          {userRole === 'client'
            ? 'مراجع'
            : userRole === 'consultant'
              ? 'مشاور'
              : 'مدیر'}
          ...
        </p>
      </div>
    </div>
  );
}
