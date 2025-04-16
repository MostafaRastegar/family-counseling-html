'use client';

import Link from 'next/link';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import DashboardStats from '@/components/dashboard/DashboardStats';

const { Title, Paragraph } = Typography;

// داده‌های نمونه برای آمار
const stats = [
  {
    title: 'جلسات امروز',
    value: 3,
    icon: <CalendarOutlined />,
    color: '#1890ff',
  },
  {
    title: 'مراجعان',
    value: 15,
    icon: <TeamOutlined />,
    color: '#52c41a',
  },
  {
    title: 'میانگین امتیاز',
    value: '4.8',
    icon: <StarOutlined />,
    color: '#faad14',
  },
  {
    title: 'درآمد ماه جاری',
    value: '۵,۶۰۰,۰۰۰',
    prefix: '₹',
    icon: <DollarOutlined />,
    color: '#722ed1',
  },
];

// داده‌های نمونه برای جلسات امروز
const todaySessions = [
  {
    id: 1,
    client: 'محمد رضایی',
    time: '10:00',
    status: 'confirmed',
    duration: '۶۰ دقیقه',
  },
  {
    id: 2,
    client: 'مریم محمدی',
    time: '14:30',
    status: 'confirmed',
    duration: '۴۵ دقیقه',
  },
  {
    id: 3,
    client: 'علی احمدی',
    time: '16:00',
    status: 'pending',
    duration: '۶۰ دقیقه',
  },
];

// داده‌های نمونه برای آخرین نظرات
const latestReviews = [
  {
    id: 1,
    client: 'زهرا کریمی',
    date: '1401/01/10',
    rating: 5,
    comment: 'بسیار عالی بود! از مشاوره با شما بسیار راضی هستم.',
  },
  {
    id: 2,
    client: 'امیر حسینی',
    date: '1401/01/05',
    rating: 4,
    comment: 'راهنمایی‌های خوبی در مورد مشکل فرزندم به من دادید. ممنونم.',
  },
];

export default function ConsultantDashboard() {
  return (
    <div className="container mx-auto">
      <Title level={2}>داشبورد مشاور</Title>
      <Paragraph className="mb-8 text-gray-500">
        خوش آمدید! اطلاعات کلیدی و جلسات امروز شما در اینجا نمایش داده می‌شود.
      </Paragraph>

      {/* آمار */}
      <DashboardStats stats={stats} />

      <Row gutter={[16, 16]} className="mt-8">
        {/* جلسات امروز */}
        <Col xs={24} md={16}>
          <Card
            title="جلسات امروز"
            extra={
              <Link href="/dashboard/consultant/sessions">مشاهده همه</Link>
            }
          >
            <List
              dataSource={todaySessions}
              renderItem={(session) => (
                <List.Item
                  actions={[
                    <Link
                      key="view"
                      href={`/dashboard/consultant/sessions/${session.id}`}
                    >
                      <Button type="link">جزئیات</Button>
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-center">
                        {session.client}
                        <Badge
                          className="mr-2"
                          status={
                            session.status === 'confirmed'
                              ? 'success'
                              : 'warning'
                          }
                          text={
                            session.status === 'confirmed'
                              ? 'تأیید شده'
                              : 'در انتظار تأیید'
                          }
                        />
                      </div>
                    }
                    description={
                      <span>
                        <ClockCircleOutlined className="mr-2" />
                        ساعت {session.time} - مدت: {session.duration}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* آخرین نظرات */}
        <Col xs={24} md={8}>
          <Card
            title="آخرین نظرات"
            extra={<Link href="/dashboard/consultant/reviews">مشاهده همه</Link>}
          >
            <List
              itemLayout="vertical"
              dataSource={latestReviews}
              renderItem={(review) => (
                <List.Item>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{review.client}</span>
                      <div>
                        {Array(review.rating)
                          .fill()
                          .map((_, i) => (
                            <StarOutlined key={i} className="text-yellow-400" />
                          ))}
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-gray-600">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* اقدامات سریع */}
      <Card title="اقدامات سریع" className="mt-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Link href="/dashboard/consultant/availabilities">
              <Button type="primary" block icon={<CalendarOutlined />}>
                مدیریت زمان‌های دردسترس
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link href="/dashboard/consultant/sessions">
              <Button block icon={<TeamOutlined />}>
                مدیریت جلسات
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link href="/profile">
              <Button block icon={<UserOutlined />}>
                ویرایش پروفایل
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
