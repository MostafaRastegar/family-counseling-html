'use client';

import React, { ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Space,
  Typography,
} from 'antd';
import { DescriptionsProps } from 'antd/es/descriptions';

const { Title, Text, Paragraph } = Typography;

export interface DetailField {
  label: string;
  value: ReactNode;
  span?: number;
  className?: string;
}

export interface DetailSection {
  title?: string;
  fields: DetailField[];
  column?: number;
  bordered?: boolean;
  className?: string;
}

export interface DetailAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface DetailHeaderInfo {
  title: string;
  subtitle?: string;
  avatar?: {
    src?: string;
    icon?: ReactNode;
    size?: number | 'large' | 'small' | 'default';
    shape?: 'circle' | 'square';
  };
  tags?: ReactNode[];
  extra?: ReactNode;
}

export interface DetailViewProps {
  header?: DetailHeaderInfo;
  sections: DetailSection[];
  loading?: boolean;
  actions?: DetailAction[];
  className?: string;
  size?: DescriptionsProps['size'];
  card?: boolean;
  cardProps?: {
    title?: ReactNode;
    extra?: ReactNode;
    className?: string;
    bodyStyle?: React.CSSProperties;
  };
  contentClassName?: string;
  footer?: ReactNode;
  alerts?: ReactNode[];
}

/**
 * DetailView - A reusable component for displaying entity details
 *
 * This component provides a configurable interface for displaying details of an entity
 * with support for multiple sections, fields, and actions.
 */
const DetailView: React.FC<DetailViewProps> = ({
  header,
  sections,
  loading = false,
  actions = [],
  className = '',
  size = 'default',
  card = true,
  cardProps = {},
  contentClassName = '',
  footer,
  alerts = [],
}) => {
  // Render header component
  const renderHeader = () => {
    if (!header) return null;

    return (
      <div className="detail-header mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          {header.avatar && (
            <Avatar
              src={header.avatar.src}
              icon={header.avatar.icon || <UserOutlined />}
              size={header.avatar.size || 'large'}
              shape={header.avatar.shape || 'circle'}
              className="mr-4"
            />
          )}
          <div>
            <Title level={4} className="mb-1">
              {header.title}
            </Title>
            {header.subtitle && (
              <Paragraph className="text-gray-500">{header.subtitle}</Paragraph>
            )}
            {header.tags && header.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap">
                {header.tags.map((tag, index) => (
                  <span key={index} className="mb-1 mr-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {header.extra && <div className="mt-3 md:mt-0">{header.extra}</div>}
      </div>
    );
  };

  // Render alerts
  const renderAlerts = () => {
    if (!alerts || alerts.length === 0) return null;

    return (
      <div className="detail-alerts mb-4">
        {alerts.map((alert, index) => (
          <div key={index} className="mb-2">
            {alert}
          </div>
        ))}
      </div>
    );
  };

  // Render sections
  const renderSections = () => {
    return sections.map((section, sectionIndex) => (
      <div
        key={sectionIndex}
        className={`detail-section ${section.className || ''}`}
      >
        {section.title && (
          <Title level={5} className="mb-3">
            {section.title}
          </Title>
        )}
        <Descriptions
          bordered={section.bordered}
          column={
            section.column || { xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }
          }
          size={size}
        >
          {section.fields.map((field, fieldIndex) => (
            <Descriptions.Item
              key={fieldIndex}
              label={field.label}
              span={field.span}
              className={field.className}
            >
              {field.value !== null && field.value !== undefined
                ? field.value
                : '-'}
            </Descriptions.Item>
          ))}
        </Descriptions>
        {sectionIndex < sections.length - 1 && <Divider className="my-4" />}
      </div>
    ));
  };

  // Render actions
  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="detail-actions mt-6 flex justify-end">
        <Space>
          {actions.map((action) => (
            <Button
              key={action.key}
              type={action.type || 'default'}
              icon={action.icon}
              onClick={action.onClick}
              danger={action.danger}
              disabled={action.disabled}
              className={action.className}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      </div>
    );
  };

  // Content to render
  const content = (
    <div className={`detail-content ${contentClassName}`}>
      {renderAlerts()}
      {renderHeader()}
      {renderSections()}
      {renderActions()}
      {footer && <div className="detail-footer mt-6">{footer}</div>}
    </div>
  );

  // Either wrap in a card or return the content directly
  return card ? (
    <Card
      loading={loading}
      className={`detail-view-card ${className}`}
      title={cardProps.title}
      extra={cardProps.extra}
      bodyStyle={cardProps.bodyStyle}
    >
      {content}
    </Card>
  ) : (
    <div
      className={`detail-view ${className}`}
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      {content}
    </div>
  );
};

export default DetailView;
