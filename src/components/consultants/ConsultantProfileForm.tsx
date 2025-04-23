import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  notification,
} from 'antd';
import { specialties } from '@/mocks/specialties';
import FormActions from '../ui/forms/FormActions';
import FormSection from '../ui/forms/FormSection';

const { Option } = Select;
const { TextArea } = Input;

interface ConsultantProfileFormProps {
  initialValues?: any;
  onSuccess?: (values: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
}

const ConsultantProfileForm: React.FC<ConsultantProfileFormProps> = ({
  initialValues = {},
  onSuccess,
  onCancel,
  loading = false,
  error,
}) => {
  const [form] = Form.useForm();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // مقادیر پیش‌فرض برای فرم
  const defaultValues = {
    bio: '',
    specialties: [],
    education: '',
    experience: '',
    consultantLicense: '',
    consultantLicenseDocument: [],
    hourlyRate: 200000,
    sessionDuration: 60,
    ...initialValues,
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitSuccess(false);

      // شبیه‌سازی ارسال به سرور
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // نمایش پیام موفقیت
      setSubmitSuccess(true);
      notification.success({
        message: 'اطلاعات ذخیره شد',
        description: 'پروفایل مشاور با موفقیت به‌روزرسانی شد.',
      });

      // فراخوانی تابع callback موفقیت
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

  // تنظیم قوانین آپلود فایل
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={defaultValues}
      onFinish={handleSubmit}
      className="consultant-profile-form"
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
        title="معرفی حرفه‌ای"
        description="اطلاعات حرفه‌ای خود را وارد کنید تا مراجعان بهتر با شما آشنا شوند"
      >
        <Form.Item
          name="bio"
          label="درباره من"
          rules={[
            { required: true, message: 'لطفا معرفی خود را وارد کنید' },
            { min: 100, message: 'توضیحات باید حداقل 100 کاراکتر باشد' },
          ]}
        >
          <TextArea
            rows={5}
            placeholder="خود را به عنوان یک مشاور معرفی کنید و در مورد تجربیات و تخصص‌های خود توضیح دهید..."
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item
          name="specialties"
          label="تخصص‌ها"
          rules={[
            {
              required: true,
              message: 'لطفا حداقل یک تخصص انتخاب کنید',
              type: 'array',
              min: 1,
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="تخصص‌های خود را انتخاب کنید"
            maxTagCount={5}
            allowClear
          >
            {specialties.map((specialty) => (
              <Option key={specialty} value={specialty}>
                {specialty}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </FormSection>

      <FormSection
        title="تحصیلات و سوابق"
        description="اطلاعات تحصیلی و سوابق کاری خود را وارد کنید"
      >
        <Form.Item
          name="education"
          label="تحصیلات"
          rules={[
            { required: true, message: 'لطفا اطلاعات تحصیلی خود را وارد کنید' },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="مدارک تحصیلی، دانشگاه‌ها و سال‌های تحصیل خود را وارد کنید..."
          />
        </Form.Item>

        <Form.Item
          name="experience"
          label="سوابق کاری"
          rules={[
            { required: true, message: 'لطفا سوابق کاری خود را وارد کنید' },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="سوابق کاری، مراکز همکاری و سمت‌های خود را وارد کنید..."
          />
        </Form.Item>
      </FormSection>

      <FormSection
        title="اطلاعات پروانه مشاوره"
        description="اطلاعات پروانه مشاوره و مدارک مربوطه را وارد کنید"
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="consultantLicense"
              label="شماره پروانه مشاوره"
              rules={[
                {
                  required: true,
                  message: 'لطفا شماره پروانه مشاوره را وارد کنید',
                },
              ]}
            >
              <Input placeholder="شماره پروانه مشاوره خود را وارد کنید" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="consultantLicenseDocument"
              label="تصویر پروانه مشاوره"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: 'لطفا تصویر پروانه مشاوره را آپلود کنید',
                },
              ]}
              extra="فرمت‌های مجاز: PDF, JPG, PNG (حداکثر 5MB)"
            >
              <Upload
                name="license"
                maxCount={1}
                listType="text"
                beforeUpload={(file) => {
                  const isValidFormat =
                    file.type === 'application/pdf' ||
                    file.type === 'image/jpeg' ||
                    file.type === 'image/png';
                  const isValidSize = file.size / 1024 / 1024 < 5;

                  if (!isValidFormat) {
                    notification.error({
                      message: 'فرمت فایل نامعتبر است',
                      description:
                        'لطفا فایلی با فرمت PDF، JPG یا PNG آپلود کنید.',
                    });
                  }

                  if (!isValidSize) {
                    notification.error({
                      message: 'حجم فایل بیش از حد مجاز است',
                      description: 'حداکثر حجم مجاز 5 مگابایت است.',
                    });
                  }

                  return isValidFormat && isValidSize
                    ? true
                    : Upload.LIST_IGNORE;
                }}
                // در حالت واقعی این قسمت با API سرور ارتباط برقرار می‌کند
                // اما فعلا شبیه‌سازی می‌کنیم
                customRequest={({ onSuccess }) => {
                  setTimeout(() => {
                    onSuccess!('ok');
                  }, 1000);
                }}
              >
                <Button icon={<UploadOutlined />}>آپلود مدرک</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </FormSection>

      <FormSection
        title="تنظیمات جلسات مشاوره"
        description="تنظیمات مربوط به جلسات مشاوره خود را تعیین کنید"
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="hourlyRate"
              label="تعرفه هر ساعت (تومان)"
              rules={[
                { required: true, message: 'لطفا تعرفه هر ساعت را وارد کنید' },
              ]}
            >
              <InputNumber
                min={0}
                step={10000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="sessionDuration"
              label="مدت هر جلسه (دقیقه)"
              rules={[
                { required: true, message: 'لطفا مدت هر جلسه را وارد کنید' },
              ]}
            >
              <Select placeholder="مدت زمان هر جلسه را انتخاب کنید">
                <Option value={30}>30 دقیقه</Option>
                <Option value={45}>45 دقیقه</Option>
                <Option value={60}>1 ساعت</Option>
                <Option value={90}>1 ساعت و 30 دقیقه</Option>
                <Option value={120}>2 ساعت</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </FormSection>

      <FormActions
        onCancel={onCancel}
        onReset={handleReset}
        loading={loading}
        showReset={true}
        submitText="ذخیره اطلاعات مشاور"
      />
    </Form>
  );
};

export default ConsultantProfileForm;
