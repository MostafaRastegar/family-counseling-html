import React from 'react';
import { Form, Input, Modal } from 'antd';

const { TextArea } = Input;

interface SessionNotesModalProps {
  visible: boolean;
  initialNotes?: string;
  onCancel: () => void;
  onSubmit: (notes: string) => void;
}

export const SessionNotesModal: React.FC<SessionNotesModalProps> = ({
  visible,
  initialNotes,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({ notes: initialNotes });
  }, [initialNotes, visible]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values.notes);
        onCancel();
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="یادداشت جلسه"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="notes"
          label="یادداشت‌های جلسه"
          rules={[{ required: true, message: 'لطفاً یادداشت را وارد کنید' }]}
        >
          <TextArea
            rows={6}
            placeholder="یادداشت‌های خود از جلسه را وارد کنید"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
