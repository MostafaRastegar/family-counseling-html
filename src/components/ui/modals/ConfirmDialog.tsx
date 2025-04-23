import React from 'react';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, Typography } from 'antd';

const { Text, Title } = Typography;

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  content: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'error' | 'confirm';
  width?: number | string;
  centered?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  content,
  onCancel,
  onConfirm,
  confirmLoading = false,
  confirmText = 'تایید',
  cancelText = 'انصراف',
  type = 'warning',
  width = 420,
  centered = true,
}) => {
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'warning':
      case 'error':
        return (
          <ExclamationCircleOutlined
            className={type === 'warning' ? 'text-yellow-500' : 'text-red-500'}
          />
        );
      case 'info':
      case 'confirm':
      default:
        return <QuestionCircleOutlined className="text-blue-500" />;
    }
  };

  // Get button type based on dialog type
  const getButtonType = ():
    | 'primary'
    | 'default'
    | 'link'
    | 'text'
    | 'dashed' => {
    switch (type) {
      case 'warning':
        return 'default';
      case 'error':
        return 'default';
      case 'info':
      case 'confirm':
      default:
        return 'primary';
    }
  };

  // Get button danger flag based on dialog type
  const isButtonDanger = type === 'warning' || type === 'error';

  return (
    <Modal
      open={visible}
      title={null}
      footer={null}
      onCancel={onCancel}
      width={width}
      centered={centered}
      closable={false}
    >
      <div className="pb-2 pt-4 text-center">
        <div className="mb-4 text-4xl">{getIcon()}</div>

        <Title level={4} className="mb-3">
          {title}
        </Title>

        <div className="mb-6">
          {typeof content === 'string' ? <Text>{content}</Text> : content}
        </div>

        <Space size="middle">
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button
            type={getButtonType()}
            danger={isButtonDanger}
            loading={confirmLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
