import React from 'react';
import { Button, Empty } from 'antd';
import { EmptyProps } from 'antd/lib/empty';

interface EmptyStateProps extends EmptyProps {
  title?: string;
  description?: string;
  image?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description = 'اطلاعاتی برای نمایش وجود ندارد',
  image,
  actionText,
  onAction,
  ...props
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-8">
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="mt-4">
            {title && <h4 className="mb-1 text-base font-medium">{title}</h4>}
            <p className="text-gray-500">{description}</p>
          </div>
        }
        {...props}
      />

      {actionText && onAction && (
        <Button type="primary" onClick={onAction} className="mt-4">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
