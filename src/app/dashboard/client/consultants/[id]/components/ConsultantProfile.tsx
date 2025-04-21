import React from 'react';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Descriptions, Rate, Tag, Typography } from 'antd';
import { Consultant } from '../types/consultant.types';

const { Title, Paragraph } = Typography;

interface ConsultantProfileProps {
  consultant: Consultant;
}

export const ConsultantProfile: React.FC<ConsultantProfileProps> = ({
  consultant,
}) => {
  return (
    <div className="consultant-profile">
      <div className="profile-header mb-6 flex items-center">
        <Avatar
          size={80}
          src={consultant.image}
          icon={!consultant.image && <UserOutlined />}
          className="ml-4"
        />
        <div>
          <Title level={4} className="mb-2">
            {consultant.name}
          </Title>
          <div className="flex items-center">
            {consultant.specialties.map((specialty) => (
              <Tag key={specialty} color="blue" className="ml-2">
                {specialty}
              </Tag>
            ))}
            {consultant.isVerified && (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                مشاور تأیید شده
              </Tag>
            )}
          </div>
        </div>
      </div>

      <Descriptions title="اطلاعات شخصی" bordered column={1}>
        <Descriptions.Item label="شرح حال">{consultant.bio}</Descriptions.Item>
        <Descriptions.Item label="تحصیلات و سوابق">
          {consultant.education}
        </Descriptions.Item>
        <Descriptions.Item label="امتیاز">
          <div className="flex items-center">
            <Rate disabled defaultValue={consultant.rating} className="ml-2" />
            <Paragraph>
              {consultant.rating} از 5 ({consultant.reviewCount} نظر)
            </Paragraph>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
