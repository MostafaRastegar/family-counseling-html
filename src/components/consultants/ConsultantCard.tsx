'use client';

import Link from 'next/link';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Rate, Space, Tag, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ConsultantCard = ({ consultant }) => {
  return (
    <Card hoverable className="flex h-full flex-col">
      <div className="mb-4 flex items-center">
        <Avatar
          size={64}
          src={consultant.image}
          icon={!consultant.image && <UserOutlined />}
        />
        <div className="mr-4">
          <Title level={5} className="mb-1">
            {consultant.name}
          </Title>
          <Rate disabled defaultValue={consultant.rating} className="text-sm" />
        </div>
      </div>

      <div className="mb-3">
        {consultant.specialties.map((specialty, index) => (
          <Tag key={index} color="blue" className="mb-1 ml-1">
            {specialty}
          </Tag>
        ))}
      </div>

      <Paragraph className="mb-4 grow text-gray-600">
        {consultant.bio.length > 150
          ? `${consultant.bio.substring(0, 150)}...`
          : consultant.bio}
      </Paragraph>

      <div className="mt-auto">
        <Space>
          <Link href={`/dashboard/client/consultants/${consultant.id}`}>
            <Button type="primary">مشاهده پروفایل</Button>
          </Link>
          <Link
            href={`/dashboard/client/consultants/${consultant.id}?booking=true`}
          >
            <Button icon={<CalendarOutlined />}>رزرو جلسه</Button>
          </Link>
        </Space>
      </div>
    </Card>
  );
};

export default ConsultantCard;
