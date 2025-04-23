import React from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import StatusBadge, { VerificationStatus } from '../ui/StatusBadge';

const { Title, Text } = Typography;

interface ProfileHeaderProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    role: 'admin' | 'consultant' | 'client';
    createdAt: string;
  };
  consultant?: {
    isVerified: boolean;
    rating?: number;
    reviewCount?: number;
    verificationStatus?: VerificationStatus;
  };
  onEdit?: () => void;
  onChangePassword?: () => void;
  onUploadImage?: () => void;
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  consultant,
  onEdit,
  onChangePassword,
  onUploadImage,
  className = '',
}) => {
  const { fullName, email, phoneNumber, profileImage, role, createdAt } = user;

  // تاریخ عضویت را به فرمت مناسب تبدیل می‌کنیم
  const formattedDate = new Date(createdAt).toLocaleDateString('fa-IR');

  // نام نقش را به فارسی نمایش می‌دهیم
  const getRoleName = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'مدیر سیستم';
      case 'consultant':
        return 'مشاور';
      case 'client':
        return 'مراجع';
      default:
        return 'کاربر';
    }
  };

  // رنگ متناسب با نقش را تعیین می‌کنیم
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'purple';
      case 'consultant':
        return 'blue';
      case 'client':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <Card className={`profile-header ${className}`}>
      <Row gutter={[24, 16]} align="middle">
        <Col xs={24} sm={6} md={4} className="text-center sm:text-right">
          <div className="relative inline-block">
            <Avatar
              size={100}
              src={profileImage}
              icon={!profileImage && <UserOutlined />}
              className="border-2 border-white shadow-md"
            />
            {onUploadImage && (
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                size="small"
                onClick={onUploadImage}
                className="absolute bottom-0 left-0"
              />
            )}
          </div>
        </Col>

        <Col xs={24} sm={18} md={20}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Title level={4} className="mb-0 ml-2">
              {fullName}
            </Title>
            <Tag color={getRoleColor(role)}>{getRoleName(role)}</Tag>
            {role === 'consultant' && consultant?.isVerified && (
              <Tag
                icon={<CheckCircleOutlined />}
                color="success"
                className="mr-0"
              >
                تایید شده
              </Tag>
            )}
            {role === 'consultant' && consultant?.verificationStatus && (
              <StatusBadge status={consultant.verificationStatus} />
            )}
          </div>

          <Row gutter={[16, 8]}>
            <Col xs={24} md={12}>
              <Space className="items-center">
                <MailOutlined className="text-gray-500" />
                <Text>{email}</Text>
              </Space>
            </Col>
            {phoneNumber && (
              <Col xs={24} md={12}>
                <Space className="items-center">
                  <PhoneOutlined className="text-gray-500" />
                  <Text dir="ltr">{phoneNumber}</Text>
                </Space>
              </Col>
            )}
            <Col xs={24} md={12}>
              <Space className="items-center">
                <CalendarOutlined className="text-gray-500" />
                <Text>تاریخ عضویت: {formattedDate}</Text>
              </Space>
            </Col>
            {role === 'consultant' && consultant?.rating && (
              <Col xs={24} md={12}>
                <Space className="items-center">
                  <StarOutlined className="text-yellow-500" />
                  <Text>
                    امتیاز: <strong>{consultant.rating}</strong> (
                    {consultant.reviewCount} نظر)
                  </Text>
                </Space>
              </Col>
            )}
          </Row>

          {(onEdit || onChangePassword) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {onEdit && (
                <Button
                  icon={<EditOutlined />}
                  onClick={onEdit}
                  type="primary"
                  ghost
                >
                  ویرایش پروفایل
                </Button>
              )}
              {onChangePassword && (
                <Button onClick={onChangePassword}>تغییر رمز عبور</Button>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default ProfileHeader;
