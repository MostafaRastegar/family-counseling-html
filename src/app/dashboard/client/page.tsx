'use client';

import Link from 'next/link';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Col, List, Row, Tag, Typography } from 'antd';
import DashboardStats from '@/components/dashboard/DashboardStats';

const { Title, Paragraph } = Typography;

// داده‌های نمونه برای جلسات آینده
const upcomingSessions = [
  {
    id: 1,
    consultant: 'دکتر علی محمدی',
    date: '1401/01/25',
    time: '14:30',
    status: 'confirmed',
  },
  {
    id: 2,
    consultant: 'دکتر سارا احمدی',
    date: '1401/02/05',
    time: '10:00',
    status: 'pending',
  },
];

// داده‌های نمونه برای آمار
const stats = [
  {
    title: 'جلسات برگزار شده',
    value: 8,
    icon: <CalendarOutlined />,
    color: '#1890ff',
  },
  {
    title: 'مشاوران مورد علاقه',
    value: 3,
    icon: <TeamOutlined />,
    color: '#52c41a',
  },
  {
    title: 'جلسات آینده',
    value: 2,
    icon: <ClockCircleOutlined />,
    color: '#722ed1',
  },
];

export default function ClientDashboard() {
  return (
    <div className="container mx-auto">
      <Title level={2}>داشبورد مراجع</Title>
      <Paragraph className="mb-8 text-gray-500">
        خوش آمدید! از اینجا می‌توانید جلسات مشاوره خود را مدیریت کنید.
      </Paragraph>

      {/* آمار */}
      <DashboardStats stats={stats} />

      {/* جلسات آینده */}
      <Card title="جلسات آینده" className="mb-8">
        <List
          dataSource={upcomingSessions}
          renderItem={(session) => (
            <List.Item
              actions={[
                <Link
                  key="view"
                  href={`/dashboard/client/sessions/${session.id}`}
                >
                  <Button type="link">مشاهده جزئیات</Button>
                </Link>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="flex items-center">
                    {session.consultant}
                    <Badge
                      className="mr-2"
                      status={
                        session.status === 'confirmed' ? 'success' : 'warning'
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
                    <CalendarOutlined className="mr-2" />
                    {session.date} - ساعت {session.time}
                  </span>
                }
              />
            </List.Item>
          )}
        />
        <div className="mt-4 text-center">
          <Link href="/dashboard/client/sessions">
            <Button type="primary">مشاهده همه جلسات</Button>
          </Link>
        </div>
      </Card>

      {/* اقدامات سریع */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            hoverable
            className="text-center"
            onClick={() =>
              (window.location.href = '/dashboard/client/consultants')
            }
          >
            <TeamOutlined className="text-blue-500 mb-4 text-4xl" />
            <Title level={4}>یافتن مشاور</Title>
            <Paragraph>جستجو در بین مشاوران و انتخاب بهترین گزینه</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            hoverable
            className="text-center"
            onClick={() =>
              (window.location.href = '/dashboard/client/sessions')
            }
          >
            <CalendarOutlined className="text-green-500 mb-4 text-4xl" />
            <Title level={4}>مدیریت جلسات</Title>
            <Paragraph>مشاهده، لغو یا تغییر زمان جلسات مشاوره</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            hoverable
            className="text-center"
            onClick={() => (window.location.href = '/profile')}
          >
            <ClockCircleOutlined className="text-purple-500 mb-4 text-4xl" />
            <Title level={4}>پروفایل من</Title>
            <Paragraph>مشاهده و ویرایش اطلاعات حساب کاربری</Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
