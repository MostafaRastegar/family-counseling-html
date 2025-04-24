'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileTextOutlined,
  MessageOutlined,
  RiseOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Typography } from 'antd';
import LatestUsers from '@/components/admin/LatestUsers';
import PendingConsultants from '@/components/admin/PendingConsultants';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SessionsStatusReport from '@/components/admin/SessionsStatusReport';
import RatingsReport from '@/components/admin/RatingsReport';
import StatCard from '@/components/ui/card/StatCard';
import { dashboardStats } from '@/mocks/dashboard-stats';
import { sessions } from '@/mocks/sessions';
import { users } from '@/mocks/users';
import { consultants } from '@/mocks/consultants';
import { reviews } from '@/mocks/reviews';

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(dashboardStats);
  const [latestUsers, setLatestUsers] = useState([]);
  const [pendingConsultants, setPendingConsultants] = useState([]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      // Get recent users (sort by createdAt)
      const sortedUsers = [...users]
        .sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
      
      // Get pending consultants (not verified)
      const filteredConsultants = consultants
        .filter(consultant => !consultant.isVerified)
        .slice(0, 5);
      
      setLatestUsers(sortedUsers);
      setPendingConsultants(filteredConsultants);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Prepare data for sessions by status chart
  const getSessionByStatusData = () => {
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      completed: 0, 
      cancelled: 0
    };

    sessions.forEach(session => {
      if (statusCounts.hasOwnProperty(session.status)) {
        statusCounts[session.status]++;
      }
    });

    return [
      { name: 'در انتظار تایید', value: statusCounts.pending, color: '#faad14' },
      { name: 'تایید شده', value: statusCounts.confirmed, color: '#1890ff' },
      { name: 'تکمیل شده', value: statusCounts.completed, color: '#52c41a' },
      { name: 'لغو شده', value: statusCounts.cancelled, color: '#ff4d4f' },
    ];
  };

  // Prepare data for ratings distribution chart
  const getRatingsData = () => {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating]++;
      }
    });

    return [
      { name: '1 ستاره', value: ratingCounts[1], color: '#ff4d4f' },
      { name: '2 ستاره', value: ratingCounts[2], color: '#faad14' },
      { name: '3 ستاره', value: ratingCounts[3], color: '#1890ff' },
      { name: '4 ستاره', value: ratingCounts[4], color: '#52c41a' },
      { name: '5 ستاره', value: ratingCounts[5], color: '#722ed1' },
    ];
  };

  return (
    <div className="admin-dashboard">
      <AdminPageHeader 
        title="داشبورد مدیریت" 
        subtitle="مشاهده آمار و وضعیت کلی سیستم"
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="کاربران"
            value={stats.totalUsers}
            icon={<TeamOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="مشاوران"
            value={stats.totalConsultants}
            icon={<UserOutlined />}
            color="#722ed1"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="جلسات"
            value={stats.totalSessions}
            icon={<MessageOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="میانگین امتیاز"
            value={stats.averageRating}
            icon={<StarOutlined />}
            color="#faad14"
            suffix="از 5"
            loading={loading}
          />
        </Col>
      </Row>

      {/* Reports Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card 
            title="وضعیت جلسات" 
            className="h-full"
            loading={loading}
          >
            <SessionsStatusReport 
              data={getSessionByStatusData()}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="توزیع امتیازها" 
            className="h-full"
            loading={loading}
          >
            <RatingsReport 
              data={getRatingsData()}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Tables Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="کاربران جدید" 
            className="h-full"
            extra={
              <Link href="/dashboard/admin/users">
                <Button type="link">مشاهده همه</Button>
              </Link>
            }
            loading={loading}
          >
            <LatestUsers users={latestUsers} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="مشاوران در انتظار تایید" 
            className="h-full"
            extra={
              <Link href="/dashboard/admin/consultants">
                <Button type="link">مشاهده همه</Button>
              </Link>
            }
            loading={loading}
          >
            <PendingConsultants consultants={pendingConsultants} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}