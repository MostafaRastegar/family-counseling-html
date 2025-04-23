import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import AppHeader from '../ui/Header';
import Sidebar from '../ui/Sidebar';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'consultant' | 'client';
  currentUser?: {
    fullName: string;
    profileImage?: string;
  } | null;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole = 'client',
  currentUser = null,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="bg-gray-50 rtl min-h-screen" dir="rtl">
      <AppHeader
        showSidebarToggle={true}
        onToggleSidebar={toggleSidebar}
        currentUser={currentUser}
      />
      <Layout>
        <Sidebar collapsed={collapsed} userRole={userRole} />
        <Layout className="bg-gray-50 p-0">
          <div className="flex items-center border-b bg-white p-6 shadow-sm lg:hidden">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              className="mr-4"
            />
          </div>
          <Content className="min-h-[calc(100vh-64px)] p-6">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
