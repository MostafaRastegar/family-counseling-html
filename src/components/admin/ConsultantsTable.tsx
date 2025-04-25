import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Table, 
  Space, 
  Tag, 
  Tooltip, 
  Avatar,
  Select,
  Badge
} from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  EyeOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

interface Consultant {
  id: string;
  userId: string;
  specialties: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  consultantLicense: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
    phoneNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ConsultantsTableProps {
  consultants: Consultant[];
  loading?: boolean;
  onView?: (consultantId: string) => void;
  onEdit?: (consultantId: string) => void;
  onDelete?: (consultantId: string) => void;
  onApprove?: (consultantId: string) => void;
  onReject?: (consultantId: string) => void;
}

const ConsultantsTable: React.FC<ConsultantsTableProps> = ({
  consultants = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject
}) => {
  const [searchText, setSearchText] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<boolean | null>(null);
  
  // فیلتر کردن مشاوران بر اساس متن جستجو و وضعیت تایید
  const getFilteredConsultants = () => {
    return consultants.filter(consultant => {
      const matchesSearch = searchText 
        ? consultant.user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          consultant.user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          (consultant.user.phoneNumber && consultant.user.phoneNumber.includes(searchText)) ||
          consultant.consultantLicense.includes(searchText) ||
          consultant.specialties.some(s => s.toLowerCase().includes(searchText.toLowerCase()))
        : true;
        
      const matchesVerification = verificationFilter !== null
        ? consultant.isVerified === verificationFilter
        : true;
        
      return matchesSearch && matchesVerification;
    });
  };

  // تبدیل تاریخ به فرمت فارسی
  const formatDate = (dateString: string) => {
    return dayjs(dateString).locale('fa').format('YYYY/MM/DD');
  };

  // تعریف ستون‌های جدول
  const columns: ColumnsType<Consultant> = [
    {
      title: 'مشاور',
      dataIndex: ['user', 'fullName'],
      key: 'fullName',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            src={record.user.profileImage} 
            icon={!record.user.profileImage && <UserOutlined />}
            className="mr-2"
          />
          <div>
            <div>{record.user.fullName}</div>
            <div className="text-xs text-gray-500">{record.user.email}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.user.fullName.localeCompare(b.user.fullName),
    },
    {
      title: 'وضعیت',
      dataIndex: 'isVerified',
      key: 'verification',
      render: (isVerified) => (
        isVerified ? (
          <Tag color="success" icon={<CheckOutlined />}>
            تایید شده
          </Tag>
        ) : (
          <Tag color="warning" icon={<CloseOutlined />}>
            در انتظار تایید
          </Tag>
        )
      ),
      filters: [
        { text: 'تایید شده', value: true },
        { text: 'در انتظار تایید', value: false },
      ],
      onFilter: (value, record) => record.isVerified === value,
    },
    {
      title: 'شماره پروانه',
      dataIndex: 'consultantLicense',
      key: 'license',
    },
    {
      title: 'امتیاز',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating, record) => (
        <span>
          {rating} <small>({record.reviewCount} نظر)</small>
        </span>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'تخصص‌ها',
      dataIndex: 'specialties',
      key: 'specialties',
      render: (specialties) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {specialties.slice(0, 2).map(specialty => (
            <Tag key={specialty} className="my-1">
              {specialty}
            </Tag>
          ))}
          {specialties.length > 2 && (
            <Tooltip 
              title={
                <div>
                  {specialties.slice(2).map(specialty => (
                    <div key={specialty}>{specialty}</div>
                  ))}
                </div>
              }
            >
              <Tag className="my-1">+{specialties.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'تاریخ ثبت‌نام',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      responsive: ['lg'],
    },
    {
      title: 'عملیات',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {!record.isVerified && onApprove && (
            <Tooltip title="تایید مشاور">
              <Button 
                type="text" 
                icon={<CheckOutlined style={{ color: '#52c41a' }} />} 
                onClick={() => onApprove(record.id)} 
              />
            </Tooltip>
          )}
          {!record.isVerified && onReject && (
            <Tooltip title="رد درخواست">
              <Button 
                type="text" 
                danger
                icon={<CloseOutlined />} 
                onClick={() => onReject(record.id)} 
              />
            </Tooltip>
          )}
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
          {onDelete && (
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

  const filteredConsultants = getFilteredConsultants();

  return (
    <div className="consultants-table">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Search
            placeholder="جستجوی نام، ایمیل، شماره پروانه یا تخصص"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          
          <Select
            placeholder="وضعیت تایید"
            allowClear
            value={verificationFilter}
            onChange={setVerificationFilter}
            style={{ width: 150 }}
          >
            <Option value={true}>تایید شده</Option>
            <Option value={false}>در انتظار تایید</Option>
          </Select>
        </div>
        
        <div className="text-gray-500 text-sm">
          {filteredConsultants.length} مشاور از {consultants.length}
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredConsultants}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          defaultPageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} از ${total} مشاور`,
        }}
      />
    </div>
  );
};

export default ConsultantsTable;