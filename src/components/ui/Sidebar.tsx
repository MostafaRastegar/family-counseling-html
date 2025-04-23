import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  MessageOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  userRole?: 'admin' | 'consultant' | 'client';
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  userRole = 'client',
}) => {
  const pathname = usePathname();

  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: <Link href="/dashboard">داشبورد</Link>,
      },
      {
        key: '/dashboard/profile',
        icon: <UserOutlined />,
        label: <Link href="/dashboard/profile">پروفایل من</Link>,
      },
      {
        key: '/dashboard/sessions',
        icon: <CalendarOutlined />,
        label: <Link href="/dashboard/sessions">جلسات من</Link>,
      },
    ];

    const roleBasedItems = {
      admin: [
        {
          key: '/dashboard/admin/stats',
          icon: <DashboardOutlined />,
          label: <Link href="/dashboard/admin/stats">آمار کلی</Link>,
        },
        {
          key: '/dashboard/admin/users',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/admin/users">مدیریت کاربران</Link>,
        },
        {
          key: '/dashboard/admin/consultants',
          icon: <UserOutlined />,
          label: (
            <Link href="/dashboard/admin/consultants">مدیریت مشاوران</Link>
          ),
        },
        {
          key: '/dashboard/admin/sessions',
          icon: <CalendarOutlined />,
          label: <Link href="/dashboard/admin/sessions">مدیریت جلسات</Link>,
        },
        {
          key: '/dashboard/admin/reviews',
          icon: <StarOutlined />,
          label: <Link href="/dashboard/admin/reviews">مدیریت نظرات</Link>,
        },
        {
          key: '/dashboard/admin/settings',
          icon: <SettingOutlined />,
          label: <Link href="/dashboard/admin/settings">تنظیمات سیستم</Link>,
        },
      ],
      consultant: [
        {
          key: '/dashboard/consultant/availability',
          icon: <ClockCircleOutlined />,
          label: (
            <Link href="/dashboard/consultant/availability">زمان‌های من</Link>
          ),
        },
        {
          key: '/dashboard/consultant/reviews',
          icon: <StarOutlined />,
          label: <Link href="/dashboard/consultant/reviews">نظرات من</Link>,
        },
        {
          key: '/dashboard/messaging',
          icon: <MessageOutlined />,
          label: <Link href="/dashboard/messaging">پیام‌رسانی</Link>,
        },
      ],
      client: [
        {
          key: '/dashboard/client/consultants',
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/client/consultants">یافتن مشاور</Link>,
        },
        {
          key: '/dashboard/client/reviews',
          icon: <StarOutlined />,
          label: <Link href="/dashboard/client/reviews">نظرات من</Link>,
        },
      ],
    };

    return userRole === 'admin'
      ? roleBasedItems.admin
      : [...commonItems, ...roleBasedItems[userRole]];
  };

  return (
    <Sider
      width={250}
      collapsible
      collapsed={collapsed}
      className="min-h-screen bg-white shadow-sm"
      trigger={null}
    >
      <div className="flex h-16 items-center justify-center">
        {!collapsed ? (
          <span className="text-primary-500 text-lg font-bold">
            سامانه مشاوره
          </span>
        ) : (
          <span className="text-primary-500 text-xl font-bold">م.خ</span>
        )}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[pathname]}
        items={getMenuItems()}
        className="border-0"
      />
    </Sider>
  );
};

export default Sidebar;
