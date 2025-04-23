import React from 'react';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Rate, Space, Tag, Typography } from 'antd';
import BaseCard from './BaseCard';

const { Title, Text, Paragraph } = Typography;

interface ConsultantCardProps {
  consultant: {
    id: string;
    specialties: string[];
    bio: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    user: {
      fullName: string;
      profileImage?: string;
    };
  };
  loading?: boolean;
  error?: string;
  onBookAppointment?: (consultantId: string) => void;
  onViewProfile?: (consultantId: string) => void;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({
  consultant,
  loading = false,
  error,
  onBookAppointment,
  onViewProfile,
}) => {
  if (loading || error) {
    return <BaseCard loading={loading} error={error} />;
  }

  const { id, specialties, bio, rating, reviewCount, isVerified, user } =
    consultant;

  // Extract first 150 characters from bio
  const truncatedBio = bio.length > 150 ? `${bio.slice(0, 150)}...` : bio;

  return (
    <BaseCard
      hoverable
      cover={
        <div className="relative flex h-40 items-center justify-center bg-gray-100">
          <Avatar
            src={user.profileImage}
            icon={!user.profileImage && <UserOutlined />}
            className="size-24"
            alt={user.fullName}
          />
          {isVerified && (
            <Tag color="green" className="absolute left-2 top-2">
              مشاور تایید شده
            </Tag>
          )}
        </div>
      }
      actions={[
        <Button key="view" type="link" onClick={() => onViewProfile?.(id)}>
          مشاهده پروفایل
        </Button>,
        <Button
          key="book"
          type="primary"
          icon={<CalendarOutlined />}
          onClick={() => onBookAppointment?.(id)}
        >
          رزرو وقت
        </Button>,
      ]}
    >
      <Title level={4} className="mb-2">
        {user.fullName}
      </Title>

      <div className="mb-3 flex items-center">
        <Rate disabled defaultValue={rating} className="text-sm" />
        <Text className="mr-2 text-gray-500">({reviewCount} نظر)</Text>
      </div>

      <div className="mb-3">
        <Space size={[0, 4]} wrap>
          {specialties.slice(0, 3).map((specialty, index) => (
            <Tag key={index} className="mb-1">
              {specialty}
            </Tag>
          ))}
          {specialties.length > 3 && (
            <Tag className="mb-1">+{specialties.length - 3}</Tag>
          )}
        </Space>
      </div>

      <Paragraph className="mb-0 text-gray-600">{truncatedBio}</Paragraph>
    </BaseCard>
  );
};

export default ConsultantCard;
