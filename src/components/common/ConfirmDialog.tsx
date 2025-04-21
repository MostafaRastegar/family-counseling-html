'use client';

import React, { ReactNode } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Alert, Button, Modal, Space, Typography } from 'antd';

const { Text, Title, Paragraph } = Typography;

export type ConfirmDialogType =
  | 'info'
  | 'success'
  | 'error'
  | 'warning'
  | 'confirm';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  content?: string | ReactNode;
  type?: ConfirmDialogType;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonProps?: {
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    danger?: boolean;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
  };
  cancelButtonProps?: {
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    danger?: boolean;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
  };
  width?: number | string;
  centered?: boolean;
  closable?: boolean;
  className?: string;
  icon?: ReactNode;
  iconColor?: string;
  showCancel?: boolean;
  additionalButtons?: ReactNode[];
  alertProps?: {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    description?: string;
    showIcon?: boolean;
  };
}

/**
 * ConfirmDialog - A reusable confirmation dialog component
 *
 * This component provides a consistent way to display confirmation dialogs
 * with different types (info, success, error, warning, confirm) and customizable
 * title, content, and actions.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  content,
  type = 'confirm',
  onConfirm,
  onCancel,
  confirmText,
  cancelText = 'انصراف',
  confirmButtonProps = {},
  cancelButtonProps = {},
  width = 400,
  centered = true,
  closable = false,
  className = '',
  icon,
  iconColor,
  showCancel = true,
  additionalButtons = [],
  alertProps,
}) => {
  // Get icon based on dialog type
  const getIcon = () => {
    if (icon) return icon;

    const iconProps = { style: { color: iconColor || getIconColor() } };

    switch (type) {
      case 'info':
        return <InfoCircleOutlined {...iconProps} />;
      case 'success':
        return <CheckCircleOutlined {...iconProps} />;
      case 'error':
        return <CloseCircleOutlined {...iconProps} />;
      case 'warning':
        return <ExclamationCircleOutlined {...iconProps} />;
      case 'confirm':
        return <QuestionCircleOutlined {...iconProps} />;
      default:
        return <QuestionCircleOutlined {...iconProps} />;
    }
  };

  // Get icon color based on dialog type
  const getIconColor = () => {
    switch (type) {
      case 'info':
        return '#1890ff';
      case 'success':
        return '#52c41a';
      case 'error':
        return '#ff4d4f';
      case 'warning':
        return '#faad14';
      case 'confirm':
        return '#1890ff';
      default:
        return '#1890ff';
    }
  };

  // Get default confirm button type
  const getConfirmButtonType = () => {
    switch (type) {
      case 'error':
        return { type: 'primary', danger: true };
      default:
        return { type: 'primary' };
    }
  };

  // Get confirm text based on dialog type
  const getConfirmText = () => {
    if (confirmText) return confirmText;

    switch (type) {
      case 'info':
        return 'تایید';
      case 'success':
        return 'تایید';
      case 'error':
        return 'متوجه شدم';
      case 'warning':
        return 'تایید';
      case 'confirm':
        return 'تایید';
      default:
        return 'تایید';
    }
  };

  const defaultConfirmButtonProps = getConfirmButtonType();

  return (
    <Modal
      open={visible}
      title={
        <div className="flex items-center">
          <span className="mr-2 text-2xl">{getIcon()}</span>
          {title}
        </div>
      }
      onCancel={onCancel}
      footer={null}
      width={width}
      centered={centered}
      closable={closable}
      className={`confirm-dialog ${className}`}
      maskClosable={false}
    >
      <div className="py-2">
        {alertProps && (
          <Alert
            type={alertProps.type}
            message={alertProps.message}
            description={alertProps.description}
            showIcon={alertProps.showIcon}
            className="mb-4"
          />
        )}

        {content && (
          <div className="confirm-dialog-content mb-4">
            {typeof content === 'string' ? (
              <Paragraph>{content}</Paragraph>
            ) : (
              content
            )}
          </div>
        )}

        <div className="confirm-dialog-footer flex justify-end">
          <Space>
            {showCancel && (
              <Button onClick={onCancel} {...cancelButtonProps}>
                {cancelText}
              </Button>
            )}

            {additionalButtons.map((button, index) => (
              <span key={index}>{button}</span>
            ))}

            <Button
              type={
                confirmButtonProps.type ||
                (defaultConfirmButtonProps.type as
                  | 'primary'
                  | 'default'
                  | 'dashed'
                  | 'link'
                  | 'text')
              }
              danger={
                confirmButtonProps.danger || defaultConfirmButtonProps.danger
              }
              onClick={onConfirm}
              disabled={confirmButtonProps.disabled}
              loading={confirmButtonProps.loading}
              className={confirmButtonProps.className}
            >
              {getConfirmText()}
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

// Static method for easily creating a confirmation dialog
ConfirmDialog.show = ({
  title,
  content,
  type = 'confirm',
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmButtonProps,
  cancelButtonProps,
  width,
  centered,
  closable,
  icon,
  iconColor,
}: Omit<ConfirmDialogProps, 'visible'>) => {
  const modal = Modal.confirm({
    title: (
      <div className="flex items-center">
        <span className="mr-2 text-2xl">
          {icon ||
            (type === 'confirm' ? (
              <QuestionCircleOutlined
                style={{ color: iconColor || '#1890ff' }}
              />
            ) : null)}
        </span>
        {title}
      </div>
    ),
    content:
      typeof content === 'string' ? <Paragraph>{content}</Paragraph> : content,
    onOk: onConfirm,
    onCancel,
    okText: confirmText || 'تایید',
    cancelText: cancelText || 'انصراف',
    okButtonProps: confirmButtonProps,
    cancelButtonProps,
    width,
    centered,
    closable,
    maskClosable: false,
  });

  return modal;
};

export default ConfirmDialog;
