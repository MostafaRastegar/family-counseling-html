import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  DatePicker, 
  Input, 
  Select, 
  Space, 
  Table, 
  Tag, 
  Tooltip 
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  CalendarOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import StatusBadge from '@/components/ui/StatusBadge';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Session {
  id: string;
  consultantId: string;
  clientId: string;
  consultant: {
    id: string;
    user: {
      id: string;
      fullName: string;
      profileImage?: string;
    };
  };
  client: {
    id: string;
    user: {
      id: string;
      fullName: string;
      profileImage?: string;
    };
  };
  date: string;
  status: string;
  notes?: string;
  messengerId?: string;
  messengerType?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminSessionsTableProps {
  sessions: Session[];
  loading?: boolean;
  onView?: (sessionId: string) => void;
  onEdit?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
}

const AdminSessionsTable: React.FC<AdminSessionsTableProps> = ({
  sessions = [],
  loading = false,
  onView,
  onEdit,
  onCancel
}) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  
  // فیلتر کردن جلسات
  const getFilteredSessions = () => {
    return sessions.filter(session => {
      // فیلتر متن جستجو
      const searchLower = searchText.toLowerCase();
      const matchesSearch = searchText 
        ? session.consultant.user.fullName.toLowerCase().includes(searchLower) ||
          session.client.user.fullName.toLowerCase().includes(searchLower) ||
          (session.notes && session.notes.toLowerCase().includes(searchLower))
        : true;
      
      // فیلتر وضعیت
      const matchesStatus = statusFilter 
        ? session.status === statusFilter
        : true;
      
      // فیلتر بازه تاریخ
      const matchesDateRange = dateRange 
        ? dayjs(session.date).isAfter(dateRange[0], 'day') && 
          dayjs(session.date).isBefore(dateRange[1], 'day')
        : true;
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });
  };

  // تبدیل تاریخ به فرمت فارسی
  const formatDate = (dateString: string) => {
    return dayjs(dateString).locale('fa').format('YYYY/MM/DD HH:mm');
  };

  // تبدیل تاریخ به فرمت نسبی (مثلا "۳ ساعت پیش")
  const formatRelativeDate = (dateString: string) => {
    const now = dayjs();
    const date = dayjs(dateString);
    const diffHours = now.diff(date, 'hour');
    
    if (diffHours < 24) {
      return `${diffHours} ساعت پیش`;
    } else {
      const diffDays = now.diff(date, 'day');
      return `${diffDays} روز پیش`;
    }
  };

  // تعریف ستون‌های جدول
  const columns: ColumnsType<Session> = [
    {
      title: 'مشاور',
      dataIndex: ['consultant', 'user', 'fullName'],
      key: 'consultant',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            src={record.consultant.user.profileImage} 
            icon={!record.consultant.user.profileImage && <UserOutlined />}
            className="mr-2"
          />
          <div>
            {record.consultant.user.fullName}
          </div>
        </div>
      ),
      sorter: (a, b) => a.consultant.user.fullName.localeCompare(b.consultant.user.fullName),
    },
    {
      title: 'مراجع',
      dataIndex: ['client', 'user', 'fullName'],
      key: 'client',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            src={record.client.user.profileImage} 
            icon={!record.client.user.profileImage && <UserOutlined />}
            className="mr-2"
          />
          <div>
            {record.client.user.fullName}
          </div>
        </div>
      ),
      sorter: (a, b) => a.client.user.fullName.localeCompare(b.client.user.fullName),
    },
    {
      title: 'تاریخ و زمان',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <div>
          <div className="font-medium">{formatDate(date)}</div>
          <div className="text-xs text-gray-500">
            <CalendarOutlined className="mr-1" />
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
      filters: [
        { text: 'در انتظار تایید', value: 'pending' },
        { text: 'تایید شده', value: 'confirmed' },
        { text: 'انجام شده', value: 'completed' },
        { text: 'لغو شده', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'نوع ارتباط',
      dataIndex: 'messengerType',
      key: 'messengerType',
      render: (messengerType) => (
        messengerType ? (
          <Tag>
            {messengerType === 'telegram' 
              ? 'تلگرام' 
              : messengerType === 'whatsapp' 
                ? 'واتساپ' 
                : messengerType === 'phone' 
                  ? 'تماس تلفنی' 
                  : messengerType}
          </Tag>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
      responsive: ['lg'],
    },
    {
      title: 'زمان ایجاد',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => (
        <Tooltip title={formatDate(createdAt)}>
          {formatRelativeDate(createdAt)}
        </Tooltip>
      ),
      responsive: ['lg'],
    },
    {
      title: 'عملیات',
      key: 'action',
      fixed: 'right',
      width: 150,
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
          {onEdit && record.status !== 'completed' && record.status !== 'cancelled' && (
            <Tooltip title="ویرایش">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => onEdit(record.id)} 
              />
            </Tooltip>
          )}
          {onCancel && record.status !== 'completed' && record.status !== 'cancelled' && (
            <Tooltip title="لغو جلسه">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => onCancel(record.id)} 
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const filteredSessions = getFilteredSessions();

  // هندلر تغییر بازه تاریخ
  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  return (
    <div className="admin-sessions-table">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Search
            placeholder="جستجوی نام مشاور یا مراجع"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder="وضعیت جلسه"
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="pending">در انتظار تایید</Option>
            <Option value="confirmed">تایید شده</Option>
            <Option value="completed">انجام شده</Option>
            <Option value="cancelled">لغو شده</Option>
          </Select>
          
          <RangePicker 
            onChange={handleDateRangeChange}
            placeholder={['تاریخ شروع', 'تاریخ پایان']}
          />
        </div>
        
        <div className="text-gray-500 text-sm">
          {filteredSessions.length} جلسه از {sessions.length}
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredSessions}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          defaultPageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} از ${total} جلسه`,
        }}
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default AdminSessionsTable;