import React from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';

interface FormActionsProps {
  onCancel?: () => void;
  onReset?: () => void;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showReset?: boolean;
  extraActions?: React.ReactNode;
  position?: 'left' | 'right' | 'center' | 'between';
  className?: string;
  fixed?: boolean;
  form?: string; // form ID to connect with a specific form
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onReset,
  loading = false,
  submitText = 'ذخیره',
  cancelText = 'انصراف',
  resetText = 'بازنشانی',
  showReset = false,
  extraActions,
  position = 'right',
  className = '',
  fixed = false,
  form,
}) => {
  // Helper function to determine justification class
  const getPositionClass = () => {
    switch (position) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'between':
        return 'justify-between';
      case 'right':
      default:
        return 'justify-end';
    }
  };

  return (
    <div
      className={`
        ${getPositionClass()} 
        mt-6 flex 
        items-center 
        ${fixed ? 'sticky bottom-0 z-10 border-t bg-white p-4' : ''} 
        ${className}
      `}
    >
      <Space>
        {position === 'between' && extraActions && (
          <div className="mr-auto">{extraActions}</div>
        )}

        {showReset && onReset && (
          <Button icon={<ReloadOutlined />} onClick={onReset}>
            {resetText}
          </Button>
        )}

        {onCancel && (
          <Button icon={<CloseOutlined />} onClick={onCancel}>
            {cancelText}
          </Button>
        )}

        <Button
          type="primary"
          icon={<CheckOutlined />}
          loading={loading}
          htmlType="submit"
          form={form}
        >
          {submitText}
        </Button>

        {position !== 'between' && extraActions}
      </Space>
    </div>
  );
};

export default FormActions;
