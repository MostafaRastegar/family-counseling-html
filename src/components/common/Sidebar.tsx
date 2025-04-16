'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarOutlined,
  CommentOutlined,
  DollarCircleFilled,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('consultant'); // استاتیک، بعداً به نقش واقعی کاربر متصل می‌شود
  const pathname = usePathname();

  // تنظیم منو بر اساس نقش کاربر
  const getMenuItems = () => {
    const commonItems = [
      {
        key: 'dashboard',
        icon: <HomeOutlined />,
        label: <Link href="/dashboard">داشبورد</Link>,
      },
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link href="/dashboard/profile">پروفایل</Link>,
      },
    ];

    if (userRole === 'admin') {
      return [
        ...commonItems,
        {
          key: 'users',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/admin/users">کاربران</Link>,
        },
        {
          key: 'consultants',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/admin/consultants">مشاوران</Link>,
        },
        {
          key: 'verify',
          icon: <SettingOutlined />,
          label: <Link href="/dashboard/admin/verify">تأیید مشاوران</Link>,
        },
        {
          key: 'sessions',
          icon: <CalendarOutlined />,
          label: <Link href="/dashboard/admin/sessions">جلسات</Link>,
        },
      ];
    } else if (userRole === 'consultant') {
      return [
        ...commonItems,
        {
          key: 'availabilities',
          icon: <CalendarOutlined />,
          label: (
            <Link href="/dashboard/consultant/availabilities">
              زمان‌های دردسترس
            </Link>
          ),
        },
        {
          key: 'sessions',
          icon: <CalendarOutlined />,
          label: <Link href="/dashboard/consultant/sessions">جلسات</Link>,
        },
        {
          key: 'reviews',
          icon: <CommentOutlined />,
          label: <Link href="/dashboard/consultant/reviews">نظرات</Link>,
        },
        {
          key: 'earnings',
          icon: <DollarCircleFilled />,
          label: <Link href="/dashboard/client/earnings">مالی</Link>,
        },
      ];
    } else {
      return [
        ...commonItems,
        {
          key: 'consultants',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/client/consultants">مشاوران</Link>,
        },
        {
          key: 'sessions',
          icon: <CalendarOutlined />,
          label: <Link href="/dashboard/client/sessions">جلسات من</Link>,
        },
      ];
    }
  };

  // یافتن کلید منوی فعال بر اساس URL
  const findActiveMenuKey = () => {
    const pathParts = pathname.split('/');
    if (pathParts.length >= 3) {
      return pathParts[3]; // dashboard/client/sessions -> sessions
    }
    return 'dashboard';
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="min-h-screen"
      theme="light"
    >
      <div className="flex h-16 items-center justify-center p-4">
        {!collapsed && <span className="text-lg font-bold">پنل کاربری</span>}
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[findActiveMenuKey()]}
        items={getMenuItems()}
      />
    </Sider>
  );
};

export default Sidebar;
