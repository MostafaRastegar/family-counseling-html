'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Empty, Modal, Tabs, notification } from 'antd';
import type { TabsProps } from 'antd';
import AvailabilityCalendar from '@/components/consultants/AvailabilityCalendar';
import AvailabilityForm from '@/components/consultants/AvailabilityForm';
import PageHeader from '@/components/ui/PageHeader';
import { authData } from '@/mocks/auth';
import { availabilities } from '@/mocks/availabilities';
import { consultants } from '@/mocks/consultants';

export default function ConsultantAvailabilityPage() {
  const router = useRouter();

  // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
  // اما فعلاً از داده‌های نمونه استفاده می‌کنیم
  const { currentUser } = authData;

  // یافتن اطلاعات مشاور برای کاربر جاری
  const consultantData = consultants.find((c) => c.userId === currentUser?.id);

  const [activeKey, setActiveKey] = useState('calendar');
  const [loading, setLoading] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);

  // شبیه‌سازی افزودن زمان‌های جدید
  const handleAddAvailability = (data: any) => {
    setLoading(true);
    // شبیه‌سازی تأخیر API
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'زمان‌ها با موفقیت اضافه شدند',
        description: 'زمان‌های در دسترس شما با موفقیت ثبت شدند.',
      });
      setIsFormModalVisible(false);
    }, 1500);
  };

  // شبیه‌سازی حذف یک زمان در دسترس
  const handleRemoveAvailability = (id: string) => {
    setLoading(true);
    // شبیه‌سازی تأخیر API
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'زمان با موفقیت حذف شد',
        description: 'زمان مورد نظر با موفقیت حذف شد.',
      });
    }, 1000);
  };

  // تب‌های مدیریت زمان‌های در دسترس
  const items: TabsProps['items'] = [
    {
      key: 'calendar',
      label: 'تقویم زمان‌های در دسترس',
      children: (
        <Card>
          <AvailabilityCalendar
            consultantId={consultantData?.id}
            onAddAvailability={(data) =>
              console.log('Added availabilities:', data)
            }
            onRemoveAvailability={handleRemoveAvailability}
            loading={loading}
            editable={true}
            showAddButton={true}
          />
        </Card>
      ),
    },
    {
      key: 'upcoming',
      label: 'زمان‌های آینده',
      children: (
        <Card>
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-medium">
              زمان‌های در دسترس آینده
            </h3>
            <p className="text-gray-500">
              در این بخش می‌توانید زمان‌های در دسترس خود را در روزهای آینده
              مشاهده کنید.
            </p>
          </div>

          {availabilities.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availabilities
                .filter((a) => new Date(a.startTime) > new Date())
                .sort(
                  (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime(),
                )
                .map((availability) => (
                  <Card
                    key={availability.id}
                    size="small"
                    className={`border ${availability.isAvailable ? 'border-green-300' : 'border-red-300'}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarOutlined className="mr-2 text-gray-500" />
                        <span className="font-medium">
                          {new Date(availability.startTime).toLocaleDateString(
                            'fa-IR',
                          )}
                        </span>
                      </div>
                      <div>
                        {availability.isAvailable ? (
                          <span className="text-green-500 bg-green-50 rounded-full px-2 py-1 text-xs font-medium">
                            آزاد
                          </span>
                        ) : (
                          <span className="text-red-500 bg-red-50 rounded-full px-2 py-1 text-xs font-medium">
                            رزرو شده
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">از ساعت:</span>{' '}
                        <span className="font-medium">
                          {new Date(availability.startTime).toLocaleTimeString(
                            'fa-IR',
                            { hour: '2-digit', minute: '2-digit' },
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">تا ساعت:</span>{' '}
                        <span className="font-medium">
                          {new Date(availability.endTime).toLocaleTimeString(
                            'fa-IR',
                            { hour: '2-digit', minute: '2-digit' },
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          ) : (
            <Empty
              description="هیچ زمانی برای آینده تنظیم نشده است"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>
      ),
    },
  ];

  // اکشن‌های صفحه
  const pageActions = [
    {
      key: 'add',
      text: 'افزودن زمان جدید',
      icon: <PlusOutlined />,
      onClick: () => setIsFormModalVisible(true),
      type: 'primary' as const,
    },
  ];

  // اگر کاربر مشاور نباشد، پیام مناسب نمایش داده می‌شود
  if (currentUser?.role !== 'consultant') {
    return (
      <div className="my-20 text-center">
        <h2 className="mb-2 text-2xl font-semibold">صفحه مختص مشاوران</h2>
        <p className="text-gray-500">
          این صفحه فقط برای کاربران با نقش مشاور قابل دسترسی است.
        </p>
      </div>
    );
  }

  return (
    <div className="consultant-availability-page">
      <PageHeader
        title="مدیریت زمان‌های در دسترس"
        subtitle="زمان‌هایی که برای ارائه مشاوره در دسترس هستید را مدیریت کنید"
        actions={pageActions}
      />

      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={setActiveKey}
        type="card"
        className="availability-tabs"
        destroyInactiveTabPane
      />

      <Modal
        title="افزودن زمان‌های جدید"
        open={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        footer={null}
        width={800}
      >
        <AvailabilityForm
          consultantId={consultantData?.id}
          onSuccess={handleAddAvailability}
          onCancel={() => setIsFormModalVisible(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
