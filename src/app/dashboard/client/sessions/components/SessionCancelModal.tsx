import React from 'react';
import { Form, Input, Modal } from 'antd';
import { SessionCancellation } from '../types/session.types';

const { TextArea } = Input;

interface SessionCancelModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (cancellationData: SessionCancellation) => void;
}

export const SessionCancelModal: React.FC<SessionCancelModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

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
      title="لغو جلسه مشاوره"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="دلیل لغو جلسه"
          rules={[{ required: true, message: 'لطفاً دلیل لغو را وارد کنید' }]}
        >
          <TextArea rows={4} placeholder="دلیل لغو جلسه را توضیح دهید" />
        </Form.Item>
        <div className="bg-yellow-50 rounded p-3">
          <p className="text-yellow-700">
            توجه: لغو جلسه کمتر از 24 ساعت قبل از زمان شروع ممکن است مشمول جریمه
            شود.
          </p>
        </div>
      </Form>
    </Modal>
  );
};
