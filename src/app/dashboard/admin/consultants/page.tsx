'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Modal, 
  Typography, 
  notification,
  Row,
  Col,
  Tabs,
  Badge
} from 'antd';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarOutlined,
  UserOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConsultantsTable from '@/components/admin/ConsultantsTable';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialog';
import StatCard from '@/components/ui/card/StatCard';
import { consultants as mockConsultants } from '@/mocks/consultants';

const { Text } = Typography;
const { TabPane } = Tabs;

export default function AdminConsultantsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // حالت‌های دیالوگ
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmContent, setConfirmContent] = useState('');
  const [confirmType, setConfirmType] = useState<'confirm' | 'warning' | 'error'>('confirm');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'delete' | null>(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState<string | null>(null);

  // بارگذاری داده‌های مشاوران
  useEffect(() => {
    // شبیه‌سازی درخواست API
    const timer = setTimeout(() => {
      setConsultants(mockConsultants);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // تغییر تب فعال
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // فیلتر مشاوران بر اساس تب فعال
  const getFilteredConsultants = () => {
    switch (activeTab) {
      case 'pending':
        return consultants.filter(c => !c.isVerified);
      case 'verified':
        return consultants.filter(c => c.isVerified);
      default:
        return consultants;
    }
  };

  // رویداد مشاهده جزئیات مشاور
  const handleViewConsultant = (consultantId: string) => {
    router.push(`/dashboard/admin/consultants/${consultantId}`);
  };

  // رویداد ویرایش مشاور
  const handleEditConsultant = (consultantId: string) => {
    router.push(`/dashboard/admin/consultants/${consultantId}/edit`);
  };

  // رویداد تایید مشاور
  const handleApprove = (consultantId: string) => {
    setSelectedConsultantId(consultantId);
    setActionType('approve');
    setConfirmTitle('تایید مشاور');
    setConfirmContent('آیا از تایید این مشاور اطمینان دارید؟ پس از تایید، امکان ارائه خدمات مشاوره برای این مشاور فعال خواهد شد.');
    setConfirmType('confirm');
    setConfirmVisible(true);
  };

  // رویداد رد مشاور
  const handleReject = (consultantId: string) => {
    setSelectedConsultantId(consultantId);
    setActionType('reject');
    setConfirmTitle('رد درخواست مشاور');
    setConfirmContent('آیا از رد درخواست این مشاور اطمینان دارید؟ در صورت رد، درخواست مشاوره این کاربر رد شده و باید مجدداً درخواست بدهد.');
    setConfirmType('warning');
    setConfirmVisible(true);
  };

  // رویداد حذف مشاور
  const handleDelete = (consultantId: string) => {
    setSelectedConsultantId(consultantId);
    setActionType('delete');
    setConfirmTitle('حذف مشاور');
    setConfirmContent('آیا از حذف این مشاور اطمینان دارید؟ با حذف این مشاور، تمام اطلاعات مربوط به جلسات، نظرات و سوابق او نیز حذف خواهد شد.');
    setConfirmType('error');
    setConfirmVisible(true);
  };

  // تایید عملیات
  const handleConfirm = async () => {
    if (!selectedConsultantId || !actionType) return;

    setConfirmLoading(true);

    try {
      // شبیه‌سازی درخواست API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // پیاده‌سازی عملیات بر اساس نوع عمل
      switch (actionType) {
        case 'approve':
          // به‌روزرسانی وضعیت مشاور به تایید شده
          setConsultants(prevConsultants => 
            prevConsultants.map(c => 
              c.id === selectedConsultantId 
                ? { ...c, isVerified: true } 
                : c
            )
          );
          notification.success({
            message: 'مشاور تایید شد',
            description: 'مشاور با موفقیت تایید شد و می‌تواند خدمات مشاوره ارائه دهد.',
          });
          break;
        
        case 'reject':
          // حذف مشاور در حالت واقعی احتمالاً مشاور به لیست رد شده‌ها منتقل می‌شود
          setConsultants(prevConsultants => 
            prevConsultants.filter(c => c.id !== selectedConsultantId)
          );
          notification.info({
            message: 'درخواست مشاور رد شد',
            description: 'درخواست مشاوره این کاربر با موفقیت رد شد.',
          });
          break;
        
        case 'delete':
          // حذف مشاور از لیست
          setConsultants(prevConsultants => 
            prevConsultants.filter(c => c.id !== selectedConsultantId)
          );
          notification.success({
            message: 'مشاور حذف شد',
            description: 'مشاور با موفقیت حذف شد.',
          });
          break;
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
      setSelectedConsultantId(null);
      setActionType(null);
    }
  };

  // لغو عملیات
  const handleCancel = () => {
    setConfirmVisible(false);
    setSelectedConsultantId(null);
    setActionType(null);
  };

  // محاسبه آمار مشاوران
  const getConsultantStats = () => {
    const total = consultants.length;
    const verified = consultants.filter(c => c.isVerified).length;
    const pending = total - verified;
    const avgRating = consultants.reduce((sum, c) => sum + c.rating, 0) / (total || 1);
    const totalReviews = consultants.reduce((sum, c) => sum + c.reviewCount, 0);

    return {
      total,
      verified,
      pending,
      avgRating: avgRating.toFixed(1),
      totalReviews
    };
  };

  const stats = getConsultantStats();
  const filteredConsultants = getFilteredConsultants();

  return (
    <div className="admin-consultants-page">
      <DashboardBreadcrumb />

      <AdminPageHeader
        title="مدیریت مشاوران"
        subtitle="مشاهده، ویرایش و تایید مشاوران سیستم"
      />

      {/* کارت‌های آمار */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="کل مشاوران"
            value={stats.total}
            icon={<UserOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="مشاوران تایید شده"
            value={stats.verified}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="در انتظار تایید"
            value={stats.pending}
            icon={<CloseCircleOutlined />}
            color="#faad14"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="میانگین امتیاز"
            value={stats.avgRating}
            suffix={<Text className="text-xs">(از {stats.totalReviews} نظر)</Text>}
            icon={<StarOutlined />}
            color="#722ed1"
            loading={loading}
          />
        </Col>
      </Row>

      {/* جدول مشاوران */}
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <Tabs.TabPane 
            tab={<span>همه مشاوران</span>} 
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
            key="verified" 
          />
        </Tabs>

        <ConsultantsTable
          consultants={filteredConsultants}
          loading={loading}
          onView={handleViewConsultant}
          onEdit={handleEditConsultant}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
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