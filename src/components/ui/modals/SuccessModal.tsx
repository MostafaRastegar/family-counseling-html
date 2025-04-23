import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';

const { Title, Text } = Typography;

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: React.ReactNode;
  buttonText?: string;
  width?: number | string;
  centered?: boolean;
  duration?: number; // Auto close duration in seconds (0 = disabled)
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title = 'عملیات موفق',
  message,
  buttonText = 'بستن',
  width = 420,
  centered = true,
  duration = 0,
}) => {
  // Set up auto-close timer if duration is provided
  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible && duration > 0) {
      timer = setTimeout(() => {
        onClose();
      }, duration * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, duration, onClose]);

  return (
    <Modal
      open={visible}
      title={null}
      footer={null}
      onCancel={onClose}
      width={width}
      centered={centered}
      closable={false}
    >
      <div className="py-6 text-center">
        <div className="mb-4">
          <CheckCircleOutlined className="text-green-500 text-5xl" />
        </div>

        <Title level={4} className="mb-3">
          {title}
        </Title>

        <div className="mb-6">
          {typeof message === 'string' ? <Text>{message}</Text> : message}
        </div>

        <Button type="primary" onClick={onClose}>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
