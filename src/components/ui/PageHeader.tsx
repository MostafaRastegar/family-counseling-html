import React from 'react';
import { Button, Space, Typography } from 'antd';

const { Title } = Typography;

interface ActionButton {
  key: string;
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
  type?: 'primary' | 'default' | 'text' | 'link' | 'dashed';
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ActionButton[];
  backButton?: {
    text?: string;
    onClick: () => void;
  };
  extra?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  backButton,
  extra,
}) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between rounded-lg bg-white p-6 shadow-sm sm:flex-row sm:items-center">
      <div className="mb-4 sm:mb-0">
        {backButton && (
          <Button
            type="link"
            onClick={backButton.onClick}
            className="hover:text-primary-500 mb-2 p-0"
          >
            {backButton.text || 'بازگشت'}
          </Button>
        )}
        <Title level={4} className="m-0 text-xl">
          {title}
        </Title>
        {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions && (
          <Space>
            {actions.map((action) => (
              <Button
                key={action.key}
                type={action.type || 'default'}
                icon={action.icon}
                onClick={action.onClick}
              >
                {action.text}
              </Button>
            ))}
          </Space>
        )}
        {extra}
      </div>
    </div>
  );
};

export default PageHeader;
