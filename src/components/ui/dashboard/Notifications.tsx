import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BellOutlined,
  CalendarOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Card, List, Space, Typography } from 'antd';

const { Text } = Typography;

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'session' | 'message' | 'review' | 'payment' | 'system' | 'profile';
  link?: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  loading?: boolean;
  maxItems?: number;
  showViewAll?: boolean;
  className?: string;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  loading = false,
  maxItems = 5,
  showViewAll = true,
  className = '',
}) => {
  const router = useRouter();

  // Get icon based on notification type and category
  const getNotificationIcon = (notification: Notification) => {
    // First determine icon based on category
    let icon;
    switch (notification.category) {
      case 'session':
        icon = <CalendarOutlined />;
        break;
      case 'message':
        icon = <CommentOutlined />;
        break;
      case 'review':
        icon = <CommentOutlined />;
        break;
      case 'payment':
        icon = <WalletOutlined />;
        break;
      case 'profile':
        icon = <UserOutlined />;
        break;
      case 'system':
      default:
        icon = <InfoCircleOutlined />;
    }

    // Set color based on type
    let color;
    switch (notification.type) {
      case 'info':
        color = 'bg-blue-100 text-blue-500';
        break;
      case 'success':
        color = 'bg-green-100 text-green-500';
        break;
      case 'warning':
        color = 'bg-yellow-100 text-yellow-500';
        break;
      case 'error':
        color = 'bg-red-100 text-red-500';
        break;
    }

    return <Avatar icon={icon} className={color} />;
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if needed
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }

    // Navigate if link exists
    if (notification.link) {
      router.push(notification.link);
    }
  };

  // Limit displayed notifications
  const displayedNotifications = notifications.slice(0, maxItems);
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <Space>
            <BellOutlined />
            <span>اعلان‌های اخیر</span>
            {hasUnread && (
              <Badge
                count={notifications.filter((n) => !n.read).length}
                style={{ backgroundColor: '#1890ff' }}
              />
            )}
          </Space>

          {hasUnread && onMarkAllAsRead && (
            <Button type="link" size="small" onClick={onMarkAllAsRead}>
              علامت‌گذاری همه به عنوان خوانده شده
            </Button>
          )}
        </div>
      }
      className={`notifications-card ${className}`}
      bodyStyle={{ padding: 0 }}
      extra={
        showViewAll && (
          <Button
            type="link"
            onClick={
              onViewAll || (() => router.push('/dashboard/notifications'))
            }
          >
            مشاهده همه
          </Button>
        )
      }
    >
      <List
        loading={loading}
        dataSource={displayedNotifications}
        renderItem={(notification) => (
          <List.Item
            className={`hover:bg-gray-50 cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <List.Item.Meta
              avatar={getNotificationIcon(notification)}
              title={
                <div className="flex items-center justify-between">
                  <Text strong>{notification.title}</Text>
                  {!notification.read && (
                    <Badge status="processing" color="blue" />
                  )}
                </div>
              }
              description={
                <div>
                  <div className="mb-1">{notification.message}</div>
                  <Text type="secondary" className="text-xs">
                    {notification.time}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'اعلان جدیدی وجود ندارد' }}
        footer={
          notifications.length > 0 && showViewAll ? (
            <div
              className="text-primary-500 hover:bg-gray-50 cursor-pointer py-2 text-center"
              onClick={
                onViewAll || (() => router.push('/dashboard/notifications'))
              }
            >
              مشاهده همه اعلان‌ها
            </div>
          ) : null
        }
      />
    </Card>
  );
};

export default Notifications;
