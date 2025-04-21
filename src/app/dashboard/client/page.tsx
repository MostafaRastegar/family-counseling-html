'use client';

import Link from 'next/link';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import StatsCards from '@/components/common/StatsCards';

const { Title, Paragraph } = Typography;

// داده‌های نمونه برای آمار
const statsItems = [
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
      <StatsCards stats={statsItems} className="mb-8" />

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
