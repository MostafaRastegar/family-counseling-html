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
  userRole,
  activePath,
  onLogout,
}) => {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Use provided activePath or current pathname for highlighting
  const currentPath = activePath || pathname;

  // Current user info
  const currentUser = authData.currentUser;

  // Handle submenu open/close
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys);
  };

  // Define menu items based on user role
  const getMenuItems = (): MenuItem[] => {
    // Common items for all users
    const commonItems: MenuItem[] = [
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
      {
        key: '/dashboard/messaging',
        icon: <MessageOutlined />,
        label: <Link href="/dashboard/messaging">پیام‌ها</Link>,
      },
    ];

    // Admin-specific items
    const adminItems: MenuItem[] = [
      {
        key: 'admin-management',
        icon: <AppstoreOutlined />,
        label: 'مدیریت سیستم',
        children: [
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
        ],
      },
      {
        key: '/dashboard/admin/reports',
        icon: <FileTextOutlined />,
        label: <Link href="/dashboard/admin/reports">گزارش‌ها</Link>,
      },
    ];

    // Consultant-specific items
    const consultantItems: MenuItem[] = [
      {
        key: '/dashboard/consultant',
        icon: <DashboardOutlined />,
        label: <Link href="/dashboard/consultant">داشبورد</Link>,
      },
      {
        key: '/dashboard/consultant/availability',
        icon: <ClockCircleOutlined />,
        label: (
          <Link href="/dashboard/consultant/availability">زمان‌های من</Link>
        ),
      },
      {
        key: '/dashboard/consultant/sessions',
        icon: <CalendarOutlined />,
        label: <Link href="/dashboard/consultant/sessions">جلسات من</Link>,
      },
      {
        key: '/dashboard/consultant/reviews',
        icon: <StarOutlined />,
        label: <Link href="/dashboard/consultant/reviews">نظرات من</Link>,
      },
    ];

    // Client-specific items
    const clientItems: MenuItem[] = [
      {
        key: '/dashboard/client',
        icon: <DashboardOutlined />,
        label: <Link href="/dashboard/client">داشبورد</Link>,
      },
      {
        key: '/consultants',
        icon: <TeamOutlined />,
        label: <Link href="/consultants">یافتن مشاور</Link>,
      },
      {
        key: '/dashboard/client/sessions',
        icon: <CalendarOutlined />,
        label: <Link href="/dashboard/client/sessions">جلسات من</Link>,
      },
      {
        key: '/dashboard/client/reviews',
        icon: <StarOutlined />,
        label: <Link href="/dashboard/client/reviews">نظرات من</Link>,
      },
    ];

    // Settings & help items
    const settingsItems: MenuItem[] = [
      {
        key: '/dashboard/settings',
        icon: <SettingOutlined />,
        label: <Link href="/dashboard/settings">تنظیمات</Link>,
      },
      {
        key: '/dashboard/help',
        icon: <QuestionCircleOutlined />,
        label: <Link href="/dashboard/help">راهنما و پشتیبانی</Link>,
      },
    ];

    // Add role-specific items based on user role
    let roleSpecificItems: MenuItem[] = [];
    console.log('userRole :>> ', userRole);
    if (userRole === 'admin') {
      roleSpecificItems = adminItems;
    } else if (userRole === 'consultant') {
      roleSpecificItems = consultantItems;
    } else {
      roleSpecificItems = clientItems;
    }

    // Logout item
    const logoutItem: MenuItem = {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'خروج از حساب',
      onClick: onLogout || (() => (window.location.href = '/auth/login')),
    };

    return [
      ...roleSpecificItems,
      ...commonItems,
      {
        type: 'divider',
      },
      ...settingsItems,
      logoutItem,
    ];
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
