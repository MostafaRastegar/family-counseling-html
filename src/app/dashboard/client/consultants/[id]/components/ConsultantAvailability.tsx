import React, { useState } from 'react';
import { Button, Card } from 'antd';
import BookingForm from '@/components/clients/BookingForm';
import AvailabilityCalendar from '@/components/consultants/AvailabilityCalendar';

interface ConsultantAvailabilityProps {
  consultantId: number;
}

export const ConsultantAvailability: React.FC<ConsultantAvailabilityProps> = ({
  consultantId,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <Card title="رزرو جلسه مشاوره">
      <AvailabilityCalendar
        consultantId={consultantId}
        onSelectTimeSlot={handleTimeSlotSelect}
      />
      {selectedTimeSlot && (
        <BookingForm
          consultant={{ id: consultantId }}
          selectedTimeSlot={selectedTimeSlot}
        />
      )}
    </Card>
  );
};
