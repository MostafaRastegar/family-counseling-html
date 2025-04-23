import React, { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Calendar,
  Card,
  Col,
  Dropdown,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import { availabilities as mockAvailabilities } from '@/mocks/availabilities';

dayjs.locale('fa');

const { Text, Title } = Typography;
const { Option } = Select;

// تعریف انواع وضعیت زمان‌ها
enum AvailabilityStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  UNAVAILABLE = 'unavailable',
}

// تعریف ساختار داده زمان در دسترس
interface AvailabilityTime {
  id: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isAvailable: boolean;
}

interface AvailabilityCalendarProps {
  consultantId?: string;
  onAddAvailability?: (data: { date: string; timeSlots: string[] }) => void;
  onRemoveAvailability?: (id: string) => void;
  loading?: boolean;
  editable?: boolean;
  showAddButton?: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  consultantId,
  onAddAvailability,
  onRemoveAvailability,
  loading = false,
  editable = true,
  showAddButton = true,
}) => {
  // استفاده از state برای مدیریت داده‌ها و وضعیت‌ها
  const [availabilities, setAvailabilities] = useState<AvailabilityTime[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [calendarMode, setCalendarMode] = useState<'month' | 'year'>('month');

  // بارگذاری داده‌های نمونه
  useEffect(() => {
    // در حالت واقعی این داده‌ها از API دریافت می‌شوند
    // اما فعلاً از داده‌های نمونه استفاده می‌کنیم
    const loadedAvailabilities = mockAvailabilities.map((item) => ({
      id: item.id,
      startTime: item.startTime,
      endTime: item.endTime,
      isAvailable: item.isAvailable,
    }));
    setAvailabilities(loadedAvailabilities);
  }, [consultantId]);

  // نمایش مودال افزودن زمان جدید
  const showAddModal = (date: Dayjs) => {
    setSelectedDate(date);
    setSelectedTimeSlots([]);
    setIsModalVisible(true);
  };

  // بستن مودال
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // ثبت زمان‌های جدید
  const handleAddAvailability = () => {
    if (selectedTimeSlots.length === 0) return;

    if (onAddAvailability) {
      onAddAvailability({
        date: selectedDate.format('YYYY-MM-DD'),
        timeSlots: selectedTimeSlots,
      });
    }

    // شبیه‌سازی افزودن زمان‌های جدید (در حالت واقعی این عملیات توسط API انجام می‌شود)
    const newAvailabilities = [...availabilities];

    selectedTimeSlots.forEach((timeSlot) => {
      const [startHour, endHour] = timeSlot.split('-');
      const startTime = selectedDate
        .hour(parseInt(startHour))
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();
      const endTime = selectedDate
        .hour(parseInt(endHour))
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();

      newAvailabilities.push({
        id: `new-avail-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        startTime,
        endTime,
        isAvailable: true,
      });
    });

    setAvailabilities(newAvailabilities);
    setIsModalVisible(false);
  };

  // حذف یک زمان در دسترس
  const handleRemoveAvailability = (id: string) => {
    if (onRemoveAvailability) {
      onRemoveAvailability(id);
    }

    // شبیه‌سازی حذف زمان (در حالت واقعی این عملیات توسط API انجام می‌شود)
    const newAvailabilities = availabilities.filter((item) => item.id !== id);
    setAvailabilities(newAvailabilities);
  };

  // تولید بازه‌های زمانی برای انتخاب در مودال
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i < 22; i++) {
      slots.push(`${i}-${i + 1}`);
    }
    return slots;
  };

  // بررسی وضعیت زمانی یک روز
  const getDayAvailabilityStatus = (date: Dayjs) => {
    const dayAvailabilities = availabilities.filter((item) => {
      const itemDate = dayjs(item.startTime);
      return itemDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    });

    // اگر هیچ زمانی برای این روز تعریف نشده باشد
    if (dayAvailabilities.length === 0) {
      return null;
    }

    // اگر همه زمان‌ها رزرو شده باشند
    const allBooked = dayAvailabilities.every((item) => !item.isAvailable);
    if (allBooked) {
      return AvailabilityStatus.BOOKED;
    }

    // اگر برخی زمان‌ها رزرو شده و برخی آزاد باشند
    const hasBooked = dayAvailabilities.some((item) => !item.isAvailable);
    if (hasBooked) {
      return AvailabilityStatus.UNAVAILABLE;
    }

    // اگر همه زمان‌ها آزاد باشند
    return AvailabilityStatus.AVAILABLE;
  };

  // تنظیم محتوای سلول‌های تقویم
  const dateCellRender = (date: Dayjs) => {
    const status = getDayAvailabilityStatus(date);

    if (!status) {
      return null;
    }

    let badgeStatus: any;
    let badgeText = '';

    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        badgeStatus = 'success';
        badgeText = 'در دسترس';
        break;
      case AvailabilityStatus.BOOKED:
        badgeStatus = 'error';
        badgeText = 'رزرو شده';
        break;
      case AvailabilityStatus.UNAVAILABLE:
        badgeStatus = 'warning';
        badgeText = 'نیمه پر';
        break;
    }

    return (
      <div className="calendar-date-cell">
        <Badge status={badgeStatus} text={badgeText} />
      </div>
    );
  };

  // محتوای پس از کلیک روی هر روز
  const getDayAvailabilities = (date: Dayjs) => {
    return availabilities.filter((item) => {
      const itemDate = dayjs(item.startTime);
      return itemDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    });
  };

  // رویداد کلیک روی روز تقویم
  const handleDateSelect = (date: Dayjs) => {
    if (!editable) return;

    // بررسی آیا این روز در گذشته است
    if (date.isBefore(dayjs(), 'day')) {
      Modal.info({
        title: 'روز گذشته',
        content: 'امکان تنظیم زمان برای روزهای گذشته وجود ندارد.',
        okText: 'متوجه شدم',
      });
      return;
    }

    showAddModal(date);
  };

  // رندر محتوای فول اسکرین برای هر روز
  const renderFullDayContent = (date: Dayjs) => {
    const dayAvailabilities = getDayAvailabilities(date);

    if (dayAvailabilities.length === 0) {
      return (
        <div className="py-4 text-center">
          <InfoCircleOutlined className="mb-2 text-2xl text-gray-400" />
          <p className="text-gray-500">هیچ زمانی برای این روز تنظیم نشده است</p>
          {editable && showAddButton && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showAddModal(date)}
            >
              افزودن زمان
            </Button>
          )}
        </div>
      );
    }

    // مرتب‌سازی بر اساس زمان شروع
    dayAvailabilities.sort((a, b) => {
      return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf();
    });

    return (
      <div className="day-availabilities p-4">
        <div className="mb-4 flex items-center justify-between">
          <Title level={5} className="m-0">
            زمان‌های {date.format('dddd، D MMMM YYYY')}
          </Title>
          {editable && showAddButton && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showAddModal(date)}
            >
              افزودن زمان
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {dayAvailabilities.map((item) => (
            <Card
              key={item.id}
              size="small"
              className={`availability-card ${
                item.isAvailable ? 'border-green-300' : 'border-red-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Space>
                  <ClockCircleOutlined
                    className={
                      item.isAvailable ? 'text-green-500' : 'text-red-500'
                    }
                  />
                  <Text>
                    {dayjs(item.startTime).format('HH:mm')} تا{' '}
                    {dayjs(item.endTime).format('HH:mm')}
                  </Text>
                </Space>
                <Space>
                  {item.isAvailable ? (
                    <Badge
                      status="success"
                      text={<Text type="success">آزاد</Text>}
                    />
                  ) : (
                    <Badge
                      status="error"
                      text={<Text type="danger">رزرو شده</Text>}
                    />
                  )}

                  {editable && item.isAvailable && (
                    <Tooltip title="حذف این زمان">
                      <Button
                        type="text"
                        danger
                        icon={<CloseCircleOutlined />}
                        size="small"
                        onClick={() => handleRemoveAvailability(item.id)}
                      />
                    </Tooltip>
                  )}
                </Space>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const timeSlotsOptions = generateTimeSlots();

  return (
    <div className="availability-calendar">
      <div className="mb-4 flex flex-wrap justify-between">
        <div>
          <Radio.Group
            value={calendarMode}
            onChange={(e) => setCalendarMode(e.target.value)}
          >
            <Radio.Button value="month">ماه</Radio.Button>
            <Radio.Button value="year">سال</Radio.Button>
          </Radio.Group>
        </div>

        {editable && showAddButton && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showAddModal(dayjs())}
          >
            افزودن زمان جدید
          </Button>
        )}
      </div>

      <div className="calendar-container overflow-hidden rounded-lg bg-white shadow-sm">
        <Calendar
          mode={calendarMode}
          dateCellRender={dateCellRender}
          onSelect={handleDateSelect}
          disabledDate={(current) =>
            current && current.isBefore(dayjs(), 'day')
          }
          fullscreen={true}
          headerRender={({ value, type, onChange, onTypeChange }) => (
            <div className="calendar-header border-b border-gray-200 p-4">
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4} className="m-0">
                    {value.format(type === 'month' ? 'MMMM YYYY' : 'YYYY')}
                  </Title>
                </Col>
                <Col>
                  <Space>
                    <Button
                      type="text"
                      onClick={() => {
                        const newValue = value.clone().subtract(1, type);
                        onChange(newValue);
                      }}
                    >
                      قبلی
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        const newValue = value.clone().add(1, type);
                        onChange(newValue);
                      }}
                    >
                      بعدی
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        onChange(dayjs());
                      }}
                    >
                      امروز
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>
          )}
        />

        {selectedDate && (
          <div className="selected-day-content border-t border-gray-200 p-4">
            {renderFullDayContent(selectedDate)}
          </div>
        )}
      </div>

      <Modal
        title={`افزودن زمان جدید - ${selectedDate.format('dddd، D MMMM YYYY')}`}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleAddAvailability}
        okText="ثبت زمان‌ها"
        cancelText="انصراف"
        okButtonProps={{ disabled: selectedTimeSlots.length === 0 }}
      >
        <Alert
          message="راهنما"
          description="زمان‌های مورد نظر خود را برای این روز انتخاب کنید. برای هر زمان انتخاب شده، یک بازه یک ساعته در نظر گرفته می‌شود."
          type="info"
          showIcon
          className="mb-4"
        />

        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="زمان‌های مورد نظر را انتخاب کنید"
          value={selectedTimeSlots}
          onChange={setSelectedTimeSlots}
          optionLabelProp="label"
        >
          {timeSlotsOptions.map((slot) => {
            const [startHour, endHour] = slot.split('-');
            return (
              <Option
                key={slot}
                value={slot}
                label={`${startHour}:00 تا ${endHour}:00`}
              >
                <div className="flex items-center">
                  <ClockCircleOutlined className="mr-1" />
                  <span>{`${startHour}:00 تا ${endHour}:00`}</span>
                </div>
              </Option>
            );
          })}
        </Select>

        <div className="mt-4">
          <Text type="secondary">
            {selectedTimeSlots.length === 0
              ? 'هیچ زمانی انتخاب نشده است'
              : `${selectedTimeSlots.length} زمان انتخاب شده است`}
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default AvailabilityCalendar;
