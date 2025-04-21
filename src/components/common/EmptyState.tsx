'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import {
  InboxOutlined,
  SearchOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Button, Card, Empty, Space, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export interface EmptyStateAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  disabled?: boolean;
}

export interface EmptyStateProps {
  title?: string;
  description?: string | ReactNode;
  image?: ReactNode | 'default' | 'simple' | 'compact' | 'search' | 'custom';
  actions?: EmptyStateAction[];
  className?: string;
  card?: boolean;
  cardClassName?: string;
  compact?: boolean;
  centered?: boolean;
  icon?: ReactNode;
  iconSize?: number;
  iconColor?: string;
}

/**
 * EmptyState - A reusable component for empty states
 *
 * This component provides a consistent way to display empty states
 * with customizable title, description, image, and actions.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'داده‌ای یافت نشد',
  description = 'هیچ داده‌ای برای نمایش وجود ندارد.',
  image = 'default',
  actions = [],
  className = '',
  card = false,
  cardClassName = '',
  compact = false,
  centered = true,
  icon,
  iconSize = 64,
  iconColor = '#1890ff',
}) => {
  // Determine which image to use
  const getImage = () => {
    if (image === 'default') {
      return Empty.PRESENTED_IMAGE_DEFAULT;
    } else if (image === 'simple') {
      return Empty.PRESENTED_IMAGE_SIMPLE;
    } else if (image === 'compact') {
      // Simple image but smaller
      return <Empty.PRESENTED_IMAGE_SIMPLE style={{ height: 60 }} />;
    } else if (image === 'search') {
      return (
        <SearchOutlined style={{ fontSize: iconSize, color: iconColor }} />
      );
    } else if (image === 'custom') {
      return (
        icon || (
          <InboxOutlined style={{ fontSize: iconSize, color: iconColor }} />
        )
      );
    } else {
      return image;
    }
  };

  // Render actions
  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <Space className="mt-4">
        {actions.map((action) => {
          const button = (
            <Button
              key={action.key}
              type={action.type || 'default'}
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          );

          return action.href ? (
            <Link key={action.key} href={action.href}>
              {button}
            </Link>
          ) : (
            button
          );
        })}
      </Space>
    );
  };

  const content = (
    <div
      className={`
      empty-state 
      ${className} 
      ${centered ? 'flex flex-col items-center justify-center text-center' : ''}
      ${compact ? 'p-2' : 'py-8'}`}
    >
      <Empty
        image={getImage()}
        imageStyle={{ height: compact ? 40 : 100 }}
        description={null}
      />

      {title && (
        <Title level={compact ? 5 : 4} className="mb-1 mt-2">
          {title}
        </Title>
      )}

      {description && (
        <div className="empty-state-description">
          {typeof description === 'string' ? (
            <Paragraph className="text-gray-500">{description}</Paragraph>
          ) : (
            description
          )}
        </div>
      )}

      {renderActions()}
    </div>
  );

  return card ? (
    <Card className={`empty-state-card ${cardClassName}`}>{content}</Card>
  ) : (
    content
  );
};

export default EmptyState;
