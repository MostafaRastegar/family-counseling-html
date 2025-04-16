'use client';

import { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  MoreOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;
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
  const [searchText, setSearchText] = useState('');
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

  // فیلتر کردن کاربران
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phoneNumber.includes(searchText),
  );

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

  // ستون‌های جدول
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
    {
      title: 'عملیات',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                ویرایش
              </Menu.Item>
              <Menu.Item
                key="resetPassword"
                icon={<LockOutlined />}
                onClick={() => handleResetPassword(record)}
              >
                بازنشانی رمز عبور
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
                <Popconfirm
                  title="آیا از حذف این کاربر مطمئن هستید؟"
                  onConfirm={() => handleDelete(record.id)}
                  okText="بله"
                  cancelText="خیر"
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                >
                  حذف کاربر
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="container mx-auto">
      <Title level={2}>مدیریت کاربران</Title>
      <Paragraph className="mb-8 text-gray-500">
        مدیریت تمامی کاربران سیستم شامل مشاوران، مراجعان و مدیران.
      </Paragraph>

      <Card>
        {/* ابزار جستجو */}
        <div className="mb-6">
          <Input
            placeholder="جستجو بر اساس نام، ایمیل یا شماره تماس"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </div>

        {/* جدول کاربران */}
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} از ${total} کاربر`,
          }}
        />
      </Card>

      {/* مودال ویرایش کاربر */}
      <Modal
        title="ویرایش اطلاعات کاربر"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
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

          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setEditModalVisible(false)}>انصراف</Button>
              <Button type="primary" htmlType="submit">
                ذخیره تغییرات
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* مودال بازنشانی رمز عبور */}
      <Modal
        title="بازنشانی رمز عبور"
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        footer={null}
      >
        <div className="mb-4">
          <Text>در حال بازنشانی رمز عبور برای:</Text>
          <div className="mt-1 font-bold">
            {selectedUser?.fullName} ({selectedUser?.email})
          </div>
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
            <Text type="warning">
              <ExclamationCircleOutlined className="mr-2" />
              توجه: این عملیات رمز عبور کاربر را تغییر خواهد داد.
            </Text>
          </div>

          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setResetPasswordModalVisible(false)}>
                انصراف
              </Button>
              <Button type="primary" htmlType="submit">
                بازنشانی رمز عبور
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
