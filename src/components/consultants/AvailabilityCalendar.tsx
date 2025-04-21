'use client';

import { useEffect, useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import CalendarView, { TimeSlot } from '@/components/common/calendar-view';

const { Text } = Typography;

// داده‌های نمونه برای زمان‌های در دسترس
const mockAvailabilities = [
  {
    id: 1,
    startTime: '2025-04-20T10:00:00',
    endTime: '2025-04-20T11:00:00',
    isAvailable: true,
    isBooked: false,
  },
  {
    id: 2,
    startTime: '2025-04-20T14:00:00',
    endTime: '2025-04-20T15:00:00',
    isAvailable: true,
    isBooked: true,
  },
  {
    id: 3,
    startTime: '2025-04-21T09:00:00',
    endTime: '2025-04-21T10:30:00',
    isAvailable: true,
    isBooked: false,
  },
  {
    id: 4,
    startTime: '2025-04-22T13:00:00',
    endTime: '2025-04-22T14:00:00',
    isAvailable: true,
    isBooked: false,
  },
  {
    id: 5,
    startTime: '2025-04-22T15:00:00',
    endTime: '2025-04-22T16:00:00',
    isAvailable: false,
    isBooked: false,
  },
];

const AvailabilityCalendar = ({
  consultantId,
  onSelectTimeSlot,
  viewMode = 'client',
}) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      // در حالت واقعی، داده‌ها بر اساس consultantId از API دریافت می‌شوند
      setAvailabilities(mockAvailabilities);
      setLoading(false);
    }, 1000);
  }, [consultantId]);

  // تبدیل داده‌های availabilities به TimeSlot برای CalendarView
  const convertToTimeSlots = () => {
    return availabilities.map((item) => ({
      id: item.id,
      date: dayjs(item.startTime).format('YYYY-MM-DD'),
      startTime: dayjs(item.startTime).format('HH:mm'),
      endTime: dayjs(item.endTime).format('HH:mm'),
      status: item.isAvailable
        ? item.isBooked
          ? 'booked'
          : 'available'
        : 'unavailable',
    }));
  };

  // انتخاب زمان
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    if (onSelectTimeSlot) {
      // تبدیل TimeSlot به فرمت مورد نیاز
      const selectedSlot = availabilities.find(
        (item) => item.id === Number(timeSlot.id),
      );
      onSelectTimeSlot(selectedSlot);
    }
  };

  // رندر کردن آیتم زمانی سفارشی
  const renderTimeSlot = (timeSlot: TimeSlot, actions) => {
    const isSelected = selectedTimeSlot?.id === timeSlot.id;
    const isDisabled = timeSlot.status !== 'available';

    return (
      <div
        className={`mb-2 rounded border p-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} 
        ${timeSlot.status === 'unavailable' ? 'opacity-50' : ''}`}
      >
        <div className="flex items-center justify-between">
          <Space>
            <ClockCircleOutlined />
            <Text strong>
              {timeSlot.startTime} - {timeSlot.endTime}
            </Text>
          </Space>

          {timeSlot.status === 'booked' ? (
            <Tag color="warning">رزرو شده</Tag>
          ) : timeSlot.status === 'available' ? (
            <Tag color="success">در دسترس</Tag>
          ) : (
            <Tag color="error">غیرفعال</Tag>
          )}
        </div>

        {viewMode === 'client' && (
          <div className="mt-2 text-left">
            <Button
              type={isSelected ? 'primary' : 'default'}
              size="small"
              disabled={isDisabled}
              onClick={actions.onSelect}
            >
              {isSelected ? 'انتخاب شده' : 'انتخاب'}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="availability-calendar">
      <CalendarView
        timeSlots={convertToTimeSlots()}
        onSelectTimeSlot={handleTimeSlotSelect}
        selectedDate={selectedDate}
        onClickDate={(date) => setSelectedDate(date)}
        loading={loading}
        renderTimeSlot={renderTimeSlot}
        selectedTimeSlot={selectedTimeSlot}
        showTimeSlotsPanel={true}
        timeSlotsTitle={`زمان‌های ${selectedDate.format('YYYY/MM/DD')}`}
        timeSlotsEmpty="هیچ زمانی برای این روز تنظیم نشده است"
        editable={viewMode === 'consultant'}
        viewOnly={viewMode === 'client'}
        locale="fa"
      />
    </div>
  );
};

export default AvailabilityCalendar;
