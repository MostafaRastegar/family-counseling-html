import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { SessionStatus } from '../types/session.types';

const { Option } = Select;
const { TextArea } = Input;

interface SessionStatusModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (status: SessionStatus, reason?: string) => void;
}

export const SessionStatusModal: React.FC<SessionStatusModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values.status, values.reason);
        onCancel();
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="تغییر وضعیت جلسه"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="status"
          label="وضعیت جدید"
          rules={[{ required: true, message: 'لطفاً وضعیت را انتخاب کنید' }]}
        >
          <Select placeholder="انتخاب وضعیت">
            <Option value="confirmed">تأیید شده</Option>
            <Option value="completed">برگزار شده</Option>
            <Option value="cancelled">لغو شده</Option>
          </Select>
        </Form.Item>
        <Form.Item name="reason" label="توضیحات (اختیاری)">
          <TextArea
            rows={4}
            placeholder="توضیحات مربوط به تغییر وضعیت را وارد کنید"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
