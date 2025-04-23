import React from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';
import StatCard from '../card/StatCard';

interface UserStat {
  key: string;
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: {
    value: number;
    isIncreasing: boolean;
  };
  link?: string;
}

interface UserStatsProps {
  userRole?: 'admin' | 'consultant' | 'client';
  stats?: UserStat[];
  loading?: boolean;
  error?: string;
  className?: string;
}

const UserStats: React.FC<UserStatsProps> = ({
  userRole = 'client',
  stats,
  loading = false,
  error,
  className = '',
}) => {
  const router = useRouter();

  // Define default stats based on user role
  const getDefaultStats = (): UserStat[] => {
    // Common stats for all users
    const commonStats: UserStat[] = [
      {
        key: 'sessions',
        title: 'جلسات آینده',
        value: 3,
        icon: <CalendarOutlined />,
        color: '#1890ff',
        link: '/dashboard/sessions',
      },
      {
        key: 'wallet',
        title: 'موجودی کیف پول',
        value: '۵۰۰,۰۰۰ تومان',
        icon: <WalletOutlined />,
        color: '#52c41a',
        link: '/dashboard/wallet',
      },
    ];

    // Role-specific stats
    const roleStats: Record<string, UserStat[]> = {
      admin: [
        {
          key: 'users',
          title: 'کاربران فعال',
          value: 125,
          icon: <TeamOutlined />,
          color: '#722ed1',
          trend: {
            value: 8,
            isIncreasing: true,
          },
          link: '/dashboard/admin/users',
        },
        {
          key: 'sessions',
          title: 'جلسات امروز',
          value: 17,
          icon: <ClockCircleOutlined />,
          color: '#fa8c16',
          link: '/dashboard/admin/sessions',
        },
      ],
      consultant: [
        {
          key: 'availability',
          title: 'زمان‌های در دسترس',
          value: 12,
          icon: <ClockCircleOutlined />,
          color: '#fa8c16',
          link: '/dashboard/consultant/availability',
        },
        {
          key: 'rating',
          title: 'میانگین امتیاز',
          value: 4.8,
          suffix: <span className="text-sm">از ۵</span>,
          icon: <StarOutlined />,
          color: '#faad14',
          link: '/dashboard/consultant/reviews',
        },
      ],
      client: [
        {
          key: 'completed',
          title: 'جلسات انجام شده',
          value: 8,
          icon: <CheckCircleOutlined />,
          color: '#52c41a',
          link: '/dashboard/sessions',
        },
        {
          key: 'reviews',
          title: 'نظرات من',
          value: 5,
          icon: <StarOutlined />,
          color: '#faad14',
          link: '/dashboard/client/reviews',
        },
      ],
    };

    return [...commonStats, ...roleStats[userRole]];
  };

  // Use provided stats or generate default ones
  const userStats = stats || getDefaultStats();

  // Handle stat card click
  const handleStatClick = (stat: UserStat) => {
    if (stat.link) {
      router.push(stat.link);
    }
  };

  return (
    <div className={`user-stats ${className}`}>
      <Row gutter={[16, 16]}>
        {userStats.map((stat) => (
          <Col key={stat.key} xs={12} sm={12} md={6}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              prefix={stat.prefix}
              suffix={stat.suffix}
              trend={stat.trend}
              loading={loading}
              error={error}
              className={
                stat.link
                  ? 'cursor-pointer transition-shadow hover:shadow-md'
                  : ''
              }
              onClick={() => handleStatClick(stat)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserStats;
