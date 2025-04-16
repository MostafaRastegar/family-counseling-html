'use client';

import Link from 'next/link';
import {
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, List, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const ActivityFeed = ({ activities, title }) => {
  // تعیین آیکون بر اساس نوع فعالیت
  const getActivityIcon = (type) => {
    switch (type) {
      case 'session':
        return <CalendarOutlined style={{ color: '#1890ff' }} />;
      case 'review':
        return <CommentOutlined style={{ color: '#52c41a' }} />;
      case 'notification':
        return <BellOutlined style={{ color: '#faad14' }} />;
      case 'user':
        return <UserOutlined style={{ color: '#722ed1' }} />;
      default:
        return <BellOutlined />;
    }
  };

  // تعیین رنگ تگ وضعیت
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'blue';
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  // تبدیل وضعیت به متن فارسی
  const getStatusText = (status) => {
    switch (status) {
      case 'new':
        return 'جدید';
      case 'confirmed':
        return 'تأیید شده';
      case 'pending':
        return 'در انتظار تأیید';
      case 'completed':
        return 'انجام شده';
      case 'cancelled':
        return 'لغو شده';
      default:
        return status;
    }
  };

  // تبدیل زمان به فرمت نسبی
  const getRelativeTime = (time) => {
    return dayjs(time).fromNow();
  };

  return (
    <Card
      title={title || 'فعالیت‌های اخیر'}
      className="mb-6"
      extra={
        activities.length > 0 && (
          <Link href="/dashboard/activities">
            <Button type="link" size="small">
              مشاهده همه
            </Button>
          </Link>
        )
      }
    >
      {activities.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={activities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={getActivityIcon(item.type)}
                    className="bg-gray-100"
                  />
                }
                title={
                  <Space>
                    <Text>{item.title}</Text>
                    {item.status && (
                      <Tag color={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Tag>
                    )}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={2}>
                    {item.description && <Text>{item.description}</Text>}
                    <Text type="secondary">
                      <ClockCircleOutlined className="mr-1" />
                      {item.time ? getRelativeTime(item.time) : item.time}
                    </Text>
                  </Space>
                }
              />
              {item.action && (
                <div>
                  <Button type="link" size="small" href={item.action.link}>
                    {item.action.text}
                  </Button>
                </div>
              )}
            </List.Item>
          )}
        />
      ) : (
        <div className="py-6 text-center">
          <Text type="secondary">هیچ فعالیتی یافت نشد</Text>
        </div>
      )}
    </Card>
  );
};

export default ActivityFeed;
