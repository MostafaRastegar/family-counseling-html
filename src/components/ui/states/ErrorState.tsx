import React from 'react';
import { CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';

interface ErrorStateProps {
  title?: string;
  subTitle?: string;
  error?: Error | string;
  onRetry?: () => void;
  showError?: boolean;
  fullPage?: boolean;
  status?: '403' | '404' | '500' | 'error' | 'info' | 'success' | 'warning';
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'خطایی رخ داده است',
  subTitle = 'متأسفانه در دریافت اطلاعات خطایی رخ داده است. لطفا دوباره تلاش کنید.',
  error,
  onRetry,
  showError = false,
  fullPage = false,
  status = 'error',
}) => {
  // Extract error message if error is an object
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : '';

  return (
    <div
      className={`flex items-center justify-center ${fullPage ? 'min-h-screen' : 'py-8'}`}
    >
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        icon={
          status === 'error' ? (
            <CloseCircleOutlined className="text-red-500" />
          ) : undefined
        }
        extra={[
          onRetry && (
            <Button
              key="retry"
              type="primary"
              icon={<ReloadOutlined />}
              onClick={onRetry}
            >
              تلاش مجدد
            </Button>
          ),
        ].filter(Boolean)}
      >
        {showError && errorMessage && (
          <div className="bg-red-50 border-red-100 mt-4 rounded-md border p-3">
            <pre className="text-red-600 whitespace-pre-wrap text-sm">
              {errorMessage}
            </pre>
          </div>
        )}
      </Result>
    </div>
  );
};

export default ErrorState;
