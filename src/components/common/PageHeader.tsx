'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Divider, Space, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export interface BreadcrumbItem {
  title: string | ReactNode;
  href?: string;
  icon?: ReactNode;
}

export interface PageAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface PageHeaderProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  description?: string | ReactNode;
  breadcrumb?: BreadcrumbItem[];
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
  backHref?: string;
  actions?: PageAction[];
  extra?: ReactNode;
  className?: string;
  contentClassName?: string;
  divider?: boolean;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
  compact?: boolean;
}

/**
 * PageHeader - A reusable component for page headers
 *
 * This component provides a consistent header layout for pages with support
 * for title, subtitle, description, breadcrumb, actions, and back button.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  breadcrumb,
  showBackButton = false,
  backButtonText = 'بازگشت',
  onBack,
  backHref,
  actions = [],
  extra,
  className = '',
  contentClassName = '',
  divider = true,
  titleLevel = 2,
  compact = false,
}) => {
  // Render breadcrumb component
  const renderBreadcrumb = () => {
    if (!breadcrumb || breadcrumb.length === 0) return null;

    return (
      <Breadcrumb className="mb-2">
        {breadcrumb.map((item, index) => (
          <Breadcrumb.Item key={index}>
            {item.href ? (
              <Link href={item.href}>
                <Space size={4}>
                  {item.icon}
                  {item.title}
                </Space>
              </Link>
            ) : (
              <Space size={4}>
                {item.icon}
                {item.title}
              </Space>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  // Render back button
  const renderBackButton = () => {
    if (!showBackButton) return null;

    const backButton = (
      <Button icon={<ArrowRightOutlined />} onClick={onBack} className="mb-3">
        {backButtonText}
      </Button>
    );

    return backHref ? <Link href={backHref}>{backButton}</Link> : backButton;
  };

  // Render actions
  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <Space className="page-header-actions">
        {actions.map((action) => {
          const button = (
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

  return (
    <div className={`page-header ${className}`}>
      {renderBackButton()}
      {renderBreadcrumb()}

      <div
        className={`page-header-content ${contentClassName} ${compact ? 'flex flex-wrap items-center justify-between' : ''}`}
      >
        <div className={compact ? 'mb-0' : 'mb-4'}>
          {typeof title === 'string' ? (
            <Title level={titleLevel} className="mb-1">
              {title}
            </Title>
          ) : (
            title
          )}

          {subtitle && (
            <div className="page-header-subtitle mb-1">
              {typeof subtitle === 'string' ? (
                <Title
                  level={(titleLevel + 1) as any}
                  className="mb-0 font-normal text-gray-600"
                >
                  {subtitle}
                </Title>
              ) : (
                subtitle
              )}
            </div>
          )}

          {description && (
            <div className="page-header-description mt-2">
              {typeof description === 'string' ? (
                <Paragraph className="mb-0 text-gray-500">
                  {description}
                </Paragraph>
              ) : (
                description
              )}
            </div>
          )}
        </div>

        <div className="page-header-right">
          {renderActions()}
          {extra && (
            <div className="page-header-extra mt-2 md:mt-0">{extra}</div>
          )}
        </div>
      </div>

      {divider && <Divider className="mb-6 mt-2" />}
    </div>
  );
};

export default PageHeader;
