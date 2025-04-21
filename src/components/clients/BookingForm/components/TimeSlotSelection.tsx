import React from 'react';
import { Alert, Typography } from 'antd';
import CalendarView from '@/components/common/calendar-view';
import { BookingStepProps } from '../types/booking.types';

const { Text } = Typography;

export const TimeSlotSelection: React.FC<BookingStepProps> = ({
  formData,
  updateFormData,
  onNextStep,
}) => {
  const handleTimeSlotSelect = (timeSlot) => {
    if (timeSlot.status === 'available') {
      updateFormData({ timeSlot });
      onNextStep();
    }
  };

  return (
    <div>
      <Text strong>زمان جلسه مشاوره را انتخاب کنید</Text>
      <CalendarView
        onSelectTimeSlot={handleTimeSlotSelect}
        selectedTimeSlot={formData.timeSlot}
        showTimeSlotsPanel
        timeSlotsTitle="زمان‌های دردسترس"
        timeSlotsEmpty="زمانی برای این روز موجود نیست"
      />
      {!formData.timeSlot && (
        <Alert
          message="لطفاً یک زمان مناسب را انتخاب کنید"
          type="info"
          showIcon
          className="mt-4"
        />
      )}
    </div>
  );
};
