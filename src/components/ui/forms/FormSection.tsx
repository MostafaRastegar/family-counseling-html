import React from 'react';
import { Card, Divider, Typography } from 'antd';

const { Title, Text } = Typography;

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  bordered?: boolean;
  className?: string;
  titleExtra?: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  bordered = true,
  className = '',
  titleExtra,
}) => {
  const content = (
    <>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <Title level={5} className="m-0 text-lg">
            {title}
          </Title>
          {description && (
            <Text type="secondary" className="mt-1 block">
              {description}
            </Text>
          )}
        </div>
        {titleExtra && <div>{titleExtra}</div>}
      </div>
      <Divider className="my-4" />
      <div className="pt-2">{children}</div>
    </>
  );

  if (bordered) {
    return <Card className={`mb-6 ${className}`}>{content}</Card>;
  }

  return <div className={`mb-6 ${className}`}>{content}</div>;
};

export default FormSection;
