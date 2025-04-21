import React from 'react';
import { Checkbox, Form, Input, Modal, Rate } from 'antd';
import { SessionReview } from '../types/session.types';

const { TextArea } = Input;

interface SessionReviewModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (reviewData: SessionReview) => void;
}

export const SessionReviewModal: React.FC<SessionReviewModalProps> = ({
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
      title="ثبت نظر برای جلسه مشاوره"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="rating"
          label="امتیاز شما"
          rules={[
            { required: true, message: 'لطفاً امتیاز خود را انتخاب کنید' },
          ]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          name="comment"
          label="نظر شما"
          rules={[{ required: true, message: 'لطفاً نظر خود را بنویسید' }]}
        >
          <TextArea
            rows={4}
            placeholder="تجربه خود از جلسه مشاوره را بنویسید"
          />
        </Form.Item>

        <Form.Item name="anonymous" valuePropName="checked">
          <Checkbox>ثبت نظر به صورت ناشناس</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};
