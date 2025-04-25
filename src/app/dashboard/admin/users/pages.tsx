'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  Modal, 
  Typography, 
  notification,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined,
  UserAddOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import UsersTable from '@/components/admin/UsersTable';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialog';
import StatCard from '@/components/ui/card/StatCard';
import { users as mockUsers } from '@/mocks/users';

const { Text } = Typography;
const { confirm } = Modal;

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // بارگذاری داده‌های کاربران
  useEffect(() => {
    // شبیه‌سازی درخواست API
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // رویداد مشاهده جزئیات کاربر
  const handleViewUser = (userId: string) => {
    router.push(`/dashboard/admin/users/${userId}`);
  };

  // رویداد ویرایش کاربر
  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/admin/users/${userId}/edit`);
  };

  // رویداد حذف کاربر
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteConfirmVisible(true);
  };

  // تایید حذف کاربر
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);

    try {
      // شبیه‌سازی درخواست API برای حذف کاربر
      await new Promise(resolve => setTimeout(resolve, 1000));

      // حذف کاربر از لیست (در حالت واقعی از طریق API انجام می‌شود)
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));

      // نمایش پیام موفقیت
      notification.success({
        message: 'حذف کاربر',
        description: 'کاربر با موفقیت حذف شد.',
      });

      // بستن دیالوگ تایید
      setDeleteConfirmVisible(false);
    } catch (err) {
      notification.error({
        message: 'خطا در حذف کاربر',
        description: 'متأسفانه خطایی در حذف کاربر رخ داده است. لطفا مجددا تلاش کنید.',
      });
    } finally {
      setDeleteLoading(false);
      setUserToDelete(null);
    }
  };

  // لغو حذف کاربر
  const cancelDeleteUser = () => {
    setDeleteConfirmVisible(false);
    setUserToDelete(null);
  };

  // رویداد افزودن کاربر جدید
  const handleAddUser = () => {
    router.push('/dashboard/admin/users/add');
  };

  // محاسبه آمار کاربران
  const getUserStats = () => {
    const total = users.length;
    const admins = users.filter(user => user.role === 'admin').length;
    const consultants = users.filter(user => user.role === 'consultant').length;
    const clients = users.filter(user => user.role === 'client').length;

    return {
      total,
      admins,
      consultants,
      clients
    };
  };

  const stats = getUserStats();

  return (
    <div className="admin-users-page">
      <DashboardBreadcrumb />

      <AdminPageHeader
        title="مدیریت کاربران"
        subtitle="مشاهده، ویرایش و مدیریت کاربران سیستم"
        actions={[
          {
            key: 'add',
            text: 'افزودن کاربر',
            icon: <PlusOutlined />,
            onClick: handleAddUser,
            type: 'primary',
          },
        ]}
      />

      {/* کارت‌های آمار */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="کل کاربران"
            value={stats.total}
            icon={<TeamOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="مدیران سیستم"
            value={stats.admins}
            icon={<UserSwitchOutlined />}
            color="#722ed1"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="مشاوران"
            value={stats.consultants}
            icon={<UserOutlined />}
            color="#13c2c2"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="مراجعان"
            value={stats.clients}
            icon={<TeamOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
      </Row>

      {/* جدول کاربران */}
      <Card>
        <UsersTable
          users={users}
          loading={loading}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </Card>

      {/* دیالوگ تایید حذف کاربر */}
      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="آیا از حذف این کاربر اطمینان دارید؟"
        content="با حذف این کاربر، تمامی اطلاعات مرتبط با او نیز حذف خواهد شد. این عملیات غیرقابل بازگشت است."
        onCancel={cancelDeleteUser}
        onConfirm={confirmDeleteUser}
        confirmLoading={deleteLoading}
        type="error"
      />
    </div>
  );
}