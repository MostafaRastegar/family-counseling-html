'use client';

import React, { ReactNode, useEffect } from 'react';
import {
  Alert,
  Button,
  Divider,
  Form,
  FormProps,
  Modal,
  Space,
  Typography,
} from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Text } = Typography;

export interface FormModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void | Promise<void>;
  form: FormInstance;
  width?: number | string;
  confirmLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  footer?: ReactNode | null;
  formProps?: FormProps;
  children: ReactNode;
  destroyOnClose?: boolean;
  afterClose?: () => void;
  className?: string;
  centered?: boolean;
  maskClosable?: boolean;
  resetOnClose?: boolean;
  confirmButtonProps?: {
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    danger?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    className?: string;
  };
  alerts?: {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    description?: string;
    showIcon?: boolean;
  }[];
  headerExtra?: ReactNode;
  description?: string;
}

/**
 * FormModal - A reusable modal component with form functionality
 *
 * This component provides a configurable interface for displaying modals
 * with forms and handling form submission.
 */
const FormModal: React.FC<FormModalProps> = ({
  title,
  visible,
  onCancel,
  onFinish,
  form,
  width = 600,
  confirmLoading = false,
  confirmText = 'ذخیره',
  cancelText = 'انصراف',
  footer,
  formProps,
  children,
  destroyOnClose = true,
  afterClose,
  className = '',
  centered = true,
  maskClosable = false,
  resetOnClose = true,
  confirmButtonProps = {
    type: 'primary',
  },
  alerts = [],
  headerExtra,
  description,
}) => {
  // Reset form when modal is closed
  useEffect(() => {
    if (!visible && resetOnClose) {
      form.resetFields();
    }
  }, [visible, form, resetOnClose]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onFinish(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Default footer with cancel and submit buttons
  const defaultFooter = (
    <div className="flex justify-end">
      <Space>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button
          {...confirmButtonProps}
          loading={confirmLoading}
          onClick={handleSubmit}
        >
          {confirmText}
        </Button>
      </Space>
    </div>
  );

  return (
    <Modal
      title={
        <div>
          <div className="flex items-center justify-between">
            <span>{title}</span>
            {headerExtra && <div>{headerExtra}</div>}
          </div>
          {description && (
            <Text type="secondary" className="mt-1 block text-sm">
              {description}
            </Text>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={footer === undefined ? defaultFooter : footer}
      width={width}
      destroyOnClose={destroyOnClose}
      afterClose={afterClose}
      className={`form-modal ${className}`}
      centered={centered}
      maskClosable={maskClosable}
    >
      {alerts.length > 0 && (
        <div className="mb-4">
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              type={alert.type}
              message={alert.message}
              description={alert.description}
              showIcon={alert.showIcon ?? true}
              className="mb-2"
            />
          ))}
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        {...formProps}
        autoComplete="off"
      >
        {children}
      </Form>
    </Modal>
  );
};

export default FormModal;
