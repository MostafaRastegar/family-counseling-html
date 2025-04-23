import React, { useState } from 'react';
import {
  CalendarOutlined,
  DeleteOutlined,
  PlusOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  TimePicker,
  Typography,
  notification,
} from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import dayjs from 'dayjs';
import FormActions from '../ui/forms/FormActions';
import FormSection from '../ui/forms/FormSection';

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// روزهای هفته به فارسی
const weekdays = [
  { label: 'شنبه', value: '6' },
  { label: 'یکشنبه', value: '0' },
  { label: 'دوشنبه', value: '1' },
  { label: 'سه‌شنبه', value: '2' },
  { label: 'چهارشنبه', value: '3' },
  { label: 'پنج‌شنبه', value: '4' },
  { label: 'جمعه', value: '5' },
];

// انواع تکرار
enum RepeatType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

interface TimeSlot {
  id: string;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
}

interface AvailabilityFormProps {
  initialValues?: any;
  onSuccess?: (values: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  consultantId?: string;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  initialValues = {},
  onSuccess,
  onCancel,
  loading = false,
  consultantId,
}) => {
  const [form] = Form.useForm();
  const [repeatType, setRepeatType] = useState<RepeatType>(RepeatType.NONE);
  const [selectedWeekdays, setSelectedWeekdays] = useState<CheckboxValueType[]>(
    [],
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      startTime: dayjs().hour(9).minute(0),
      endTime: dayjs().hour(10).minute(0),
    },
  ]);

  // مقادیر پیش‌فرض برای فرم
  const defaultValues = {
    dateRange: null,
    repeatType: RepeatType.NONE,
    weekdays: [],
    repeatUntil: null,
    sessionDuration: 60,
    breakBetweenSessions: 15,
    maxSessionsPerDay: 8,
    ...initialValues,
  };

  // افزودن یک بازه زمانی جدید
  const addTimeSlot = () => {
    const lastSlot = timeSlots[timeSlots.length - 1];
    const newStartTime = lastSlot.endTime.clone().add(30, 'minute');
    const newEndTime = newStartTime.clone().add(1, 'hour');

    setTimeSlots([
      ...timeSlots,
      {
        id: Date.now().toString(),
        startTime: newStartTime,
        endTime: newEndTime,
      },
    ]);
  };

  // حذف یک بازه زمانی
  const removeTimeSlot = (id: string) => {
    if (timeSlots.length === 1) {
      notification.warning({
        message: 'حداقل یک بازه زمانی',
        description: 'حداقل یک بازه زمانی باید تعریف شود.',
      });
      return;
    }

    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  // به‌روزرسانی زمان شروع یک بازه زمانی
  const updateStartTime = (id: string, time: dayjs.Dayjs | null) => {
    if (!time) return;

    setTimeSlots(
      timeSlots.map((slot) => {
        if (slot.id === id) {
          return {
            ...slot,
            startTime: time,
            // اگر زمان شروع جدید بعد از زمان پایان باشد، زمان پایان را تنظیم می‌کنیم
            endTime: time.isAfter(slot.endTime)
              ? time.clone().add(1, 'hour')
              : slot.endTime,
          };
        }
        return slot;
      }),
    );
  };

  // به‌روزرسانی زمان پایان یک بازه زمانی
  const updateEndTime = (id: string, time: dayjs.Dayjs | null) => {
    if (!time) return;

    setTimeSlots(
      timeSlots.map((slot) => {
        if (slot.id === id) {
          return {
            ...slot,
            // اگر زمان پایان جدید قبل از زمان شروع باشد، زمان شروع را تنظیم می‌کنیم
            startTime: time.isBefore(slot.startTime)
              ? time.clone().subtract(1, 'hour')
              : slot.startTime,
            endTime: time,
          };
        }
        return slot;
      }),
    );
  };

  // تغییر نوع تکرار
  const handleRepeatTypeChange = (value: RepeatType) => {
    setRepeatType(value);

    // اگر نوع تکرار عوض شود، مقادیر مرتبط را تنظیم می‌کنیم
    if (value === RepeatType.NONE) {
      form.setFieldsValue({ weekdays: [], repeatUntil: null });
      setSelectedWeekdays([]);
    } else if (value === RepeatType.DAILY) {
      const allDays = weekdays.map((day) => day.value);
      form.setFieldsValue({ weekdays: allDays });
      setSelectedWeekdays(allDays);
    }
  };

  // تغییر روزهای هفته
  const handleWeekdaysChange = (values: CheckboxValueType[]) => {
    setSelectedWeekdays(values);
  };

  // ارسال فرم
  const handleSubmit = (values: any) => {
    // تبدیل بازه‌های زمانی به فرمت مناسب برای ارسال به سرور
    const formattedTimeSlots = timeSlots.map((slot) => ({
      startTime: slot.startTime.format('HH:mm'),
      endTime: slot.endTime.format('HH:mm'),
    }));

    // ادغام داده‌های فرم با بازه‌های زمانی
    const formData = {
      ...values,
      timeSlots: formattedTimeSlots,
      consultantId,
    };

    // در حالت واقعی، این داده‌ها به سرور ارسال می‌شوند
    console.log('Form data to submit:', formData);

    // شبیه‌سازی ارسال به سرور
    setTimeout(() => {
      notification.success({
        message: 'زمان‌های در دسترس ثبت شد',
        description: 'زمان‌های در دسترس شما با موفقیت ثبت شد.',
      });

      if (onSuccess) {
        onSuccess(formData);
      }
    }, 1000);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={defaultValues}
      onFinish={handleSubmit}
      className="availability-form"
    >
      <FormSection
        title="بازه زمانی"
        description="بازه زمانی و روزهای هفته را برای در دسترس بودن تعیین کنید"
      >
        <Form.Item
          name="dateRange"
          label="بازه تاریخ"
          rules={[{ required: true, message: 'لطفاً بازه تاریخ را مشخص کنید' }]}
        >
          <RangePicker
            className="w-full"
            format="YYYY/MM/DD"
            placeholder={['تاریخ شروع', 'تاریخ پایان']}
            disabledDate={(current) => {
              // غیرفعال کردن تاریخ‌های گذشته
              return current && current < dayjs().startOf('day');
            }}
          />
        </Form.Item>

        <Form.Item name="repeatType" label="تکرار">
          <Radio.Group onChange={(e) => handleRepeatTypeChange(e.target.value)}>
            <Space direction="vertical">
              <Radio value={RepeatType.NONE}>
                بدون تکرار (فقط تاریخ‌های انتخاب شده)
              </Radio>
              <Radio value={RepeatType.DAILY}>هر روز</Radio>
              <Radio value={RepeatType.WEEKLY}>روزهای خاص هفته</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        {repeatType === RepeatType.WEEKLY && (
          <Form.Item
            name="weekdays"
            label="روزهای هفته"
            rules={[
              {
                required: true,
                message: 'لطفاً حداقل یک روز از هفته را انتخاب کنید',
              },
            ]}
          >
            <Checkbox.Group
              options={weekdays}
              onChange={handleWeekdaysChange}
              className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7"
            />
          </Form.Item>
        )}

        {(repeatType === RepeatType.DAILY ||
          repeatType === RepeatType.WEEKLY) && (
          <Form.Item
            name="repeatUntil"
            label="تکرار تا تاریخ"
            rules={[
              {
                required: true,
                message: 'لطفاً تاریخ پایان تکرار را مشخص کنید',
              },
            ]}
          >
            <DatePicker
              className="w-full"
              format="YYYY/MM/DD"
              placeholder="تاریخ پایان تکرار"
              disabledDate={(current) => {
                const startDate = form.getFieldValue('dateRange')?.[0];
                // غیرفعال کردن تاریخ‌های قبل از تاریخ شروع
                return (
                  current &&
                  (current < dayjs().startOf('day') ||
                    (startDate && current < startDate))
                );
              }}
            />
          </Form.Item>
        )}
      </FormSection>

      <FormSection
        title="بازه‌های زمانی"
        description="ساعت‌های در دسترس خود را در هر روز تعیین کنید"
      >
        <div className="mb-4">
          <Alert
            message="راهنمای تنظیم ساعات"
            description="می‌توانید چند بازه زمانی مختلف برای هر روز تعریف کنید. مثلاً 9 تا 12 و 15 تا 18."
            type="info"
            showIcon
          />
        </div>

        {timeSlots.map((slot, index) => (
          <div
            key={slot.id}
            className="time-slot-item mb-4 rounded-md border border-dashed border-gray-300 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <Text strong>بازه زمانی {index + 1}</Text>
              {timeSlots.length > 1 && (
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeTimeSlot(slot.id)}
                />
              )}
            </div>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="از ساعت" required className="mb-0">
                  <TimePicker
                    className="w-full"
                    format="HH:mm"
                    minuteStep={15}
                    value={slot.startTime}
                    onChange={(time) => updateStartTime(slot.id, time)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="تا ساعت" required className="mb-0">
                  <TimePicker
                    className="w-full"
                    format="HH:mm"
                    minuteStep={15}
                    value={slot.endTime}
                    onChange={(time) => updateEndTime(slot.id, time)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        ))}

        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={addTimeSlot}
          className="mt-4"
        >
          افزودن بازه زمانی جدید
        </Button>
      </FormSection>

      <FormSection
        title="تنظیمات پیشرفته"
        description="تنظیمات بیشتر برای جلسات مشاوره"
      >
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="sessionDuration"
              label="مدت هر جلسه (دقیقه)"
              rules={[
                { required: true, message: 'لطفاً مدت هر جلسه را مشخص کنید' },
              ]}
            >
              <Select placeholder="مدت هر جلسه">
                <Option value={30}>30 دقیقه</Option>
                <Option value={45}>45 دقیقه</Option>
                <Option value={60}>1 ساعت</Option>
                <Option value={90}>1 ساعت و 30 دقیقه</Option>
                <Option value={120}>2 ساعت</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="breakBetweenSessions"
              label="استراحت بین جلسات (دقیقه)"
              rules={[
                {
                  required: true,
                  message: 'لطفاً زمان استراحت بین جلسات را مشخص کنید',
                },
              ]}
            >
              <Select placeholder="استراحت بین جلسات">
                <Option value={0}>بدون استراحت</Option>
                <Option value={5}>5 دقیقه</Option>
                <Option value={10}>10 دقیقه</Option>
                <Option value={15}>15 دقیقه</Option>
                <Option value={30}>30 دقیقه</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="maxSessionsPerDay"
              label="حداکثر تعداد جلسات در روز"
              rules={[
                {
                  required: true,
                  message: 'لطفاً حداکثر تعداد جلسات در روز را مشخص کنید',
                },
              ]}
            >
              <InputNumber
                min={1}
                max={20}
                className="w-full"
                placeholder="حداکثر تعداد جلسات"
              />
            </Form.Item>
          </Col>
        </Row>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        loading={loading}
        submitText="ثبت زمان‌های در دسترس"
      />
    </Form>
  );
};

export default AvailabilityForm;
