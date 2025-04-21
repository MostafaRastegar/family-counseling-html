'use client';

import { ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, Space, Tag, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

export interface GenericCardAction {
  key: string;
  icon?: ReactNode;
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed';
  tooltip?: string;
  hide?: boolean;
}

export interface GenericCardProps {
  title: string;
  subtitle?: string;
  rating?: number;
  description?: string;
  avatar?: {
    src?: string;
    icon?: ReactNode;
    size?: number | 'small' | 'default' | 'large';
  };
  tags?: Array<{
    text: string;
    color?: string;
    icon?: ReactNode;
  }>;
  status?: {
    text: string;
    color?: string;
    icon?: ReactNode;
  };
  metadata?: Array<{
    icon?: ReactNode;
    text: string;
  }>;
  actions?: GenericCardAction[];
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
  loading?: boolean;
  extra?: ReactNode;
}

/**
 * GenericCard - A reusable card component that can be configured for various use cases
 *
 * This component is designed to replace multiple specific card components like SessionCard,
 * ConsultantCard, etc., by providing a flexible, configurable interface.
 */
const GenericCard: React.FC<GenericCardProps> = ({
  title,
  subtitle,
  rating,
  description,
  avatar,
  tags,
  status,
  metadata,
  actions,
  footer,
  className = '',
  onClick,
  hoverable = false,
  bordered = true,
  loading = false,
  extra,
}) => {
  // Filter actions to show only non-hidden ones
  const visibleActions = actions
    ?.filter((action) => !action.hide)
    ?.map((action) => (
      <div key={action.key}>
        {action.tooltip ? (
          <div title={action.tooltip}>
            <Button
              type={action.type || 'default'}
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              danger={action.danger}
            >
              {action.text}
            </Button>
          </div>
        ) : (
          <Button
            type={action?.type || 'default'}
            icon={action?.icon}
            onClick={action?.onClick}
            disabled={action?.disabled}
            danger={action?.danger}
          >
            {action.text}
          </Button>
        )}
      </div>
    ));

  return (
    <Card
      className={`generic-card ${className}`}
      hoverable={hoverable}
      bordered={bordered}
      loading={loading}
      actions={visibleActions}
      extra={extra}
      onClick={onClick}
    >
      <div className="card-header mb-3 flex items-start justify-between">
        <Space direction="vertical" size={1}>
          <div className="flex items-center">
            {avatar && (
              <Avatar
                size={avatar.size || 'default'}
                src={avatar.src}
                icon={avatar.icon || <UserOutlined />}
                className="mr-3"
              />
            )}
            <div>
              <Title level={5} className="mb-0">
                {title}
              </Title>
              {!!rating && (
                <Rate disabled defaultValue={rating} className="text-sm" />
              )}
              {subtitle && <Text type="secondary">{subtitle}</Text>}
            </div>
          </div>
        </Space>

        {status && (
          <Tag color={status.color} icon={status.icon}>
            {status.text}
          </Tag>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="card-tags mb-3">
          {tags.map((tag, index) => (
            <Tag
              key={index}
              color={tag.color}
              icon={tag.icon}
              className="mb-1 mr-1"
            >
              {tag.text}
            </Tag>
          ))}
        </div>
      )}

      {description && (
        <div className="card-description mb-3">
          <Paragraph ellipsis={{ rows: 3 }}>{description}</Paragraph>
        </div>
      )}

      {metadata && metadata.length > 0 && (
        <div className="card-metadata mb-3">
          <Space direction="vertical" size={1}>
            {metadata.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <Text>{item.text}</Text>
              </div>
            ))}
          </Space>
        </div>
      )}

      {footer && <div className="card-footer mt-auto">{footer}</div>}
    </Card>
  );
};

// Helper component for Button to avoid the import in the main component
const Button = ({
  type = 'default',
  icon,
  onClick,
  disabled,
  danger,
  children,
}: {
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed';
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  children?: ReactNode;
}) => {
  return (
    <button
      className={`ant-btn ant-btn-${type} ${danger ? 'ant-btn-dangerous' : ''} ${disabled ? 'ant-btn-disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon && <span className="anticon">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};

export default GenericCard;
