import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarOutlined,
  DashboardOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Typography } from 'antd';

const { Text } = Typography;

interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}

interface DashboardBreadcrumbProps {
  items?: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
}

const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({
  items,
  homeHref = '/dashboard',
  className = '',
}) => {
  const pathname = usePathname();

  // Function to get icon for a path segment
  const getIconForPathSegment = (segment: string): React.ReactNode => {
    switch (segment) {
      case 'dashboard':
        return <DashboardOutlined />;
      case 'profile':
        return <UserOutlined />;
      case 'consultants':
        return <TeamOutlined />;
      case 'sessions':
        return <CalendarOutlined />;
      case 'settings':
        return <SettingOutlined />;
      case 'reviews':
        return <StarOutlined />;
      default:
        return null;
    }
  };

  // Function to get display name for a path segment
  const getDisplayName = (segment: string): string => {
    // Convert kebab-case to Title Case and translate common segments
    const segmentMap: Record<string, string> = {
      dashboard: 'داشبورد',
      profile: 'پروفایل',
      consultants: 'مشاوران',
      admin: 'مدیریت',
      client: 'مراجع',
      consultant: 'مشاور',
      sessions: 'جلسات',
      reviews: 'نظرات',
      settings: 'تنظیمات',
      availability: 'زمان‌های در دسترس',
      book: 'رزرو',
      wallet: 'کیف پول',
      notifications: 'اعلان‌ها',
      help: 'راهنما و پشتیبانی',
      messaging: 'پیام‌ها',
    };

    return (
      segmentMap[segment] ||
      segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    );
  };

  // Generate breadcrumb items from pathname if not provided
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    if (items && items.length > 0) return items;

    const pathSegments = pathname.split('/').filter(Boolean);
    let currentPath = '';

    // Create breadcrumb items from path segments
    const breadcrumbItems: BreadcrumbItem[] = [
      {
        title: 'داشبورد',
        href: homeHref,
        icon: <DashboardOutlined />,
      },
    ];

    // Add segments to breadcrumb
    pathSegments.forEach((segment, index) => {
      if (index === 0 && segment === 'dashboard') return; // Skip first dashboard segment

      currentPath += `/${segment}`;
      breadcrumbItems.push({
        title: getDisplayName(segment),
        href: currentPath,
        icon: getIconForPathSegment(segment),
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <Breadcrumb className={className}>
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item key={index}>
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link href={item.href} className="flex items-center">
              {item.icon && <span className="ml-1">{item.icon}</span>}
              <Text>{item.title}</Text>
            </Link>
          ) : (
            <span className="flex items-center">
              {item.icon && <span className="ml-1">{item.icon}</span>}
              <Text>{item.title}</Text>
            </span>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
