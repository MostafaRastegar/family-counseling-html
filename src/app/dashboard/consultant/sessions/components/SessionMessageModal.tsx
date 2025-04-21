import React from 'react';
import { Form, Input, Modal, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface SessionMessageModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (messageType: 'telegram' | 'whatsapp', message: string) => void;
}

export const SessionMessageModal: React.FC<SessionMessageModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values.messageType, values.message);
        onCancel();
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="ارسال پیام به مراجع"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="messageType"
          label="روش ارسال پیام"
          rules={[
            { required: true, message: 'لطفاً روش ارسال را انتخاب کنید' },
          ]}
        >
          <Select placeholder="انتخاب روش ارسال">
            <Option value="telegram">تلگرام</Option>
            <Option value="whatsapp">واتس‌اپ</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="message"
          label="متن پیام"
          rules={[{ required: true, message: 'لطفاً متن پیام را وارد کنید' }]}
        >
          <TextArea rows={4} placeholder="متن پیام خود به مراجع را وارد کنید" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
