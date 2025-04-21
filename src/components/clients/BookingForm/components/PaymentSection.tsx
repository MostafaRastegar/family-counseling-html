import React from 'react';
import { Card, Descriptions, Divider, Typography } from 'antd';
import { BookingStepProps } from '../types/booking.types';

const { Text } = Typography;

export const PaymentSection: React.FC<BookingStepProps> = ({
  formData,
  updateFormData,
  onNextStep,
}) => {
  const calculatePaymentDetails = () => {
    const sessionDuration = 60; // Default 60 minutes
    const basePrice = 500000; // 500,000 تومان
    const taxRate = 0.09; // 9% مالیات بر ارزش افزوده

    return {
      sessionDuration,
      basePrice,
      tax: basePrice * taxRate,
      totalPrice: basePrice * (1 + taxRate),
    };
  };

  const paymentDetails = calculatePaymentDetails();

  return (
    <Card>
      <Descriptions title="خلاصه هزینه جلسه" bordered column={1}>
        <Descriptions.Item label="مشاور">
          {/* Consultant Name */}
          test
        </Descriptions.Item>
        <Descriptions.Item label="تاریخ و ساعت">
          {formData.timeSlot?.date} - {formData.timeSlot?.startTime}
        </Descriptions.Item>
        <Descriptions.Item label="مدت جلسه">
          {paymentDetails.sessionDuration} دقیقه
        </Descriptions.Item>
        <Descriptions.Item label="هزینه جلسه">
          {paymentDetails.basePrice.toLocaleString()} تومان
        </Descriptions.Item>
        <Descriptions.Item label="مالیات بر ارزش افزوده">
          {paymentDetails.tax.toLocaleString()} تومان
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <div className="text-left">
        <Text strong className="ml-2 text-lg">
          مبلغ قابل پرداخت:
        </Text>
        <Text strong className="text-primary text-xl">
          {paymentDetails.totalPrice.toLocaleString()} تومان
        </Text>
      </div>
    </Card>
  );
};
