import React, { useState } from 'react';
import {
  Alert,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  notification,
} from 'antd';
import FormActions from '../ui/forms/FormActions';
import FormSection from '../ui/forms/FormSection';

const { Option } = Select;

interface ProfileFormProps {
  initialValues?: any;
  userRole?: 'admin' | 'consultant' | 'client';
  onCancel?: () => void;
  onSuccess?: (values: any) => void;
  loading?: boolean;
  error?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues = {},
  userRole = 'client',
  onCancel,
  onSuccess,
  loading = false,
  error,
}) => {
  const [form] = Form.useForm();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // مقادیر پیش‌فرض برای فرم
  const defaultValues = {
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    education: '',
    bio: '',
    birthDate: null,
    gender: 'not_specified',
    ...initialValues,
  };

  const handleSubmit = async (values: any) => {
    try {
      // در حالت واقعی، اینجا باید اطلاعات به سرور ارسال شود
      // اما فعلا یک موفقیت شبیه‌سازی شده نشان می‌دهیم

      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitSuccess(true);

      notification.success({
        message: 'اطلاعات با موفقیت ذخیره شد',
        description: 'تغییرات شما با موفقیت ثبت شد.',
      });

      if (onSuccess) {
        onSuccess(values);
      }
    } catch (error) {
      notification.error({
        message: 'خطا در ذخیره اطلاعات',
        description:
          'متأسفانه خطایی در ذخیره اطلاعات رخ داده است. لطفا مجددا تلاش کنید.',
      });
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSubmitSuccess(false);
  };

  // تشخیص نمایش فیلدهای مختص مشاور
  const isConsultant = userRole === 'consultant';

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={defaultValues}
      onFinish={handleSubmit}
      className="profile-form"
    >
      {error && (
        <Alert
          message="خطا"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      {submitSuccess && (
        <Alert
          message="اطلاعات با موفقیت ذخیره شد"
          type="success"
          showIcon
          className="mb-6"
          closable
        />
      )}

      <FormSection
        title="اطلاعات شخصی"
        description="اطلاعات اصلی پروفایل خود را وارد کنید"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="fullName"
              label="نام و نام خانوادگی"
              rules={[
                {
                  required: true,
                  message: 'لطفا نام و نام خانوادگی خود را وارد کنید',
                },
              ]}
            >
              <Input placeholder="نام و نام خانوادگی خود را وارد کنید" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="ایمیل"
              rules={[
                { required: true, message: 'لطفا ایمیل خود را وارد کنید' },
                { type: 'email', message: 'ایمیل معتبر نیست' },
              ]}
            >
              <Input placeholder="ایمیل خود را وارد کنید" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="phoneNumber"
              label="شماره تماس"
              rules={[
                { required: true, message: 'لطفا شماره تماس خود را وارد کنید' },
                {
                  pattern: /^09\d{9}$/,
                  message: 'شماره تماس نامعتبر است',
                },
              ]}
            >
              <Input placeholder="مثال: 09123456789" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="gender" label="جنسیت">
              <Select placeholder="جنسیت خود را انتخاب کنید">
                <Option value="male">مرد</Option>
                <Option value="female">زن</Option>
                <Option value="not_specified">ترجیح می‌دهم نگویم</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="birthDate" label="تاریخ تولد">
              <DatePicker
                placeholder="انتخاب تاریخ تولد"
                className="w-full"
                format="YYYY/MM/DD"
              />
            </Form.Item>
          </Col>
        </Row>
      </FormSection>

      <FormSection
        title="اطلاعات تماس"
        description="آدرس و اطلاعات تماس خود را وارد کنید"
      >
        <Form.Item name="address" label="آدرس">
          <Input.TextArea rows={3} placeholder="آدرس خود را وارد کنید" />
        </Form.Item>
      </FormSection>

      {isConsultant && (
        <FormSection
          title="اطلاعات تخصصی"
          description="اطلاعات تخصصی خود را به عنوان مشاور وارد کنید"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24}>
              <Form.Item name="education" label="تحصیلات">
                <Input.TextArea
                  rows={2}
                  placeholder="مدارک و سوابق تحصیلی خود را وارد کنید"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="bio" label="درباره من">
                <Input.TextArea
                  rows={4}
                  placeholder="توضیحی درباره خود، تجربیات و تخصص‌های خود بنویسید"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="consultantLicense" label="شماره پروانه مشاوره">
                <Input placeholder="شماره پروانه مشاوره خود را وارد کنید" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
      )}

      <FormActions
        onCancel={onCancel}
        onReset={handleReset}
        loading={loading}
        showReset={true}
      />
    </Form>
  );
};

export default ProfileForm;
