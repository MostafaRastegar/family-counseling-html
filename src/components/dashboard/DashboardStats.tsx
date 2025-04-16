'use client';

import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';

const { Title } = Typography;

const DashboardStats = ({ stats, title }) => {
  const renderStatCard = (stat, index) => {
    const { title, value, icon, color, prefix, suffix } = stat;

    return (
      <Col xs={24} sm={12} md={6} key={index}>
        <Card className="h-full">
          <Statistic
            title={title}
            value={value}
            prefix={icon && <span style={{ color }}>{icon}</span>}
            suffix={suffix}
            valueStyle={{ color }}
          />
        </Card>
      </Col>
    );
  };

  // اگر stats یک آرایه باشد (حالت معمولی)
  if (Array.isArray(stats)) {
    return (
      <Card className="mb-6" title={title}>
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => renderStatCard(stat, index))}
        </Row>
      </Card>
    );
  }

  // اگر stats یک آبجکت باشد (حالت مدیر)
  if (typeof stats === 'object' && stats !== null) {
    const adminStats = [
      {
        title: 'کل کاربران',
        value: stats.totalUsers,
        icon: <UserOutlined />,
        color: '#1890ff',
      },
      {
        title: 'مشاوران',
        value: stats.totalConsultants,
        icon: <TeamOutlined />,
        color: '#52c41a',
      },
      {
        title: 'مراجعان',
        value: stats.totalClients,
        icon: <UserOutlined />,
        color: '#722ed1',
      },
      {
        title: 'جلسات',
        value: stats.totalSessions,
        icon: <CalendarOutlined />,
        color: '#faad14',
      },
      {
        title: 'جلسات در انتظار',
        value: stats.pendingSessions,
        icon: <ClockCircleOutlined />,
        color: '#fa8c16',
      },
      {
        title: 'جلسات برگزار شده',
        value: stats.completedSessions,
        icon: <CheckCircleOutlined />,
        color: '#13c2c2',
      },
      {
        title: 'نظرات',
        value: stats.totalReviews,
        icon: <StarOutlined />,
        color: '#eb2f96',
      },
      {
        title: 'میانگین امتیاز',
        value: stats.averageRating,
        icon: <StarOutlined />,
        color: '#faad14',
        suffix: '/5',
      },
    ];

    return (
      <Card className="mb-6" title={title}>
        <Row gutter={[16, 16]}>
          {adminStats.map((stat, index) => renderStatCard(stat, index))}
        </Row>
      </Card>
    );
  }

  return null;
};

export default DashboardStats;
