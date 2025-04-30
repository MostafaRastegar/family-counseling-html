import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BellOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Layout,
  List,
  Popover,
  Space,
  Tabs,
  Typography,
} from 'antd';
import type { MenuProps, TabsProps } from 'antd';
import { blackListToken } from '@/modules/papak_auth/refreshToken';

const { Header } = Layout;
const { Text } = Typography;
const { Search } = Input;

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface AppHeaderProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  currentUser?: {
    id?: string;
    fullName: string;
    profileImage?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleSidebar,
  showSidebarToggle = false,
  currentUser = null,
  onLogout,
}) => {
  const router = useRouter();

  // Sample notifications for demonstration
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'رزرو جدید',
      message: 'جلسه جدیدی برای فردا ساعت ۱۵:۰۰ رزرو شده است.',
      time: '۳۰ دقیقه پیش',
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'نظر جدید',
      message: 'یک نظر جدید برای شما ثبت شده است.',
      time: '۱ ساعت پیش',
      read: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'پرداخت موفق',
      message: 'پرداخت شما با موفقیت انجام شد.',
      time: '۳ ساعت پیش',
      read: true,
      type: 'success',
    },
  ]);

  // Handle logout
  const handleLogout = () => {};

  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'پروفایل',
      icon: <UserOutlined />,
      onClick: () => router.push('/dashboard/profile'),
    },
    {
      key: 'settings',
      label: 'تنظیمات حساب',
      icon: <SettingOutlined />,
      onClick: () => router.push('/dashboard/settings'),
    },
    {
      key: 'wallet',
      label: 'کیف پول',
      icon: <WalletOutlined />,
      onClick: () => router.push('/dashboard/wallet'),
    },
    {
      key: 'divider',
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'خروج',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Notification tabs
  const notificationTabs: TabsProps['items'] = [
    {
      key: 'all',
      label: 'همه',
      children: (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer ${!item.read ? 'bg-blue-50' : ''}`}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<InfoCircleOutlined />}
                    className={
                      item.type === 'info'
                        ? 'bg-blue-100 text-blue-500'
                        : item.type === 'success'
                          ? 'bg-green-100 text-green-500'
                          : item.type === 'warning'
                            ? 'bg-yellow-100 text-yellow-500'
                            : 'bg-red-100 text-red-500'
                    }
                  />
                }
                title={<span>{item.title}</span>}
                description={
                  <div>
                    <div>{item.message}</div>
                    <Text type="secondary" className="text-xs">
                      {item.time}
                    </Text>
                  </div>
                }
              />
              {!item.read && <Badge status="processing" color="blue" />}
            </List.Item>
          )}
          footer={
            <div className="text-primary-500 cursor-pointer text-center hover:underline">
              مشاهده همه اعلان‌ها
            </div>
          }
        />
      ),
    },
    {
      key: 'unread',
      label: 'خوانده نشده',
      children: (
        <List
          dataSource={notifications.filter((n) => !n.read)}
          renderItem={(item) => (
            <List.Item className="bg-blue-50 cursor-pointer">
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<InfoCircleOutlined />}
                    className={
                      item.type === 'info'
                        ? 'bg-blue-100 text-blue-500'
                        : item.type === 'success'
                          ? 'bg-green-100 text-green-500'
                          : item.type === 'warning'
                            ? 'bg-yellow-100 text-yellow-500'
                            : 'bg-red-100 text-red-500'
                    }
                  />
                }
                title={<span>{item.title}</span>}
                description={
                  <div>
                    <div>{item.message}</div>
                    <Text type="secondary" className="text-xs">
                      {item.time}
                    </Text>
                  </div>
                }
              />
              <Badge status="processing" color="blue" />
            </List.Item>
          )}
          locale={{ emptyText: 'اعلان خوانده نشده‌ای وجود ندارد' }}
        />
      ),
    },
  ];

  // Notification popover content
  const notificationContent = (
    <div className="w-80 p-4">
      <Tabs defaultActiveKey="all" items={notificationTabs} />
    </div>
  );

  return (
    <Header className="flex h-16 items-center justify-between bg-white px-4 shadow-sm">
      <div className="flex items-center">
        {showSidebarToggle && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onToggleSidebar}
            className="mr-2 lg:hidden"
          />
        )}
        <Link href="/" className="flex items-center">
          <span className="text-primary-500 text-xl font-bold">
            سامانه مشاوره خانواده
          </span>
        </Link>

        {/* Global search - only show on large screens */}
        {/* <div className="hidden md:ml-4 md:block">
          <Search
            placeholder="جستجو..."
            allowClear
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
          />
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        {/* Navigation links for larger screens */}
        <div className="hidden md:mr-4 md:flex">
          <Button
            type="default"
            icon={<TeamOutlined />}
            onClick={() => router.push('/consultants')}
          >
            یافتن مشاور
          </Button>
        </div>

        {/* Notifications */}
        {currentUser && (
          <Popover
            content={notificationContent}
            trigger="click"
            placement="bottomRight"
            title={
              <div className="flex items-center justify-between">
                <span>اعلان‌ها</span>
                <Button type="link" size="small">
                  علامت‌گذاری همه به عنوان خوانده شده
                </Button>
              </div>
            }
          >
            <Badge
              size="small"
              className="mr-2 cursor-pointer"
              dot={!!notifications.filter((n) => !n.read).length}
            >
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
          </Popover>
        )}

        {/* User avatar and dropdown */}
        {currentUser ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomLeft">
            <div className="flex cursor-pointer items-center">
              <Space>
                <Avatar
                  src={currentUser.profileImage}
                  icon={!currentUser.profileImage && <UserOutlined />}
                  size="default"
                />
                <div className="hidden md:block">
                  <div className="text-sm font-medium">
                    {currentUser.fullName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentUser.role === 'admin'
                      ? 'مدیر سیستم'
                      : currentUser.role === 'consultant'
                        ? 'مشاور'
                        : 'مراجع'}
                  </div>
                </div>
              </Space>
            </div>
          </Dropdown>
        ) : (
          <div className="space-x-2 space-x-reverse">
            <Button type="link" onClick={() => router.push('/auth/login')}>
              ورود
            </Button>
            <Button
              type="primary"
              onClick={() => router.push('/auth/register')}
            >
              ثبت نام
            </Button>
          </div>
        )}
      </div>
    </Header>
  );
};
export default AppHeader;
