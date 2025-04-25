'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  notification,
  Spin
} from 'antd';
import {
  CalendarOutlined,
  MessageOutlined,
  SaveOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import FormSection from '@/components/ui/forms/FormSection';
import FormActions from '@/components/ui/forms/FormActions';
import { sessions as mockSessions } from '@/mocks/sessions';
import { consultants as mockConsultants } from '@/mocks/consultants';
import { clients as mockClients } from '@/mocks/clients';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function AdminSessionEditPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.session_id as string;
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // بارگذاری اطلاعات جلسه و لیست مشاوران و مراجعان
  useEffect(() => {
    // شبیه‌سازی درخواست API
    const timer = setTimeout(() => {
      // یافتن اطلاعات جلسه
      const foundSession = mockSessions.find(s => s.id === sessionId);
      setSession(foundSession || null);

      // تنظیم لیست مشاوران و مراجعان
      setConsultants(mockConsultants);
      setClients(mockClients);

      // تنظیم مقادیر اولیه فرم
      if (foundSession) {
        form.setFieldsValue({
          consultantId: foundSession.consultantId,
          clientId: foundSession.clientId,
          date: dayjs(foundSession.date),
          status: foundSession.status,
          messengerType: foundSession.messengerType || undefined,
          messengerId: foundSession.messengerId || undefined,
          notes: foundSession.notes || undefined,
        });
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sessionId, form]);

  // رویداد بازگشت به صفحه قبل
  const handleBack = () => {
    router.push(`/dashboard/admin/sessions/${sessionId}`);
  };

  // رویداد ارسال فرم و ذخیره تغییرات
  const handleSubmit = async (values: any) => {
    setSubmitting(true);

    try {
      // شبیه‌سازی ارسال به API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // تبدیل تاریخ و زمان به فرمت مناسب
      const formattedValues = {
        ...values,
        date: values.date.toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // در حالت واقعی اینجا به API ارسال می‌شود
      console.log('Sending to API:', formattedValues);

      // به‌روزرسانی اطلاعات جلسه در state
      setSession(prev => ({ ...prev, ...formattedValues }));

      // نمایش پیام موفقیت
      notification.success({
        message: 'تغییرات ذخیره شد',
        description: 'اطلاعات جلسه با موفقیت به‌روزرسانی شد.',
      });

      // بازگشت به صفحه جزئیات جلسه
      router.push(`/dashboard/admin/sessions/${sessionId}`);
    } catch (error) {
      notification.error({
        message: 'خطا در ذخیره تغییرات',
        description: 'متأسفانه در ذخیره تغییرات خطایی رخ داده است. لطفا مجددا تلاش کنید.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // اگر در حال بارگذاری است
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spin size="large" tip="در حال بارگذاری اطلاعات..." />
      </div>
    );
  }

  // اگر جلسه یافت نشد
  if (!session) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <Title level={4}>جلسه مورد نظر یافت نشد</Title>
          <Button type="primary" onClick={() => router.push('/dashboard/admin/sessions')} className="mt-4">
            بازگشت به لیست جلسات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-session-edit-page">
      <DashboardBreadcrumb />

      <AdminPageHeader
        title="ویرایش جلسه مشاوره"
        subtitle={`ویرایش اطلاعات جلسه مشاوره بین ${session.consultant.user.fullName} و ${session.client.user.fullName}`}
        backButton={{
          onClick: handleBack,
          text: 'بازگشت به صفحه جلسه',
        }}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            consultantId: session.consultantId,
            clientId: session.clientId,
            date: dayjs(session.date),
            status: session.status,
            messengerType: session.messengerType || undefined,
            messengerId: session.messengerId || undefined,
            notes: session.notes || undefined,
          }}
        >
          <FormSection 
            title="اطلاعات اصلی جلسه" 
            description="اطلاعات اصلی جلسه مشاوره را ویرایش کنید"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="consultantId"
                  label="مشاور"
                  rules={[{ required: true, message: 'لطفا مشاور را انتخاب کنید' }]}
                >
                  <Select 
                    placeholder="انتخاب مشاور" 
                    optionFilterProp="children"
                    showSearch
                  >
                    {consultants.map(consultant => (
                      <Option key={consultant.id} value={consultant.id}>
                        {consultant.user.fullName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="clientId"
                  label="مراجع"
                  rules={[{ required: true, message: 'لطفا مراجع را انتخاب کنید' }]}
                >
                  <Select 
                    placeholder="انتخاب مراجع" 
                    optionFilterProp="children"
                    showSearch
                  >
                    {clients.map(client => (
                      <Option key={client.id} value={client.id}>
                        {client.user.fullName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="date"
                  label="تاریخ و زمان جلسه"
                  rules={[{ required: true, message: 'لطفا تاریخ و زمان جلسه را انتخاب کنید' }]}
                >
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY/MM/DD HH:mm"
                    placeholder="انتخاب تاریخ و زمان"
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="status"
                  label="وضعیت جلسه"
                  rules={[{ required: true, message: 'لطفا وضعیت جلسه را انتخاب کنید' }]}
                >
                  <Select placeholder="انتخاب وضعیت">
                    <Option value="pending">در انتظار تایید</Option>
                    <Option value="confirmed">تایید شده</Option>
                    <Option value="completed">تکمیل شده</Option>
                    <Option value="cancelled">لغو شده</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          <FormSection 
            title="اطلاعات ارتباطی" 
            description="اطلاعات ارتباطی برای انجام جلسه مشاوره"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="messengerType"
                  label="نوع ارتباط"
                >
                  <Select placeholder="انتخاب نوع ارتباط" allowClear>
                    <Option value="telegram">تلگرام</Option>
                    <Option value="whatsapp">واتساپ</Option>
                    <Option value="phone">تماس تلفنی</Option>
                    <Option value="video">تماس تصویری</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="messengerId"
                  label="شناسه ارتباط"
                >
                  <Input placeholder="شناسه ارتباط مانند شماره موبایل یا آیدی تلگرام" />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          <FormSection 
            title="یادداشت‌های جلسه" 
            description="یادداشت‌های مربوط به این جلسه"
          >
            <Form.Item name="notes" label="یادداشت‌ها">
              <TextArea 
                rows={4} 
                placeholder="یادداشت‌های مربوط به این جلسه را وارد کنید..." 
              />
            </Form.Item>
          </FormSection>

          <FormActions
            submitText="ذخیره تغییرات"
            onCancel={handleBack}
            loading={submitting}
          />
        </Form>
      </Card>
    </div>
  );
}