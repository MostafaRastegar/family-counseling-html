import React from 'react';
import { Button, Form, FormProps, Modal } from 'antd';

interface FormModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  confirmLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  width?: number | string;
  children: React.ReactNode;
  formProps?: FormProps;
  destroyOnClose?: boolean;
  maskClosable?: boolean;
  footer?: React.ReactNode;
  formId?: string;
  className?: string;
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  visible,
  onCancel,
  onSubmit,
  confirmLoading = false,
  confirmText = 'تایید',
  cancelText = 'انصراف',
  width = 520,
  children,
  formProps,
  destroyOnClose = true,
  maskClosable = false,
  footer,
  formId = 'form-modal',
  className = '',
}) => {
  // Create default footer buttons
  const defaultFooter = [
    <Button key="cancel" onClick={onCancel}>
      {cancelText}
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={confirmLoading}
      htmlType="submit"
      form={formId}
    >
      {confirmText}
    </Button>,
  ];

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      width={width}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      footer={footer === undefined ? defaultFooter : footer}
      className={className}
    >
      <Form
        id={formId}
        layout="vertical"
        onFinish={onSubmit}
        preserve={false}
        {...formProps}
      >
        {children}
      </Form>
    </Modal>
  );
};

export default FormModal;
