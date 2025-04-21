'use client';

import { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Form, Input, Modal, Select, Space, Tag, message } from 'antd';
import DataTable from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';

const { Option } = Select;

// داده‌های نمونه برای کاربران
const mockUsers = [
  {
    id: 1,
    fullName: 'علی محمدی',
    email: 'ali@example.com',
    role: 'consultant',
    phoneNumber: '09123456789',
    isVerified: true,
    status: 'active',
    createdAt: '1401/01/05',
  },
  {
    id: 2,
    fullName: 'سارا احمدی',
    email: 'sara@example.com',
    role: 'consultant',
    phoneNumber: '09123456788',
    isVerified: true,
    status: 'active',
    createdAt: '1401/01/10',
  },
  {
    id: 3,
    fullName: 'محمد حسینی',
    email: 'mohammad@example.com',
    role: 'client',
    phoneNumber: '09123456787',
    isVerified: true,
    status: 'active',
    createdAt: '1401/01/15',
  },
  {
    id: 4,
    fullName: 'فاطمه رضایی',
    email: 'fatemeh@example.com',
    role: 'client',
    phoneNumber: '09123456786',
    isVerified: true,
    status: 'active',
    createdAt: '1401/01/20',
  },
  {
    id: 5,
    fullName: 'رضا کریمی',
    email: 'reza@example.com',
    role: 'admin',
    phoneNumber: '09123456785',
    isVerified: true,
    status: 'active',
    createdAt: '1401/01/01',
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // ویرایش کاربر
  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
    });
    setEditModalVisible(true);
  };

  // بازنشانی رمز عبور
  const handleResetPassword = (user) => {
    setSelectedUser(user);
    passwordForm.resetFields();
    setResetPasswordModalVisible(true);
  };

  // حذف کاربر
  const handleDelete = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    message.success('کاربر با موفقیت حذف شد!');
  };

  // ذخیره تغییرات کاربر
  const handleSaveUser = (values) => {
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return { ...user, ...values };
      }
      return user;
    });

    setUsers(updatedUsers);
    setEditModalVisible(false);
    message.success('اطلاعات کاربر با موفقیت بروزرسانی شد!');
  };

  // بازنشانی رمز عبور
  const handleSavePassword = (values) => {
    console.log('Reset password for user:', selectedUser.id, values);
    setResetPasswordModalVisible(false);
    message.success('رمز عبور با موفقیت بازنشانی شد!');
  };

  // Define columns for DataTable
  const columns = [
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
        let color = 'blue';
        let text = 'مراجع';

        if (role === 'admin') {
          color = 'purple';
          text = 'مدیر';
        } else if (role === 'consultant') {
          color = 'green';
          text = 'مشاور';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        let text = 'فعال';

        if (status === 'inactive') {
          color = 'volcano';
          text = 'غیرفعال';
        } else if (status === 'suspended') {
          color = 'red';
          text = 'تعلیق شده';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'تاریخ ثبت‌نام',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  // Define row actions
  const rowActions = [
    {
      key: 'edit',
      label: 'ویرایش',
      icon: <EditOutlined />,
      onClick: handleEdit,
    },
    {
      key: 'resetPassword',
      label: 'بازنشانی رمز عبور',
      icon: <LockOutlined />,
      onClick: handleResetPassword,
    },
    {
      key: 'delete',
      label: 'حذف کاربر',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (user) => {
        Modal.confirm({
          title: 'آیا از حذف این کاربر مطمئن هستید؟',
          icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
          content: 'با حذف کاربر، تمامی اطلاعات مربوط به آن نیز حذف خواهد شد.',
          okText: 'بله',
          cancelText: 'خیر',
          onOk: () => handleDelete(user.id),
        });
      },
    },
  ];

  // Define filter options
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

  return (
    <div className="container mx-auto">
      <PageHeader
        title="مدیریت کاربران"
        description="مدیریت تمامی کاربران سیستم شامل مشاوران، مراجعان و مدیران."
      />

      <DataTable
        title="لیست کاربران"
        dataSource={users}
        columns={columns}
        rowKey="id"
        rowActions={rowActions}
        filterOptions={filterOptions}
        searchPlaceholder="جستجو بر اساس نام، ایمیل یا شماره تماس"
        loading={loading}
        onSearch={(value) => console.log('Search:', value)}
        onFilter={(filters) => console.log('Filters:', filters)}
        pagination={{ pageSize: 10 }}
      />

      {/* مودال ویرایش کاربر */}
      <Modal
        title="ویرایش اطلاعات کاربر"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="ذخیره تغییرات"
        cancelText="انصراف"
      >
        <Form form={form} layout="vertical" onFinish={handleSaveUser}>
          <Form.Item
            name="fullName"
            label="نام و نام خانوادگی"
            rules={[
              { required: true, message: 'لطفاً نام کاربر را وارد کنید' },
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="ایمیل"
            rules={[
              { required: true, message: 'لطفاً ایمیل کاربر را وارد کنید' },
              { type: 'email', message: 'ایمیل وارد شده معتبر نیست' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phoneNumber" label="شماره تماس">
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="نقش"
            rules={[
              { required: true, message: 'لطفاً نقش کاربر را انتخاب کنید' },
            ]}
          >
            <Select>
              <Option value="admin">مدیر</Option>
              <Option value="consultant">مشاور</Option>
              <Option value="client">مراجع</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="وضعیت"
            rules={[
              { required: true, message: 'لطفاً وضعیت کاربر را انتخاب کنید' },
            ]}
          >
            <Select>
              <Option value="active">فعال</Option>
              <Option value="inactive">غیرفعال</Option>
              <Option value="suspended">تعلیق شده</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* مودال بازنشانی رمز عبور */}
      <Modal
        title="بازنشانی رمز عبور"
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        onOk={() => passwordForm.submit()}
        okText="بازنشانی رمز عبور"
        cancelText="انصراف"
      >
        <div className="mb-4">
          <Space direction="vertical">
            <span>در حال بازنشانی رمز عبور برای:</span>
            <strong>
              {selectedUser?.fullName} ({selectedUser?.email})
            </strong>
          </Space>
        </div>

        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleSavePassword}
        >
          <Form.Item
            name="password"
            label="رمز عبور جدید"
            rules={[
              { required: true, message: 'لطفاً رمز عبور جدید را وارد کنید' },
              { min: 6, message: 'رمز عبور باید حداقل 6 کاراکتر باشد' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="تکرار رمز عبور جدید"
            dependencies={['password']}
            rules={[
              { required: true, message: 'لطفاً تکرار رمز عبور را وارد کنید' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('رمز عبور و تکرار آن مطابقت ندارند'),
                  );
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <div className="bg-yellow-50 mb-4 rounded p-4">
            <Space>
              <ExclamationCircleOutlined className="text-yellow-500" />
              <span>توجه: این عملیات رمز عبور کاربر را تغییر خواهد داد.</span>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
