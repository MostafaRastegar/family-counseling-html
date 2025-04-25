'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Row,
  Col,
  Tabs,
  Typography,
  notification,
  DatePicker,
  Badge,
  Button,
  Space
} from 'antd';
import { 
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { SessionStatus } from '@/components/sessions/session';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SessionTable from '@/components/admin/SessionTable';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialog';
import StatCard from '@/components/ui/card/StatCard';
import { sessions as mockSessions } from '@/mocks/sessions';

const { Text } = Typography;
const { RangePicker } = DatePicker;

export default function AdminSessionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // حالت‌های دیالوگ
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmContent, setConfirmContent] = useState('');
  const [confirmType, setConfirmType] = useState<'confirm' | 'warning' | 'error'>('confirm');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [actionType, setActionType] = useState<'cancel' | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // بارگذاری داده‌های جلسات
  useEffect(() => {
    // شبیه‌سازی درخواست API
    const timer = setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // تغییر تب فعال
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // فیلتر جلسات بر اساس تب فعال
  const getFilteredSessions = () => {
    switch (activeTab) {
      case 'pending':
        return sessions.filter(s => s.status === 'pending');
      case 'confirmed':
        return sessions.filter(s => s.status === 'confirmed');
      case 'completed':
        return sessions.filter(s => s.status === 'completed');
      case 'cancelled':
        return sessions.filter(s => s.status === 'cancelled');
      default:
        return sessions;
    }
  };

  // رویداد مشاهده جزئیات جلسه
  const handleViewSession = (sessionId: string) => {
    router.push(`/dashboard/admin/sessions/${sessionId}`);
  };

  // رویداد ویرایش جلسه
  const handleEditSession = (sessionId: string) => {
    router.push(`/dashboard/admin/sessions/${sessionId}/edit`);
  };

  // رویداد لغو جلسه
  const handleCancelSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setActionType('cancel');
    setConfirmTitle('لغو جلسه مشاوره');
    setConfirmContent('آیا از لغو این جلسه مشاوره اطمینان دارید؟ پس از لغو، این جلسه دیگر قابل بازگردانی نخواهد بود.');
    setConfirmType('warning');
    setConfirmVisible(true);
  };

  // تایید عملیات
  const handleConfirm = async () => {
    if (!selectedSessionId || !actionType) return;

    setConfirmLoading(true);

    try {
      // شبیه‌سازی درخواست API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (actionType === 'cancel') {
        // به‌روزرسانی وضعیت جلسه به لغو شده
        setSessions(prevSessions => 
          prevSessions.map(s => 
            s.id === selectedSessionId 
              ? { ...s, status: 'cancelled', updatedAt: new Date().toISOString() } 
              : s
          )
        );
        notification.success({
          message: 'جلسه لغو شد',
          description: 'جلسه مشاوره با موفقیت لغو شد.',
        });
      }

      // بستن دیالوگ تایید
      setConfirmVisible(false);
    } catch (err) {
      notification.error({
        message: 'خطا در انجام عملیات',
        description: 'متأسفانه خطایی در انجام عملیات رخ داده است. لطفا مجددا تلاش کنید.',
      });
    } finally {
      setConfirmLoading(false);
      setSelectedSessionId(null);
      setActionType(null);
    }
  };

  // لغو عملیات
  const handleCancel = () => {
    setConfirmVisible(false);
    setSelectedSessionId(null);
    setActionType(null);
  };

  // رویداد دریافت گزارش
  const handleExportReport = () => {
    notification.info({
      message: 'در حال آماده‌سازی گزارش',
      description: 'گزارش جلسات در حال آماده‌سازی است و به زودی دانلود خواهد شد.',
    });
    
    // شبیه‌سازی دانلود گزارش
    setTimeout(() => {
      notification.success({
        message: 'گزارش آماده دانلود است',
        description: 'گزارش جلسات مشاوره با موفقیت ایجاد شد.',
      });
    }, 2000);
  };

  // محاسبه آمار جلسات
  const getSessionStats = () => {
    const total = sessions.length;
    const pending = sessions.filter(s => s.status === 'pending').length;
    const confirmed = sessions.filter(s => s.status === 'confirmed').length;
    const completed = sessions.filter(s => s.status === 'completed').length;
    const cancelled = sessions.filter(s => s.status === 'cancelled').length;

    // محاسبه جلسات امروز
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= today && sessionDate < tomorrow;
    }).length;

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      today: todaySessions
    };
  };

  const stats = getSessionStats();
  const filteredSessions = getFilteredSessions();

  return (
    <div className="admin-sessions-page">
      <DashboardBreadcrumb />

      <AdminPageHeader
        title="مدیریت جلسات مشاوره"
        subtitle="مشاهده، ویرایش و مدیریت جلسات مشاوره در سیستم"
        actions={[
          {
            key: 'export',
            text: 'دریافت گزارش',
            icon: <FileTextOutlined />,
            onClick: handleExportReport,
            type: 'default',
          },
        ]}
      />

      {/* کارت‌های آمار */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <StatCard
            title="کل جلسات"
            value={stats.total}
            icon={<CalendarOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <StatCard
            title="جلسات امروز"
            value={stats.today}
            icon={<CalendarOutlined />}
            color="#13c2c2"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <StatCard
            title="در انتظار تایید"
            value={stats.pending}
            icon={<ClockCircleOutlined />}
            color="#faad14"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <StatCard
            title="تایید شده"
            value={stats.confirmed}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <StatCard
            title="تکمیل شده"
            value={stats.completed}
            icon={<CheckCircleOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <StatCard
            title="لغو شده"
            value={stats.cancelled}
            icon={<CloseCircleOutlined />}
            color="#ff4d4f"
            loading={loading}
          />
        </Col>
      </Row>

      {/* فیلترهای تاریخ */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Text strong>فیلتر زمانی:</Text>
          <Space wrap>
            <Button type="default">امروز</Button>
            <Button type="default">هفته جاری</Button>
            <Button type="default">ماه جاری</Button>
            <RangePicker 
              placeholder={['تاریخ شروع', 'تاریخ پایان']}
              allowClear
            />
          </Space>
        </div>
      </Card>

      {/* جدول جلسات */}
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <Tabs.TabPane 
            tab={<span>همه جلسات</span>} 
            key="all" 
          />
          <Tabs.TabPane 
            tab={
              <span>
                در انتظار تایید 
                <Badge 
                  count={stats.pending} 
                  style={{ 
                    marginRight: 6, 
                    backgroundColor: stats.pending > 0 ? '#faad14' : '#d9d9d9' 
                  }}
                />
              </span>
            } 
            key="pending" 
          />
          <Tabs.TabPane 
            tab={<span>تایید شده</span>} 
            key="confirmed" 
          />
          <Tabs.TabPane 
            tab={<span>تکمیل شده</span>} 
            key="completed" 
          />
          <Tabs.TabPane 
            tab={<span>لغو شده</span>} 
            key="cancelled" 
          />
        </Tabs>

        <SessionTable
          sessions={filteredSessions}
          loading={loading}
          onView={handleViewSession}
          onEdit={handleEditSession}
          onCancel={handleCancelSession}
        />
      </Card>

      {/* دیالوگ تایید عملیات */}
      <ConfirmDialog
        visible={confirmVisible}
        title={confirmTitle}
        content={confirmContent}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        confirmLoading={confirmLoading}
        type={confirmType}
      />
    </div>
  );
}