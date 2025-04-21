'use client';

import Link from 'next/link';
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  List,
  Progress,
  Row,
  Tag,
  Typography,
} from 'antd';
import StatsCards from '@/components/common/StatsCards';

const { Title, Paragraph } = Typography;

// داده‌های نمونه برای آمار
const stats = {
  totalUsers: 150,
  totalConsultants: 35,
  totalClients: 115,
  totalSessions: 425,
  pendingSessions: 18,
  completedSessions: 407,
  totalReviews: 320,
  averageRating: 4.7,
};

// Convert stats to StatsCards format
const statsItems = [
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

// داده‌های نمونه برای مشاوران در انتظار تأیید
const pendingConsultants = [
  {
    id: 1,
    name: 'محمد حسینی',
    specialties: ['مشاوره خانواده', 'مشکلات زناشویی'],
    registerDate: '1401/01/05',
  },
  {
    id: 2,
    name: 'زهرا نوری',
    specialties: ['فرزندپروری', 'مشاوره تحصیلی'],
    registerDate: '1401/01/10',
  },
  {
    id: 3,
    name: 'علی مرادی',
    specialties: ['مشاوره قبل از ازدواج', 'روابط عاطفی'],
    registerDate: '1401/01/15',
  },
];

export default function AdminDashboard() {
  return (
    <div className="container mx-auto">
      <Title level={2}>داشبورد مدیریت</Title>
      <Paragraph className="mb-8 text-gray-500">
        خوش آمدید! آمار و اطلاعات پلتفرم در اینجا نمایش داده می‌شود.
      </Paragraph>

      {/* آمار کلی */}
      <StatsCards
        stats={statsItems}
        cols={{ xs: 24, sm: 12, md: 8, lg: 6 }}
        className="mb-8"
      />

      <Row gutter={[16, 16]} className="mt-8">
        {/* مشاوران در انتظار تأیید */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center">
                <ExclamationCircleOutlined className="text-yellow-500 mr-2" />
                <span>مشاوران در انتظار تأیید</span>
                <Badge count={pendingConsultants.length} className="mr-2" />
              </div>
            }
            extra={<Link href="/dashboard/admin/verify">مشاهده همه</Link>}
          >
            <List
              dataSource={pendingConsultants}
              renderItem={(consultant) => (
                <List.Item
                  actions={[
                    <Link
                      key="view"
                      href={`/dashboard/admin/verify?id=${consultant.id}`}
                    >
                      <Button type="primary" size="small">
                        بررسی
                      </Button>
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={consultant.name}
                    description={
                      <div>
                        <div className="mb-1">
                          {consultant.specialties.map((specialty, index) => (
                            <Tag key={index} color="blue" className="mb-1">
                              {specialty}
                            </Tag>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">
                          تاریخ ثبت نام: {consultant.registerDate}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* آمار تکمیلی و نمودارها */}
        <Col xs={24} md={12}>
          <Card title="توزیع کاربران">
            <div className="mb-6">
              <div className="mb-2 flex justify-between">
                <span>مشاوران</span>
                <span>
                  {stats.totalConsultants} نفر (
                  {Math.round(
                    (stats.totalConsultants / stats.totalUsers) * 100,
                  )}
                  %)
                </span>
              </div>
              <Progress
                percent={Math.round(
                  (stats.totalConsultants / stats.totalUsers) * 100,
                )}
                showInfo={false}
                strokeColor="#1890ff"
              />
            </div>
            <div className="mb-6">
              <div className="mb-2 flex justify-between">
                <span>مراجعان</span>
                <span>
                  {stats.totalClients} نفر (
                  {Math.round((stats.totalClients / stats.totalUsers) * 100)}%)
                </span>
              </div>
              <Progress
                percent={Math.round(
                  (stats.totalClients / stats.totalUsers) * 100,
                )}
                showInfo={false}
                strokeColor="#52c41a"
              />
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <span>وضعیت جلسات</span>
                <span>
                  تکمیل شده:{' '}
                  {Math.round(
                    (stats.completedSessions / stats.totalSessions) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                percent={Math.round(
                  (stats.completedSessions / stats.totalSessions) * 100,
                )}
                showInfo={false}
                strokeColor="#722ed1"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* اقدامات سریع */}
      <Card title="مدیریت سیستم" className="mt-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Link href="/dashboard/admin/users">
              <Button type="primary" block icon={<UserOutlined />}>
                مدیریت کاربران
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link href="/dashboard/admin/consultants">
              <Button block icon={<TeamOutlined />}>
                مدیریت مشاوران
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link href="/dashboard/admin/sessions">
              <Button block icon={<CalendarOutlined />}>
                مدیریت جلسات
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
