'use client';

import React, { ReactNode } from 'react';
import { Timeline, Card, Typography, Tag, Button, Avatar, Space, Empty, Badge, Spin } from 'antd';
import { TimelineItemProps } from 'antd/es/timeline/TimelineItem';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  UserOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  FileOutlined,
  CalendarOutlined,
  CommentOutlined,
  StarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Enable relative time formatting
dayjs.extend(relativeTime);

const { Text, Title, Paragraph } = Typography;

export type ActivityType = 
  | 'info' 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'default'
  | 'pending'
  | 'user'
  | 'session'
  | 'notification'
  | 'message'
  | 'comment'
  | 'review'
  | 'calendar'
  | 'file'
  | 'system'
  | string;

export interface ActivityAction {
  key: string;
  text: string;
  onClick: () => void;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface ActivityItem {
  id: string | number;
  title: string | ReactNode;
  description?: string | ReactNode;
  time: string | Date;
  type?: ActivityType;
  status?: string;
  icon?: ReactNode;
  color?: string;
  user?: {
    name: string;
    avatar?: string;
    id?: string | number;
  };
  actions?: ActivityAction[];
  tags?: string[];
  link?: string;
  read?: boolean;
  content?: string | ReactNode;
  footer?: ReactNode;
  data?: any; // Additional data for custom rendering
}

export interface ActivityTimelineProps {
  activities: ActivityItem[];
  loading?: boolean;
  title?: string | ReactNode;
  emptyText?: string | ReactNode;
  showHeader?: boolean;
  className?: string;
  mode?: 'left' | 'alternate' | 'right';
  pending?: boolean | ReactNode;
  reverse?: boolean;
  card?: boolean;
  cardProps?: {
    title?: string | ReactNode;
    extra?: ReactNode;
    className?: string;
    bodyStyle?: React.CSSProperties;
  };
  timeFormat?: string;
  relative?: boolean;
  dateFormat?: string;
  itemClassName?: string;
  renderItem?: (item: ActivityItem) => ReactNode;
  limit?: number;
  renderEmpty?: () => ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  showLoadMore?: boolean;
  loadMoreText?: string;
  groupByDate?: boolean;
  maxDescriptionLines?: number;
  showUserAvatar?: boolean;
  showContent?: boolean;
  showTime?: boolean;
  showActions?: boolean;
  showTags?: boolean;
  dense?: boolean;
  colorMap?: Record<ActivityType, string>;
  iconMap?: Record<ActivityType, ReactNode>;
  onItemClick?: (item: ActivityItem) => void;
}

/**
 * ActivityTimeline - A component for displaying timeline of activities
 * 
 * This component displays a chronological list of activities or events,
 * with customizable appearance and behavior.
 */
const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities = [],
  loading = false,
  title,
  emptyText = 'هیچ فعالیتی یافت نشد',
  showHeader = true,
  className = '',
  mode = 'left',
  pending = false,
  reverse = false,
  card = true,
  cardProps = {},
  timeFormat = 'HH:mm',
  relative = true,
  dateFormat = 'YYYY/MM/DD',
  itemClassName = '',
  renderItem,
  limit,
  renderEmpty,
  onLoadMore,
  hasMore = false,
  showLoadMore = false,
  loadMoreText = 'نمایش بیشتر',
  groupByDate = false,
  maxDescriptionLines = 2,
  showUserAvatar = true,
  showContent = true,
  showTime = true,
  showActions = true,
  showTags = true,
  dense = false,
  colorMap,
  iconMap,
  onItemClick,
}) => {
  // Default color mapping for different activity types
  const defaultColorMap: Record<ActivityType, string> = {
    info: '#1890ff',
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    default: '#8c8c8c',
    pending: '#1890ff',
    user: '#722ed1',
    session: '#13c2c2',
    notification: '#fa8c16',
    message: '#1890ff',
    comment: '#eb2f96',
    review: '#fa8c16',
    calendar: '#13c2c2',
    file: '#1890ff',
    system: '#8c8c8c',
  };

  // Default icon mapping for different activity types
  const defaultIconMap: Record<ActivityType, ReactNode> = {
    info: <InfoCircleOutlined />,
    success: <CheckCircleOutlined />,
    error: <CloseCircleOutlined />,
    warning: <WarningOutlined />,
    default: <InfoCircleOutlined />,
    pending: <LoadingOutlined />,
    user: <UserOutlined />,
    session: <CalendarOutlined />,
    notification: <BellOutlined />,
    message: <CommentOutlined />,
    comment: <CommentOutlined />,
    review: <StarOutlined />,
    calendar: <CalendarOutlined />,
    file: <FileOutlined />,
    system: <ExclamationCircleOutlined />,
  };

  // Merge custom color and icon maps with defaults
  const mergedColorMap = { ...defaultColorMap, ...colorMap };
  const mergedIconMap = { ...defaultIconMap, ...iconMap };

  // Format the time for display
  const formatTime = (time: string | Date, isRelative: boolean = relative): string => {
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    
    if (isRelative) {
      return dayjs(timeObj).fromNow();
    }
    
    return dayjs(timeObj).format(timeFormat);
  };

  // Format the date for display
  const formatDate = (time: string | Date): string => {
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    return dayjs(timeObj).format(dateFormat);
  };

  // Group activities by date if needed
  const getGroupedActivities = () => {
    if (!groupByDate) {
      return { 
        items: limit ? activities.slice(0, limit) : activities, 
        groups: [] 
      };
    }
    
    const groups: { date: string; items: ActivityItem[] }[] = [];
    const dateMap: Record<string, ActivityItem[]> = {};
    
    // Group by date
    activities.forEach(activity => {
      const date = formatDate(activity.time);
      if (!dateMap[date]) {
        dateMap[date] = [];
      }
      dateMap[date].push(activity);
    });
    
    // Convert to array and sort by date (newest first)
    Object.keys(dateMap).forEach(date => {
      groups.push({
        date,
        items: dateMap[date],
      });
    });
    
    // Sort groups by date (newest first)
    groups.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Apply limit if needed
    if (limit) {
      let count = 0;
      const limitedGroups = [];
      
      for (const group of groups) {
        if (count >= limit) break;
        
        const remainingItems = limit - count;
        const limitedItems = group.items.slice(0, remainingItems);
        
        limitedGroups.push({
          date: group.date,
          items: limitedItems,
        });
        
        count += limitedItems.length;
      }
      
      return { items: [], groups: limitedGroups };
    }
    
    return { items: [], groups };
  };

  // Get the color for an activity type
  const getActivityColor = (type: ActivityType = 'default'): string => {
    return mergedColorMap[type] || mergedColorMap.default;
  };

  // Get the icon for an activity type
  const getActivityIcon = (item: ActivityItem): ReactNode => {
    if (item.icon) {
      return item.icon;
    }
    
    const type = item.type || 'default';
    return mergedIconMap[type] || mergedIconMap.default;
  };

  // Render an activity item
  const renderActivityItem = (item: ActivityItem): ReactNode => {
    // If a custom renderer is provided, use it
    if (renderItem) {
      return renderItem(item);
    }

    // Status dot color
    const dotColor = item.color || getActivityColor(item.type);
    
    // Status label if present
    const statusLabel = item.status && (
      <Tag color={dotColor}>{item.status}</Tag>
    );
    
    // User avatar if applicable
    const userAvatar = showUserAvatar && item.user && (
      <Space className="activity-user">
        <Avatar
          size="small"
          src={item.user.avatar}
          icon={!item.user.avatar && <UserOutlined />}
        />
        <Text strong>{item.user.name}</Text>
      </Space>
    );
    
    // Timestamp display
    const timeDisplay = showTime && (
      <Text type="secondary" className="activity-time">
        <ClockCircleOutlined className="mr-1" />
        {formatTime(item.time)}
      </Text>
    );
    
    // Tags if present
    const tagsDisplay = showTags && item.tags && item.tags.length > 0 && (
      <div className="activity-tags mt-1">
        {item.tags.map((tag, index) => (
          <Tag key={index} className="mr-1 mb-1">{tag}</Tag>
        ))}
      </div>
    );
    
    // Actions if present
    const actionsDisplay = showActions && item.actions && item.actions.length > 0 && (
      <div className="activity-actions mt-2">
        <Space>
          {item.actions.map(action => (
            <Button
              key={action.key}
              type={action.type || 'default'}
              size="small"
              onClick={action.onClick}
              icon={action.icon}
              danger={action.danger}
              disabled={action.disabled}
            >
              {action.text}
            </Button>
          ))}
        </Space>
      </div>
    );
    
    // Main content
    const mainContent = (
      <div className={`activity-content ${dense ? 'py-1' : ''}`}>
        <div className="activity-header flex items-center justify-between">
          <div className="activity-title-container">
            {userAvatar && <div className="mb-1">{userAvatar}</div>}
            <div className="activity-title">
              {typeof item.title === 'string' ? (
                <Text strong={!dense} className={dense ? 'text-sm' : ''}>
                  {item.title}
                </Text>
              ) : (
                item.title
              )}
              {!item.read && (
                <Badge dot className="ml-2" />
              )}
              {statusLabel && <span className="ml-2">{statusLabel}</span>}
            </div>
          </div>
          {timeDisplay && (
            <div className="activity-time-container">
              {timeDisplay}
            </div>
          )}
        </div>
        
        {item.description && showContent && (
          <div className="activity-description mt-1">
            {typeof item.description === 'string' ? (
              <Paragraph
                ellipsis={{ rows: maxDescriptionLines }}
                className={`text-gray-600 ${dense ? 'text-xs mb-1' : 'mb-2'}`}
              >
                {item.description}
              </Paragraph>
            ) : (
              item.description
            )}
          </div>
        )}
        
        {item.content && showContent && (
          <div className="activity-main-content">
            {item.content}
          </div>
        )}
        
        {tagsDisplay}
        {actionsDisplay}
        
        {item.footer && (
          <div className="activity-footer mt-2">
            {item.footer}
          </div>
        )}
      </div>
    );
    
    // Configure the timeline item props
    const timelineItemProps: TimelineItemProps = {
      dot: <div className="activity-dot" style={{ color: dotColor }}>{getActivityIcon(item)}</div>,
      className: `activity-item ${itemClassName} ${onItemClick ? 'cursor-pointer' : ''}`,
      color: dotColor,
    };
    
    // Wrap content with click handler if provided
    const wrappedContent = onItemClick ? (
      <div onClick={() => onItemClick(item)}>
        {mainContent}
      </div>
    ) : mainContent;
    
    return (
      <Timeline.Item {...timelineItemProps}>
        {wrappedContent}
      </Timeline.Item>
    );
  };

  // Render a date group
  const renderDateGroup = (group: { date: string; items: ActivityItem[] }) => {
    return (
      <div key={group.date} className="activity-date-group">
        <div className="activity-date-header mb-3 mt-4">
          <Text strong>{group.date}</Text>
        </div>
        <Timeline
          mode={mode}
          reverse={reverse}
          pending={pending}
        >
          {group.items.map(item => renderActivityItem(item))}
        </Timeline>
      </div>
    );
  };

  // Render a "load more" button
  const renderLoadMore = () => {
    if (!showLoadMore || !hasMore) return null;
    
    return (
      <div className="activity-load-more text-center mt-4">
        <Button type="link" onClick={onLoadMore} loading={loading}>
          {loadMoreText}
        </Button>
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (renderEmpty) {
      return renderEmpty();
    }
    
    return (
      <Empty 
        description={emptyText} 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
      />
    );
  };

  // Prepare grouped activities
  const { items, groups } = getGroupedActivities();
  const hasActivities = (items.length > 0 || groups.length > 0);

  // Main content of the component
  const content = (
    <div className={`activity-timeline ${className}`}>
      {showHeader && title && (
        <div className="activity-timeline-header mb-4">
          {typeof title === 'string' ? (
            <Title level={5}>{title}</Title>
          ) : (
            title
          )}
        </div>
      )}
      
      {loading && !hasActivities ? (
        <div className="activity-loading text-center py-8">
          <Spin />
          <div className="mt-2">در حال بارگذاری...</div>
        </div>
      ) : !hasActivities ? (
        renderEmptyState()
      ) : groupByDate ? (
        <div className="activity-groups">
          {groups.map(group => renderDateGroup(group))}
        </div>
      ) : (
        <Timeline mode={mode} reverse={reverse} pending={pending}>
          {items.map(item => renderActivityItem(item))}
        </Timeline>
      )}
      
      {renderLoadMore()}
    </div>
  );

  // Wrap in card if requested
  return card ? (
    <Card
      title={cardProps.title}
      extra={cardProps.extra}
      className={`activity-timeline-card ${cardProps.className || ''}`}
      bodyStyle={cardProps.bodyStyle}
    >
      {content}
    </Card>
  ) : content;
};

export default ActivityTimeline;