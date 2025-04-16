'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Calendar,
  Card,
  Empty,
  List,
  Radio,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

// تبدیل زمان 24 ساعته به فرمت نمایشی
const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

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

const AvailabilityCalendar = ({ consultantId, onSelectTimeSlot }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [viewMode, setViewMode] = useState('client'); // client یا consultant

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      // در حالت واقعی، داده‌ها بر اساس consultantId از API دریافت می‌شوند
      setAvailabilities(mockAvailabilities);
      setLoading(false);
    }, 1000);
  }, [consultantId]);

  // تغییر تاریخ انتخاب شده
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // پاکسازی زمان انتخاب شده
  };

  // انتخاب زمان
  const handleTimeSlotSelect = (timeSlot) => {
    if (timeSlot.isAvailable && !timeSlot.isBooked) {
      setSelectedTimeSlot(timeSlot);
      if (onSelectTimeSlot) {
        onSelectTimeSlot(timeSlot);
      }
    }
  };

  // تبدیل زمان‌ها به فرمت مناسب برای نمایش در تقویم
  const dateCellRender = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    const daysAvailabilities = availabilities.filter((item) => {
      const itemDate = dayjs(item.startTime).format('YYYY-MM-DD');
      return itemDate === dateString;
    });

    if (daysAvailabilities.length === 0) {
      return null;
    }

    // شمارش زمان‌های در دسترس و رزرو شده
    const availableCount = daysAvailabilities.filter(
      (item) => item.isAvailable && !item.isBooked,
    ).length;
    const bookedCount = daysAvailabilities.filter(
      (item) => item.isBooked,
    ).length;

    return (
      <ul className="events">
        {availableCount > 0 && (
          <li>
            <Badge status="success" text={`${availableCount} زمان در دسترس`} />
          </li>
        )}
        {bookedCount > 0 && (
          <li>
            <Badge status="warning" text={`${bookedCount} زمان رزرو شده`} />
          </li>
        )}
      </ul>
    );
  };

  // فیلتر کردن زمان‌های روز انتخاب شده
  const getSelectedDateTimeSlots = () => {
    const dateString = selectedDate.format('YYYY-MM-DD');
    return availabilities
      .filter((item) => {
        const itemDate = dayjs(item.startTime).format('YYYY-MM-DD');
        return itemDate === dateString;
      })
      .sort((a, b) => {
        // مرتب‌سازی بر اساس زمان شروع
        return dayjs(a.startTime).diff(dayjs(b.startTime));
      });
  };

  // زمان‌های روز انتخاب شده
  const selectedDateTimeSlots = getSelectedDateTimeSlots();

  return (
    <div className="availability-calendar">
      {viewMode === 'consultant' && (
        <div className="mb-4">
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="client">نمای مراجع</Radio.Button>
            <Radio.Button value="consultant">نمای مشاور</Radio.Button>
          </Radio.Group>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <Calendar
              fullscreen={false}
              onSelect={handleDateChange}
              dateCellRender={dateCellRender}
              value={selectedDate}
            />
          </Card>
        </div>

        <div>
          <Card
            title={`زمان‌های ${selectedDate.format('YYYY/MM/DD')}`}
            loading={loading}
          >
            {loading ? (
              <div className="py-8 text-center">
                <Spin />
              </div>
            ) : selectedDateTimeSlots.length > 0 ? (
              <List
                dataSource={selectedDateTimeSlots}
                renderItem={(item) => {
                  const startTime = dayjs(item.startTime).format('HH:mm');
                  const endTime = dayjs(item.endTime).format('HH:mm');
                  const isSelected =
                    selectedTimeSlot && selectedTimeSlot.id === item.id;

                  return (
                    <List.Item
                      className={`mb-2 rounded border p-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} 
                      ${!item.isAvailable ? 'opacity-50' : ''}`}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <Space>
                            <ClockCircleOutlined />
                            <Text strong>
                              {startTime} - {endTime}
                            </Text>
                          </Space>

                          {item.isBooked ? (
                            <Tag color="warning">رزرو شده</Tag>
                          ) : item.isAvailable ? (
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
                              disabled={!item.isAvailable || item.isBooked}
                              onClick={() => handleTimeSlotSelect(item)}
                            >
                              {isSelected ? 'انتخاب شده' : 'انتخاب'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="هیچ زمانی برای این روز تنظیم نشده است"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
