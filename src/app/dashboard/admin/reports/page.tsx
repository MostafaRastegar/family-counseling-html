'use client';

import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Table, 
  Statistic, 
  Progress, 
  Space, 
  DatePicker, 
  Select, 
  Button,
  Divider
} from 'antd';
import { 
  CalendarOutlined,
  FileTextOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import StatCard from '@/components/ui/card/StatCard';
import SessionsStatusReport from '@/components/admin/SessionsStatusReport';
import RatingsReport from '@/components/admin/RatingsReport';
import { dashboardStats } from '@/mocks/dashboard-stats';
import { users } from '@/mocks/users';
import { consultants } from '@/mocks/consultants';
import { sessions } from '@/mocks/sessions';
import { reviews } from '@/mocks/reviews';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(dashboardStats);
  const [reportPeriod, setReportPeriod] = useState('month');
  const [selectedDateRange, setSelectedDateRange] = useState<any>(null);

  // بارگذاری داده‌ها
  useEffect(() => {
    // شبیه‌سازی درخواست API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // تغییر دوره گزارش
  const handlePeriodChange = (period: string) => {
    setReportPeriod(period);
    // در حالت واقعی اینجا درخواست API برای دریافت داده‌های دوره جدید ارسال می‌شود
  };

  // تغییر بازه زمانی
  const handleDateRangeChange = (dates: any) => {
    setSelectedDateRange(dates);
    // در حالت واقعی اینجا درخواست API برای دریافت داده‌های بازه جدید ارسال می‌شود
  };

  // داده برای گزارش وضعیت جلسات
  const getSessionStatusData = () => {
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

  // داده برای گزارش امتیازات
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

  // داده برای جدول آمار کاربران
  const getUsersTableData = () => {
    const roleCount = {
      admin: users.filter(u => u.role === 'admin').length,
      consultant: users.filter(u => u.role === 'consultant').length,
      client: users.filter(u => u.role === 'client').length
    };

    const verifiedConsultants = consultants.filter(c => c.isVerified).length;
    const pendingConsultants = consultants.length - verifiedConsultants;

    return [
      {
        key: '1',
        category: 'کاربران',
        total: users.length,
        details: [
          { label: 'مدیران', value: roleCount.admin },
          { label: 'مشاوران', value: roleCount.consultant },
          { label: 'مراجعان', value: roleCount.client }
        ]
      },
      {
        key: '2',
        category: 'مشاوران',
        total: consultants.length,
        details: [
          { label: 'تایید شده', value: verifiedConsultants },
          { label: 'در انتظار تایید', value: pendingConsultants }
        ]
      },
      {
        key: '3',
        category: 'جلسات',
        total: sessions.length,
        details: [
          { label: 'در انتظار تایید', value: sessions.filter(s => s.status === 'pending').length },
          { label: 'تایید شده', value: sessions.filter(s => s.status === 'confirmed').length },
          { label: 'تکمیل شده', value: sessions.filter(s => s.status === 'completed').length },
          { label: 'لغو شده', value: sessions.filter(s => s.status === 'cancelled').length }
        ]
      },
      {
        key: '4',
        category: 'نظرات',
        total: reviews.length,
        details: []
      }
    ];
  };

  // ستون‌های جدول آمار کاربران
  const usersStatsColumns = [
    {
      title: 'دسته‌بندی',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'تعداد کل',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'جزئیات',
      dataIndex: 'details',
      key: 'details',
      render: (details: { label: string; value: number }[]) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between">
              <span>{detail.label}:</span>
              <span>{detail.value}</span>
            </div>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-reports-page">
      <DashboardBreadcrumb />

      <AdminPageHeader
        title="گزارش‌های سیستم"
        subtitle="مشاهده آمار و گزارش‌های جامع عملکرد سیستم"
      />

      {/* فیلترهای گزارش */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Title level={5} className="mb-4">فیلترهای گزارش</Title>
          </div>

          <div className="flex flex-wrap gap-4">
            <Select 
              value={reportPeriod} 
              onChange={handlePeriodChange}
              style={{ width: 150 }}
            >
              <Option value="week">هفته جاری</Option>
              <Option value="month">ماه جاری</Option>
              <Option value="quarter">سه ماهه اخیر</Option>
              <Option value="year">سال جاری</Option>
              <Option value="custom">بازه سفارشی</Option>
            </Select>

            {reportPeriod === 'custom' && (
              <RangePicker 
                onChange={handleDateRangeChange}
                style={{ width: 240 }}
                placeholder={['تاریخ شروع', 'تاریخ پایان']}
              />
            )}

            <Button type="primary" icon={<FileTextOutlined />}>
              دریافت گزارش
            </Button>
          </div>
        </div>
      </Card>

      {/* کارت‌های آمار کلی */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="کل کاربران"
            value={stats.totalUsers}
            icon={<TeamOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="کل مشاوران"
            value={stats.totalConsultants}
            icon={<UserOutlined />}
            color="#722ed1"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="کل جلسات"
            value={stats.totalSessions}
            icon={<CalendarOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="میانگین امتیاز"
            value={stats.averageRating}
            suffix="از 5"
            icon={<StarOutlined />}
            color="#faad14"
            loading={loading}
          />
        </Col>
      </Row>

      {/* جدول آمار کاربران */}
      <Card title="آمار کلی" className="mb-6" loading={loading}>
        <Table 
          columns={usersStatsColumns} 
          dataSource={getUsersTableData()} 
          pagination={false}
          size="small"
        />
      </Card>

      {/* گزارش‌های اصلی */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="وضعیت جلسات" 
            className="mb-6"
            loading={loading}
          >
            <SessionsStatusReport 
              data={getSessionStatusData()}
              loading={loading}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="توزیع امتیازها" 
            className="mb-6"
            loading={loading}
          >
            <RatingsReport 
              data={getRatingsData()}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* آمار عملکرد سیستم */}
      <Card title="آمار عملکرد سیستم" loading={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="border-gray-200 mb-4 rounded-lg border p-4">
              <Title level={5}>وضعیت جلسات در ماه جاری</Title>
              <div className="mt-4">
                <div className="mb-3 flex items-center justify-between">
                  <Text>جلسات تکمیل شده:</Text>
                  <Text strong className="text-green-600">{stats.completedSessions}</Text>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <Text>جلسات در انتظار تایید:</Text>
                  <Text strong className="text-orange-500">{stats.pendingSessions}</Text>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <Text>مجموع جلسات:</Text>
                  <Text strong>{stats.totalSessions}</Text>
                </div>

                <Divider />

                <div className="mb-3">
                  <div className="mb-1 flex justify-between">
                    <Text>نرخ تکمیل جلسات:</Text>
                    <Text strong>{Math.round((stats.completedSessions / stats.totalSessions) * 100)}%</Text>
                  </div>
                  <Progress 
                    percent={Math.round((stats.completedSessions / stats.totalSessions) * 100)} 
                    strokeColor="#52c41a"
                    showInfo={false}
                  />
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="border-gray-200 mb-4 rounded-lg border p-4">
              <Title level={5}>آمار نظرات و امتیازها</Title>
              <div className="mt-4">
                <div className="mb-3 flex items-center justify-between">
                  <Text>کل نظرات ثبت شده:</Text>
                  <Text strong>{stats.totalReviews}</Text>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <Text>میانگین امتیاز:</Text>
                  <Text strong>{stats.averageRating} از 5</Text>
                </div>

                <Divider />

                <div className="mb-3">
                  <div className="mb-1 flex justify-between">
                    <Text>رضایت کاربران:</Text>
                    <Text strong>{Math.round(stats.averageRating * 20)}%</Text>
                  </div>
                  <Progress 
                    percent={Math.round(stats.averageRating * 20)} 
                    strokeColor="#722ed1"
                    showInfo={false}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}