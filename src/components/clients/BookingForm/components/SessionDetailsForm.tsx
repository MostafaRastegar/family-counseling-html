import React from 'react';
import { Form, Input, Radio } from 'antd';
import { BookingStepProps } from '../types/booking.types';

export const SessionDetailsForm: React.FC<BookingStepProps> = ({
  formData,
  updateFormData,
  onNextStep,
  onPrevStep,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    updateFormData(values);
    onNextStep();
  };

  return (
    <Form
      form={form}
      initialValues={formData}
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item
        name="sessionType"
        label="نوع جلسه"
        rules={[{ required: true, message: 'لطفاً نوع جلسه را انتخاب کنید' }]}
      >
        <Radio.Group>
          <Radio value="video">ویدیو کنفرانس</Radio>
          <Radio value="voice">تماس صوتی</Radio>
          <Radio value="text">گفتگوی متنی</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="notes"
        label="توضیحات (اختیاری)"
        help="توضیحات خود درباره موضوع جلسه را وارد کنید"
      >
        <Input.TextArea rows={4} placeholder="توضیحات تکمیلی درباره جلسه" />
      </Form.Item>

      <Form.Item name="anonymous" valuePropName="checked">
        <Radio>ثبت نظر به صورت ناشناس</Radio>
      </Form.Item>
    </Form>
  );
};
