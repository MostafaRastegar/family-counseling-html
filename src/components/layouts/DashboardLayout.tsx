import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Badge, Breadcrumb, Button, Layout, Spin, Tooltip } from 'antd';
import { authData } from '@/mocks/auth';
import AppFooter from '../ui/Footer';
import AppHeader from '../ui/Header';
import Sidebar from '../ui/Sidebar';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'consultant' | 'client';
  currentUser?: {
    fullName: string;
    profileImage?: string;
    role?: string;
  } | null;
  pageTitle?: string;
  loading?: boolean;
  breadcrumbs?: Array<{ title: string; href?: string }>;
  showFooter?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole = 'client',
  currentUser = null,
  pageTitle,
  loading = false,
  breadcrumbs,
  showFooter = false,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // If no currentUser is provided, use mock data
  const user = currentUser || authData.currentUser;

  // Check if the screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Generate breadcrumbs based on pathname if not provided
  const generateBreadcrumbs = () => {
    if (breadcrumbs) return breadcrumbs;

    const paths = pathname.split('/').filter(Boolean);
    let currentPath = '';

    // Create breadcrumb items from path segments
    return [
      { title: 'داشبورد', href: '/dashboard' },
      ...paths.slice(1).map((path) => {
        currentPath += `/${path}`;
        return {
          title:
            path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
          href: currentPath,
        };
      }),
    ];
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Get the path for highlighting active menu item
  const getActivePath = () => {
    const segments = pathname.split('/');
    if (segments.length > 2) {
      return `/${segments[1]}/${segments[2]}`;
    }
    return pathname;
  };

  return (
    <Layout className="bg-gray-50 rtl min-h-screen" dir="rtl">
      <AppHeader
        showSidebarToggle={true}
        onToggleSidebar={toggleSidebar}
        currentUser={user}
      />
      <Layout>
        <Sidebar
          collapsed={collapsed}
          userRole={userRole || (user?.role as any)}
          activePath={getActivePath()}
        />
        <Layout className="bg-gray-50 p-0">
          {isMobile && (
            <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleSidebar}
              />
              <div className="flex items-center">
                <Tooltip title="راهنما">
                  <Button type="text" icon={<QuestionCircleOutlined />} />
                </Tooltip>
                <Tooltip title="اعلان‌ها">
                  <Badge count={3} size="small">
                    <Button type="text" icon={<BellOutlined />} />
                  </Badge>
                </Tooltip>
              </div>
            </div>
          )}

          <Content className="min-h-[calc(100vh-64px)]">
            {/* Breadcrumb navigation */}
            <div className="border-b bg-white px-6 py-3">
              <Breadcrumb
                items={generateBreadcrumbs().map((item) => ({
                  title: item.href ? (
                    <Link href={item.href}>{item.title}</Link>
                  ) : (
                    item.title
                  ),
                }))}
              />
            </div>

            {/* Main content area */}
            <div className="p-6">
              {loading ? (
                <div className="flex size-full items-center justify-center py-10">
                  <Spin size="large" tip="در حال بارگذاری..." />
                </div>
              ) : (
                children
              )}
            </div>
          </Content>

          {showFooter && <AppFooter />}
        </Layout>
      </Layout>
    </Layout>
  );
};
export default DashboardLayout;
