import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppstoreOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Avatar, Divider, Layout, Menu, Tooltip, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { authData } from '@/mocks/auth';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  userRole?: 'admin' | 'consultant' | 'client';
  activePath?: string;
  onLogout?: () => void;
}

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  userRole = 'client',
  activePath,
  onLogout,
}) => {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>(['/dashboard']);

  // Use provided activePath or current pathname for highlighting
  const currentPath = activePath || pathname;

  // Current user info
  const currentUser = authData.currentUser;

  // Handle submenu open/close
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  // Define menu items based on user role
  const getMenuItems = (): MenuItem[] => {
    const commonItems: MenuItem[] = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: <Link href="/dashboard">داشبورد</Link>,
      },
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'پروفایل',
        children: [
          {
            key: '/dashboard/profile',
            label: <Link href="/dashboard/profile">مشاهده پروفایل</Link>,
          },
          {
            key: '/dashboard/settings',
            label: <Link href="/dashboard/settings">تنظیمات حساب</Link>,
          },
        ],
      },
      {
        key: '/dashboard/sessions',
        icon: <CalendarOutlined />,
        label: <Link href="/dashboard/sessions">جلسات من</Link>,
      },
      {
        key: '/dashboard/wallet',
        icon: <WalletOutlined />,
        label: <Link href="/dashboard/wallet">کیف پول</Link>,
      },
      {
        key: '/dashboard/notifications',
        icon: <BellOutlined />,
        label: <Link href="/dashboard/notifications">اعلان‌ها</Link>,
      },
    ];

    const roleBasedItems: Record<string, MenuItem[]> = {
      admin: [
        {
          key: 'management',
          icon: <AppstoreOutlined />,
          label: 'مدیریت سیستم',
          children: [
            {
              key: '/dashboard/admin/stats',
              label: <Link href="/dashboard/admin/stats">آمار کلی</Link>,
            },
            {
              key: '/dashboard/admin/users',
              label: <Link href="/dashboard/admin/users">مدیریت کاربران</Link>,
            },
            {
              key: '/dashboard/admin/consultants',
              label: (
                <Link href="/dashboard/admin/consultants">مدیریت مشاوران</Link>
              ),
            },
            {
              key: '/dashboard/admin/sessions',
              label: <Link href="/dashboard/admin/sessions">مدیریت جلسات</Link>,
            },
            {
              key: '/dashboard/admin/reviews',
              label: <Link href="/dashboard/admin/reviews">مدیریت نظرات</Link>,
            },
          ],
        },
        {
          key: '/dashboard/admin/reports',
          icon: <FileTextOutlined />,
          label: <Link href="/dashboard/admin/reports">گزارش‌ها</Link>,
        },
        {
          key: '/dashboard/admin/settings',
          icon: <SettingOutlined />,
          label: <Link href="/dashboard/admin/settings">تنظیمات سیستم</Link>,
        },
      ],
      consultant: [
        {
          key: '/dashboard/consultant/profile',
          icon: <UserOutlined />,
          label: (
            <Link href="/dashboard/consultant/profile">پروفایل حرفه‌ای</Link>
          ),
        },
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
          key: '/consultants',
          icon: <TeamOutlined />,
          label: <Link href="/consultants">یافتن مشاور</Link>,
        },
        {
          key: '/dashboard/client/reviews',
          icon: <StarOutlined />,
          label: <Link href="/dashboard/client/reviews">نظرات من</Link>,
        },
        {
          key: '/dashboard/messaging',
          icon: <MessageOutlined />,
          label: <Link href="/dashboard/messaging">پیام‌ها</Link>,
        },
      ],
    };

    // Support & help items for all users
    const supportItems: MenuItem[] = [
      {
        key: 'support-divider',
        type: 'divider',
      },
      {
        key: '/dashboard/help',
        icon: <QuestionCircleOutlined />,
        label: <Link href="/dashboard/help">راهنما و پشتیبانی</Link>,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'خروج از حساب',
        onClick: onLogout || (() => (window.location.href = '/auth/login')),
      },
    ];

    return [...commonItems, ...roleBasedItems[userRole], ...supportItems];
  };

  // User profile section for sidebar
  const userProfileSection = !collapsed && (
    <div className="m-4">
      <div className="flex items-center space-x-2 space-x-reverse">
        <Avatar
          src={currentUser?.profileImage}
          icon={!currentUser?.profileImage && <UserOutlined />}
          size={40}
        />
        <div className="flex flex-col overflow-hidden">
          <Text strong className="truncate">
            {currentUser?.fullName || 'کاربر سامانه'}
          </Text>
          <Text type="secondary" className="text-xs">
            {userRole === 'admin'
              ? 'مدیر سیستم'
              : userRole === 'consultant'
                ? 'مشاور'
                : 'مراجع'}
          </Text>
        </div>
      </div>
      <Divider className="my-3" />
    </div>
  );

  return (
    <Sider
      width={260}
      collapsible
      collapsed={collapsed}
      className="min-h-screen bg-white shadow-sm"
      trigger={null}
    >
      <div className="flex h-16 items-center justify-center">
        {!collapsed ? (
          <Link href="/" className="text-primary-500 text-lg font-bold">
            سامانه مشاوره خانواده
          </Link>
        ) : (
          <Tooltip placement="left" title="سامانه مشاوره خانواده">
            <Link href="/" className="text-primary-500 text-xl font-bold">
              م.خ
            </Link>
          </Tooltip>
        )}
      </div>

      {userProfileSection}

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[currentPath]}
        openKeys={!collapsed ? openKeys : []}
        onOpenChange={onOpenChange}
        items={getMenuItems()}
        className="border-0"
      />
    </Sider>
  );
};

export default Sidebar;
