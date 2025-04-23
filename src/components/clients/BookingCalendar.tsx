import React, { useEffect, useState } from 'react';
import {
  ClockCircleOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Calendar,
  Card,
  Modal,
  Space,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fa';

const { Title } = Typography;

// Set dayjs locale to Persian
dayjs.locale('fa');

interface TimeSlot {
  id: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isAvailable: boolean;
}

interface BookingCalendarProps {
  consultantId: string;
  consultantName: string;
  availableTimeSlots?: TimeSlot[];
  onSelectTimeSlot?: (
    timeSlotId: string,
    date: string,
    startTime: string,
    endTime: string,
  ) => void;
  loading?: boolean;
  selectedDate?: Dayjs;
  onDateChange?: (date: Dayjs) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  consultantId,
  consultantName,
  availableTimeSlots = [],
  onSelectTimeSlot,
  loading = false,
  selectedDate = dayjs(),
  onDateChange,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(
    selectedDate.startOf('month'),
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Update time slots when availableTimeSlots or selectedDate changes
  useEffect(() => {
    if (availableTimeSlots.length > 0) {
      const filteredSlots = availableTimeSlots.filter((slot) => {
        const slotDate = dayjs(slot.startTime);
        return (
          slotDate.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
        );
      });

      // Sort by start time
      const sortedSlots = [...filteredSlots].sort((a, b) => {
        return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf();
      });

      setTimeSlots(sortedSlots);
    } else {
      setTimeSlots([]);
    }
  }, [availableTimeSlots, selectedDate]);

  // Handle date selection
  const handleDateSelect = (date: Dayjs) => {
    if (onDateChange) {
      onDateChange(date);
    }
    setSelectedTimeSlot(null);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlotId: string) => {
    setSelectedTimeSlot(timeSlotId);

    // Open confirmation modal
    setIsModalVisible(true);
  };

  // Confirm booking
  const handleConfirmBooking = () => {
    if (!selectedTimeSlot) return;

    setConfirmLoading(true);

    // Find the selected time slot
    const timeSlot = timeSlots.find((slot) => slot.id === selectedTimeSlot);

    if (timeSlot && onSelectTimeSlot) {
      setTimeout(() => {
        onSelectTimeSlot(
          timeSlot.id,
          selectedDate.format('YYYY-MM-DD'),
          dayjs(timeSlot.startTime).format('HH:mm'),
          dayjs(timeSlot.endTime).format('HH:mm'),
        );
        setConfirmLoading(false);
        setIsModalVisible(false);
      }, 1000);
    } else {
      setConfirmLoading(false);
      setIsModalVisible(false);
    }
  };

  // Check if a date has available time slots
  const getDateAvailability = (date: Dayjs) => {
    const hasAvailableSlots = availableTimeSlots.some((slot) => {
      const slotDate = dayjs(slot.startTime);
      return (
        slotDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD') &&
        slot.isAvailable
      );
    });

    return hasAvailableSlots;
  };

  // Cell renderer for calendar
  const dateCellRender = (date: Dayjs) => {
    const hasAvailableSlots = getDateAvailability(date);

    if (hasAvailableSlots) {
      return (
        <div className="date-cell-content">
          <Badge status="success" />
        </div>
      );
    }

    return null;
  };

  // Disable dates in the past or without available time slots
  const disabledDate = (date: Dayjs) => {
    return date.isBefore(dayjs().startOf('day')) || !getDateAvailability(date);
  };

  // Header renderer for calendar
  const headerRender = ({ value, onChange }: any) => {
    const nextMonth = () => {
      const newMonth = value.add(1, 'month');
      onChange(newMonth);
      setSelectedMonth(newMonth);
    };

    const prevMonth = () => {
      const newMonth = value.subtract(1, 'month');
      onChange(newMonth);
      setSelectedMonth(newMonth);
    };

    return (
      <div className="calendar-header flex items-center justify-between px-4 py-2">
        <Button icon={<LeftOutlined />} onClick={nextMonth} />
        <Title level={5} className="m-0">
          {value.format('MMMM YYYY')}
        </Title>
        <Button icon={<RightOutlined />} onClick={prevMonth} />
      </div>
    );
  };

  return (
    <div className="booking-calendar">
      <div className="mb-4">
        <Alert
          message="راهنمای رزرو وقت"
          description={`لطفاً تاریخ و سپس ساعت مورد نظر خود را برای مشاوره با ${consultantName} انتخاب کنید. تاریخ‌های دارای زمان خالی با رنگ سبز مشخص شده‌اند.`}
          type="info"
          showIcon
        />
      </div>

      <div className="calendar-container mb-4">
        <Card bodyStyle={{ padding: 0 }}>
          <Calendar
            value={selectedDate}
            fullscreen={false}
            onSelect={handleDateSelect}
            dateCellRender={dateCellRender}
            disabledDate={disabledDate}
            headerRender={headerRender}
          />
        </Card>
      </div>

      <div className="time-slots">
        <Card
          title={
            <Space>
              <ClockCircleOutlined />
              <span>
                {selectedDate.format('dddd DD MMMM YYYY')}ساعت‌های در دسترس برای
              </span>
            </Space>
          }
          loading={loading}
        >
          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.id}
                  type={selectedTimeSlot === slot.id ? 'primary' : 'default'}
                  disabled={!slot.isAvailable}
                  onClick={() => handleTimeSlotSelect(slot.id)}
                  className="time-slot-button"
                >
                  {dayjs(slot.startTime).format('HH:mm')} -{' '}
                  {dayjs(slot.endTime).format('HH:mm')}
                </Button>
              ))}
            </div>
          ) : (
            <div className="empty-slots py-4 text-center">
              <InfoCircleOutlined className="mb-2 text-xl text-gray-400" />
              <p className="text-gray-500">
                {loading
                  ? 'در حال بارگذاری زمان‌های در دسترس...'
                  : 'هیچ زمان خالی برای این تاریخ وجود ندارد. لطفاً تاریخ دیگری را انتخاب کنید.'}
              </p>
            </div>
          )}
        </Card>
      </div>

      <Modal
        title="تایید رزرو وقت مشاوره"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            انصراف
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleConfirmBooking}
          >
            تایید و ادامه
          </Button>,
        ]}
      >
        {selectedTimeSlot && (
          <div>
            <p>آیا از رزرو این زمان مشاوره اطمینان دارید؟</p>
            <div className="booking-details bg-gray-50 mt-3 rounded-lg p-3">
              <p>
                <strong>مشاور:</strong> {consultantName}
              </p>
              <p>
                <strong>تاریخ:</strong>{' '}
                {selectedDate.format('dddd DD MMMM YYYY')}
              </p>
              <p>
                <strong>ساعت:</strong>{' '}
                {dayjs(
                  timeSlots.find((s) => s.id === selectedTimeSlot)?.startTime,
                ).format('HH:mm')}{' '}
                -{' '}
                {dayjs(
                  timeSlots.find((s) => s.id === selectedTimeSlot)?.endTime,
                ).format('HH:mm')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingCalendar;
