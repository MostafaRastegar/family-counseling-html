import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout } from 'antd';

const { Header } = Layout;

interface AppHeaderProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  currentUser?: {
    fullName: string;
    profileImage?: string;
  } | null;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleSidebar,
  showSidebarToggle = false,
  currentUser = null,
}) => {
  const router = useRouter();

  const userMenuItems = [
    {
      key: 'profile',
      label: 'پروفایل',
      icon: <UserOutlined />,
      onClick: () => router.push('/dashboard/profile'),
    },
    {
      key: 'logout',
      label: 'خروج',
      icon: <LogoutOutlined />,
      onClick: () => {
        // Logout logic will be implemented later
        router.push('/auth/login');
      },
    },
  ];

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
      </div>

      <div className="flex items-center">
        {currentUser ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomLeft">
            <div className="flex cursor-pointer items-center">
              <Avatar
                src={currentUser.profileImage}
                icon={!currentUser.profileImage && <UserOutlined />}
                className="mr-2"
              />
              <span className="hidden md:inline">{currentUser.fullName}</span>
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
