'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, message, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import UsersTable from '@/components/admin/UsersTable';
import UserForm from '@/components/admin/UserForm';
import UserDetail from '@/components/admin/UserDetail';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialog';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import { users as mockUsers } from '@/mocks/users';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load users data
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle view user details
  const handleViewUser = (userId: string) => {
    const user = users.find(user => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setDetailModalVisible(true);
    }
  };

  // Handle edit user
  const handleEditUser = (userId: string) => {
    const user = users.find(user => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setEditModalVisible(true);
    }
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    const user = users.find(user => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setDeleteModalVisible(true);
    }
  };

  // Handle add new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setAddModalVisible(true);
  };

  // Handle form submit for add/edit
  const handleFormSubmit = (values: any, isEdit: boolean) => {
    setActionLoading(true);

    // Simulate API call
    setTimeout(() => {
      let updatedUsers;
      
      if (isEdit && selectedUser) {
        // Update existing user
        updatedUsers = users.map(user => 
          user.id === selectedUser.id ? { ...user, ...values } : user
        );
        notification.success({
          message: 'کاربر به‌روزرسانی شد',
          description: `اطلاعات کاربر ${values.fullName} با موفقیت به‌روزرسانی شد.`,
        });
      } else {
        // Add new user
        const newUser = {
          id: `user-${Date.now()}`,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedUsers = [...users, newUser];
        notification.success({
          message: 'کاربر جدید اضافه شد',
          description: `کاربر ${values.fullName} با موفقیت اضافه شد.`,
        });
      }

      setUsers(updatedUsers);
      setActionLoading(false);
      setEditModalVisible(false);
      setAddModalVisible(false);
    }, 1500);
  };

  // Handle confirm user deletion
  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    
    setActionLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      
      notification.success({
        message: 'کاربر حذف شد',
        description: `کاربر ${selectedUser.fullName} با موفقیت حذف شد.`,
      });
      
      setActionLoading(false);
      setDeleteModalVisible(false);
    }, 1500);
  };

  return (
    <div className="admin-users-page">
      <DashboardBreadcrumb />
      
      <AdminPageHeader
        title="مدیریت کاربران"
        subtitle="مشاهده، ویرایش و مدیریت کاربران سیستم"
        actions={[
          {
            key: 'add-user',
            text: 'افزودن کاربر',
            icon: <PlusOutlined />,
            onClick: handleAddUser,
            type: 'primary',
          },
        ]}
      />

      <UsersTable 
        users={users}
        loading={loading}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* User Detail Modal */}
      <Modal
        title="مشاهده اطلاعات کاربر"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            بستن
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setDetailModalVisible(false);
              setEditModalVisible(true);
            }}
          >
            ویرایش
          </Button>,
        ]}
        width={700}
      >
        {selectedUser && <UserDetail user={selectedUser} />}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="ویرایش کاربر"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedUser && (
          <UserForm 
            initialValues={selectedUser}
            onSubmit={(values) => handleFormSubmit(values, true)}
            onCancel={() => setEditModalVisible(false)}
            loading={actionLoading}
            isEdit={true}
          />
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal
        title="افزودن کاربر جدید"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={700}
      >
        <UserForm 
          onSubmit={(values) => handleFormSubmit(values, false)}
          onCancel={() => setAddModalVisible(false)}
          loading={actionLoading}
          isEdit={false}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        visible={deleteModalVisible}
        title="حذف کاربر"
        content={
          selectedUser 
            ? `آیا از حذف کاربر "${selectedUser.fullName}" اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`
            : 'آیا از حذف این کاربر اطمینان دارید؟'
        }
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        confirmLoading={actionLoading}
        type="error"
      />
    </div>
  );
}