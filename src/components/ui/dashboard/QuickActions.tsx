import React from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Tooltip } from 'antd';

interface QuickAction {
  key: string;
  title: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  tooltip?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  userRole?: 'admin' | 'consultant' | 'client';
  customActions?: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  userRole = 'client',
  customActions,
  className = '',
}) => {
  const router = useRouter();

  // Define role-based quick actions
  const getDefaultActions = (): QuickAction[] => {
    const commonActions: QuickAction[] = [
      {
        key: 'profile',
        title: 'پروفایل',
        icon: <UserOutlined />,
        link: '/dashboard/profile',
        color: 'bg-blue-100 text-blue-500',
        tooltip: 'مشاهده و ویرایش پروفایل',
      },
      {
        key: 'sessions',
        title: 'جلسات من',
        icon: <CalendarOutlined />,
        link: '/dashboard/sessions',
        color: 'bg-purple-100 text-purple-500',
        tooltip: 'مدیریت جلسات مشاوره',
      },
      {
        key: 'wallet',
        title: 'کیف پول',
        icon: <WalletOutlined />,
        link: '/dashboard/wallet',
        color: 'bg-green-100 text-green-500',
        tooltip: 'مدیریت کیف پول',
      },
      {
        key: 'messages',
        title: 'پیام‌ها',
        icon: <MessageOutlined />,
        link: '/dashboard/messaging',
        color: 'bg-orange-100 text-orange-500',
        tooltip: 'مشاهده پیام‌ها',
      },
    ];

    const roleSpecificActions: Record<string, QuickAction[]> = {
      admin: [
        {
          key: 'manage-users',
          title: 'مدیریت کاربران',
          icon: <TeamOutlined />,
          link: '/dashboard/admin/users',
          color: 'bg-red-100 text-red-500',
          tooltip: 'مدیریت کاربران سیستم',
        },
      ],
      consultant: [
        {
          key: 'availability',
          title: 'زمان‌های من',
          icon: <ClockCircleOutlined />,
          link: '/dashboard/consultant/availability',
          color: 'bg-yellow-100 text-yellow-500',
          tooltip: 'مدیریت زمان‌های در دسترس',
        },
      ],
      client: [
        {
          key: 'find-consultant',
          title: 'یافتن مشاور',
          icon: <TeamOutlined />,
          link: '/dashboard/client/consultants',
          color: 'bg-indigo-100 text-indigo-500',
          tooltip: 'جستجو و انتخاب مشاور',
        },
      ],
    };

    return [...commonActions, ...roleSpecificActions[userRole]];
  };

  // Use custom actions if provided, otherwise use default actions
  const actions = customActions || getDefaultActions();

  // Handle action click
  const handleActionClick = (action: QuickAction) => {
    if (!action.disabled) {
      router.push(action.link);
    }
  };

  return (
    <Card
      title="دسترسی سریع"
      className={`quick-actions ${className}`}
      bodyStyle={{ padding: '12px' }}
    >
      <Row gutter={[12, 12]}>
        {actions.map((action) => (
          <Col key={action.key} xs={12} sm={8} md={6} lg={6} xl={4}>
            <Tooltip title={action.tooltip || action.title}>
              <div
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg p-4 transition-colors hover:shadow-md ${
                  action.color
                } ${action.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={() => handleActionClick(action)}
              >
                <div className="text-2xl">{action.icon}</div>
                <div className="mt-2 text-center text-sm font-medium">
                  {action.title}
                </div>
              </div>
            </Tooltip>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickActions;
