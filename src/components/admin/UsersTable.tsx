import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Table, 
  Space, 
  Tag, 
  Dropdown, 
  Menu, 
  Avatar, 
  Tooltip,
  Select
} from 'antd';
import { 
  DeleteOutlined, 
  EditOutlined, 
  EllipsisOutlined, 
  EyeOutlined,
  UserOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  onView?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users = [],
  loading = false,
  onView,
  onEdit,
  onDelete
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredRole, setFilteredRole] = useState<string | null>(null);
  
  // تبدیل نقش کاربر به فارسی و رنگ متناسب
  const getUserRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return { text: 'مدیر سیستم', color: 'purple' };
      case 'consultant':
        return { text: 'مشاور', color: 'blue' };
      case 'client':
        return { text: 'مراجع', color: 'green' };
      default:
        return { text: 'کاربر', color: 'default' };
    }
  };

  // فیلتر کردن کاربران بر اساس متن جستجو و نقش
  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = searchText 
        ? user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          (user.phoneNumber && user.phoneNumber.includes(searchText))
        : true;
        
      const matchesRole = filteredRole 
        ? user.role === filteredRole
        : true;
        
      return matchesSearch && matchesRole;
    });
  };

  // تبدیل تاریخ به فرمت فارسی
  const formatDate = (dateString: string) => {
    return dayjs(dateString).locale('fa').format('YYYY/MM/DD');
  };

  // تعریف ستون‌های جدول
  const columns: ColumnsType<User> = [
    {
      title: 'کاربر',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            src={record.profileImage} 
            icon={!record.profileImage && <UserOutlined />}
            className="mr-2"
          />
          <div>
            <div>{record.fullName}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'نقش',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleDisplay = getUserRoleDisplay(role);
        return <Tag color={roleDisplay.color}>{roleDisplay.text}</Tag>;
      },
      filters: [
        { text: 'مدیر سیستم', value: 'admin' },
        { text: 'مشاور', value: 'consultant' },
        { text: 'مراجع', value: 'client' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'شماره تماس',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phoneNumber) => phoneNumber || '-',
    },
    {
      title: 'تاریخ عضویت',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'آخرین به‌روزرسانی',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      responsive: ['md'],
    },
    {
      title: 'عملیات',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {onView && (
            <Tooltip title="مشاهده">
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => onView(record.id)} 
              />
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="ویرایش">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => onEdit(record.id)} 
              />
            </Tooltip>
          )}
          {onDelete && record.role !== 'admin' && (
            <Tooltip title="حذف">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => onDelete(record.id)} 
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const filteredUsers = getFilteredUsers();

  return (
    <div className="users-table">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Search
            placeholder="جستجوی نام، ایمیل یا شماره تماس"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder="فیلتر نقش کاربر"
            allowClear
            value={filteredRole}
            onChange={setFilteredRole}
            style={{ width: 150 }}
          >
            <Option value="admin">مدیر سیستم</Option>
            <Option value="consultant">مشاور</Option>
            <Option value="client">مراجع</Option>
          </Select>
        </div>
        
        <div className="text-gray-500 text-sm">
          {filteredUsers.length} کاربر از {users.length}
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          defaultPageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} از ${total} کاربر`,
        }}
      />
    </div>
  );
};

export default UsersTable;