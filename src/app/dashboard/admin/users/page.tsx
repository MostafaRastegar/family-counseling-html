'use client';

import React, { useMemo, useState } from 'react';
import { Tag } from 'antd';
import DataTable from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import { UserActionsMenu } from './components/UserActionsMenu';
import { UserEditModal } from './components/UserEditModal';
import { useUserManagement } from './hooks/useUserManagement';
import { User } from './types/user.types';

export default function AdminUsers() {
  const { users, loading, updateUser, deleteUser, resetUserPassword } =
    useUserManagement();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const columns = useMemo(
    () => [
      {
        title: 'نام و نام خانوادگی',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: 'ایمیل',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'شماره تماس',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: 'نقش',
        dataIndex: 'role',
        key: 'role',
        render: (role) => {
          const roleMap = {
            admin: { color: 'purple', text: 'مدیر' },
            consultant: { color: 'green', text: 'مشاور' },
            client: { color: 'blue', text: 'مراجع' },
          };

          return <Tag color={roleMap[role]?.color}>{roleMap[role]?.text}</Tag>;
        },
      },
      {
        title: 'وضعیت',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          const statusMap = {
            active: { color: 'green', text: 'فعال' },
            inactive: { color: 'default', text: 'غیرفعال' },
            suspended: { color: 'red', text: 'تعلیق شده' },
          };

          return (
            <Tag color={statusMap[status]?.color}>
              {statusMap[status]?.text}
            </Tag>
          );
        },
      },
      {
        title: 'تاریخ ثبت‌نام',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
    ],
    [],
  );

  const filterOptions = [
    {
      key: 'role',
      label: 'نقش کاربر',
      type: 'select',
      options: [
        { value: 'admin', label: 'مدیر' },
        { value: 'consultant', label: 'مشاور' },
        { value: 'client', label: 'مراجع' },
      ],
    },
    {
      key: 'status',
      label: 'وضعیت',
      type: 'select',
      options: [
        { value: 'active', label: 'فعال' },
        { value: 'inactive', label: 'غیرفعال' },
        { value: 'suspended', label: 'تعلیق شده' },
      ],
    },
  ];

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditModalVisible(true);
  };

  const handleUpdateUser = (userData: any) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
    }
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="مدیریت کاربران"
        description="مدیریت تمامی کاربران سیستم"
      />

      <DataTable
        title="لیست کاربران"
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        filterOptions={filterOptions}
        searchPlaceholder="جستجو بر اساس نام، ایمیل یا شماره تماس"
        renderActions={(user) => (
          <UserActionsMenu
            user={user}
            onEdit={handleEditUser}
            onDelete={deleteUser}
            onResetPassword={resetUserPassword}
          />
        )}
        pagination={{ pageSize: 10 }}
      />

      <UserEditModal
        visible={editModalVisible}
        user={editingUser}
        onCancel={() => {
          setEditingUser(null);
          setEditModalVisible(false);
        }}
        onSubmit={handleUpdateUser}
      />
    </div>
  );
}
