import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { Session } from '../types/session.types';

const { Option } = Select;
const { TextArea } = Input;

interface SessionEditModalProps {
  visible: boolean;
  session: Session | null;
  onCancel: () => void;
  onSubmit: (updateData: any) => void;
}

export const SessionEditModal: React.FC<SessionEditModalProps> = ({
  visible,
  session,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (session) {
      form.setFieldsValue({
        status: session.status,
        notes: session.notes,
        messengerType: session.messengerType,
      });
    }
  }, [session, visible]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        onCancel();
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="ویرایش جلسه"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="status"
          label="وضعیت"
          rules={[{ required: true, message: 'لطفاً وضعیت را انتخاب کنید' }]}
        >
          <Select placeholder="انتخاب وضعیت">
            <Option value="pending">در انتظار تأیید</Option>
            <Option value="confirmed">تأیید شده</Option>
            <Option value="completed">برگزار شده</Option>
            <Option value="cancelled">لغو شده</Option>
          </Select>
        </Form.Item>
        <Form.Item name="notes" label="یادداشت‌ها">
          <TextArea rows={4} placeholder="یادداشت‌های مربوط به جلسه" />
        </Form.Item>
        <Form.Item name="messengerType" label="نوع پیام‌رسان">
          <Select placeholder="انتخاب پیام‌رسان">
            <Option value="telegram">تلگرام</Option>
            <Option value="whatsapp">واتس‌اپ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
