import React from 'react';
import { Avatar, Button, List, Tag, Tooltip, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
  createdAt: string;
}

interface LatestUsersProps {
  users: User[];
  loading?: boolean;
  onViewDetails?: (userId: string) => void;
}

const LatestUsers: React.FC<LatestUsersProps> = ({
  users = [],
  loading = false,
  onViewDetails,
}) => {
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

  // فرمت تاریخ عضویت
  const formatCreatedAt = (dateString: string) => {
    return dayjs(dateString).locale('fa').format('YYYY/MM/DD');
  };

  // رویداد کلیک روی کاربر
  const handleUserClick = (userId: string) => {
    if (onViewDetails) {
      onViewDetails(userId);
    }
  };

  return (
    <List
      loading={loading}
      dataSource={users}
      rowKey="id"
      locale={{ emptyText: 'کاربری یافت نشد' }}
      renderItem={(user) => {
        const roleDisplay = getUserRoleDisplay(user.role);
        
        return (
          <List.Item
            className="hover:bg-gray-50 cursor-pointer px-4 py-3 transition-colors"
            onClick={() => handleUserClick(user.id)}
            actions={[
              <Button key="view" type="link" size="small">
                مشاهده
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={user.profileImage}
                  icon={!user.profileImage && <UserOutlined />}
                />
              }
              title={
                <div className="flex items-center">
                  <span className="ml-2">{user.fullName}</span>
                  <Tag color={roleDisplay.color} className="mr-0">
                    {roleDisplay.text}
                  </Tag>
                </div>
              }
              description={
                <div>
                  <Text className="text-xs">{user.email}</Text>
                  <div className="text-xs text-gray-500">
                    تاریخ عضویت: {formatCreatedAt(user.createdAt)}
                  </div>
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default LatestUsers;