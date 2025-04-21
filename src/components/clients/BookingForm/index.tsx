'use client';

import React from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Result, Steps } from 'antd';
import { PaymentSection } from './components/PaymentSection';
import { SessionDetailsForm } from './components/SessionDetailsForm';
import { TimeSlotSelection } from './components/TimeSlotSelection';
import { useBookingProcess } from './hooks/useBookingProcess';

const { Step } = Steps;

interface BookingFormProps {
  consultant: { id: number };
  selectedTimeSlot?: any;
}

const BookingForm: React.FC<BookingFormProps> = ({
  consultant,
  selectedTimeSlot,
}) => {
  const {
    currentStep,
    bookingData,
    loading,
    updateFormData,
    submitBooking,
    nextStep,
    prevStep,
    resetBooking,
  } = useBookingProcess();

  React.useEffect(() => {
    if (selectedTimeSlot) {
      updateFormData({ timeSlot: selectedTimeSlot });
    }
  }, [selectedTimeSlot]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <TimeSlotSelection
            formData={bookingData}
            updateFormData={updateFormData}
            onNextStep={nextStep}
            onPrevStep={prevStep}
          />
        );
      case 1:
        return (
          <SessionDetailsForm
            formData={bookingData}
            updateFormData={updateFormData}
            onNextStep={nextStep}
            onPrevStep={prevStep}
          />
        );
      case 2:
        return (
          <PaymentSection
            formData={bookingData}
            updateFormData={updateFormData}
            onNextStep={nextStep}
            onPrevStep={prevStep}
          />
        );
      case 3:
        return (
          <Result
            status="success"
            title="جلسه مشاوره با موفقیت رزرو شد!"
            subTitle={`شماره سفارش: 2024042600123 - تاریخ جلسه: ${bookingData.timeSlot?.date}`}
            extra={[
              <Button
                type="primary"
                key="dashboard"
                onClick={() =>
                  (window.location.href = '/dashboard/client/sessions')
                }
              >
                مشاهده جلسات من
              </Button>,
              <Button key="book-again" onClick={resetBooking}>
                رزرو جلسه جدید
              </Button>,
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <Steps current={currentStep} className="mb-8">
        <Step title="انتخاب زمان" icon={<CalendarOutlined />} />
        <Step title="اطلاعات جلسه" icon={<UserOutlined />} />
        <Step title="پرداخت" icon={<CreditCardOutlined />} />
        <Step title="تأیید" icon={<CheckCircleOutlined />} />
      </Steps>

      {renderStepContent()}
    </Card>
  );
};

export default BookingForm;
