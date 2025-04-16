'use client';

import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Calendar,
  Card,
  DatePicker,
  Divider,
  Form,
  List,
  Modal,
  Popconfirm,
  Select,
  Space,
  TimePicker,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/fa';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(locale);

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = TimePicker;
const { Option } = Select;

// داده‌های نمونه برای زمان‌های در دسترس
const mockAvailabilities = [
  {
    id: 1,
    startTime: '2025-04-20T10:00:00',
    endTime: '2025-04-20T12:00:00',
    isAvailable: true,
  },
  {
    id: 2,
    startTime: '2025-04-20T14:00:00',
    endTime: '2025-04-20T16:00:00',
    isAvailable: true,
  },
  {
    id: 3,
    startTime: '2025-04-21T09:00:00',
    endTime: '2025-04-21T11:00:00',
    isAvailable: true,
  },
  {
    id: 4,
    startTime: '2025-04-22T13:00:00',
    endTime: '2025-04-22T15:00:00',
    isAvailable: true,
  },
  {
    id: 5,
    startTime: '2025-04-23T10:00:00',
    endTime: '2025-04-23T12:00:00',
    isAvailable: false,
  },
];

export default function ConsultantAvailabilities() {
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setAvailabilities(mockAvailabilities);
  }, []);

  // باز کردن مودال ایجاد یا ویرایش
  const showModal = (availability = null) => {
    setEditingAvailability(availability);
    setIsEditing(!!availability);

    if (availability) {
      form.setFieldsValue({
        date: dayjs(availability.startTime.split('T')[0]),
        timeRange: [dayjs(availability.startTime), dayjs(availability.endTime)],
        isAvailable: availability.isAvailable,
      });
    } else {
      form.setFieldsValue({
        date: selectedDate,
        timeRange: [dayjs().hour(9).minute(0), dayjs().hour(10).minute(0)],
        isAvailable: true,
      });
    }

    setModalVisible(true);
  };

  // ذخیره زمان‌های در دسترس
  const handleSave = (values) => {
    setLoading(true);

    const { date, timeRange, isAvailable } = values;
    const startDate = date.format('YYYY-MM-DD');
    const startTime = timeRange[0].format('HH:mm');
    const endTime = timeRange[1].format('HH:mm');

    const newAvailability = {
      id: isEditing ? editingAvailability.id : Date.now(),
      startTime: `${startDate}T${startTime}:00`,
      endTime: `${startDate}T${endTime}:00`,
      isAvailable,
    };

    setTimeout(() => {
      if (isEditing) {
        // ویرایش زمان موجود
        setAvailabilities(
          availabilities.map((item) =>
            item.id === editingAvailability.id ? newAvailability : item,
          ),
        );
        message.success('زمان با موفقیت ویرایش شد!');
      } else {
        // افزودن زمان جدید
        setAvailabilities([...availabilities, newAvailability]);
        message.success('زمان جدید با موفقیت اضافه شد!');
      }

      setModalVisible(false);
      setLoading(false);
    }, 1000);
  };

  // حذف زمان
  const handleDelete = (id) => {
    setAvailabilities(availabilities.filter((item) => item.id !== id));
    message.success('زمان مورد نظر با موفقیت حذف شد!');
  };

  // داده‌های تقویم
  const dateCellRender = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dateAvailabilities = availabilities.filter((item) => {
      const itemDate = item.startTime.split('T')[0];
      return itemDate === dateStr;
    });

    if (dateAvailabilities.length === 0) {
      return null;
    }

    return (
      <ul className="events">
        {dateAvailabilities.map((item) => (
          <li key={item.id}>
            <Badge
              status={item.isAvailable ? 'success' : 'error'}
              text={`${item.startTime.split('T')[1].substring(0, 5)} - ${item.endTime.split('T')[1].substring(0, 5)}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  // نمایش رویدادهای یک روز
  const getDateAvailabilities = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return availabilities.filter((item) => {
      const itemDate = item.startTime.split('T')[0];
      return itemDate === dateStr;
    });
  };

  // زمان انتخاب شده در تقویم
  const selectedDateAvailabilities = getDateAvailabilities(selectedDate);

  return (
    <div className="container mx-auto">
      <Title level={2}>مدیریت زمان‌های در دسترس</Title>
      <Paragraph className="mb-8 text-gray-500">
        در این بخش می‌توانید زمان‌های در دسترس خود را برای مشاوره تنظیم کنید.
      </Paragraph>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* تقویم */}
        <Card className="md:w-2/3">
          <Calendar
            dateCellRender={dateCellRender}
            onChange={setSelectedDate}
            value={selectedDate}
          />
        </Card>

        {/* زمان‌های روز انتخاب شده */}
        <Card
          title={`زمان‌های ${selectedDate.format('YYYY/MM/DD')}`}
          className="md:w-1/3"
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="mb-4"
            onClick={() => showModal()}
            block
          >
            افزودن زمان جدید
          </Button>

          {selectedDateAvailabilities.length === 0 ? (
            <div className="py-8 text-center">
              <Text type="secondary">
                هیچ زمانی برای این روز تنظیم نشده است
              </Text>
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={selectedDateAvailabilities}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="edit"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => showModal(item)}
                    />,
                    <Popconfirm
                      key="delete"
                      title="آیا از حذف این زمان مطمئن هستید؟"
                      onConfirm={() => handleDelete(item.id)}
                      okText="بله"
                      cancelText="خیر"
                    >
                      <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<ClockCircleOutlined className="mt-1 text-lg" />}
                    title={
                      <Space>
                        <span>{`${item.startTime.split('T')[1].substring(0, 5)} - ${item.endTime.split('T')[1].substring(0, 5)}`}</span>
                        <Badge
                          status={item.isAvailable ? 'success' : 'error'}
                          text={item.isAvailable ? 'در دسترس' : 'غیرفعال'}
                        />
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      {/* مودال افزودن/ویرایش زمان */}
      <Modal
        title={isEditing ? 'ویرایش زمان' : 'افزودن زمان جدید'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="date"
            label="تاریخ"
            rules={[{ required: true, message: 'لطفاً تاریخ را انتخاب کنید' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="زمان"
            rules={[
              { required: true, message: 'لطفاً بازه زمانی را انتخاب کنید' },
            ]}
          >
            <RangePicker format="HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item
            name="isAvailable"
            label="وضعیت"
            rules={[{ required: true, message: 'لطفاً وضعیت را انتخاب کنید' }]}
            initialValue={true}
          >
            <Select>
              <Option value={true}>در دسترس</Option>
              <Option value={false}>غیرفعال</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-left">
            <Space>
              <Button onClick={() => setModalVisible(false)}>انصراف</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'ویرایش' : 'افزودن'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
