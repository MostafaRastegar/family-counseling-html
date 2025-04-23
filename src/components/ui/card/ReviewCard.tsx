import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Rate, Typography } from 'antd';
import dayjs from 'dayjs';
import BaseCard from './BaseCard';

const { Text, Paragraph } = Typography;

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  client: {
    id: string;
    user: {
      fullName: string;
      profileImage?: string;
    };
  };
  consultant?: {
    id: string;
    user: {
      fullName: string;
    };
  };
}

interface ReviewCardProps {
  review: ReviewData;
  loading?: boolean;
  error?: string;
  showConsultant?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  loading = false,
  error,
  showConsultant = false,
}) => {
  if (loading || error) {
    return <BaseCard loading={loading} error={error} />;
  }

  const { rating, comment, createdAt, client, consultant } = review;

  // Format date
  const formattedDate = dayjs(createdAt).format('YYYY/MM/DD');

  return (
    <BaseCard className="review-card">
      <div className="flex items-start">
        <Avatar
          src={client.user.profileImage}
          icon={!client.user.profileImage && <UserOutlined />}
          alt={client.user.fullName}
          className="ml-3 mr-0"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Text strong>{client.user.fullName}</Text>
            <Text type="secondary" className="text-xs">
              {formattedDate}
            </Text>
          </div>

          <Rate disabled defaultValue={rating} className="my-2 text-sm" />

          <Paragraph className="mb-0 text-gray-600">{comment}</Paragraph>

          {showConsultant && consultant && (
            <>
              <Divider className="my-3" />
              <div className="flex items-center">
                <Text type="secondary" className="text-sm">
                  نظر درباره:
                </Text>
                <Text strong className="mr-2">
                  {consultant.user.fullName}
                </Text>
              </div>
            </>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default ReviewCard;
