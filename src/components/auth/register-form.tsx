import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, Select, Typography } from 'antd';
import { UsersPresentation } from '@/modules/users/Users.presentation';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

interface RegisterFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: 'client' | 'consultant';
  agreeTerms: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  redirectUrl = '/dashboard',
}) => {
  const [form] = Form.useForm();
  const router = useRouter();

  // در حالت واقعی باید از متد مناسب برای ثبت‌نام استفاده شود
  // ولی فعلا از این متد موقت استفاده می‌کنیم
  const { useCreate } = UsersPresentation();
  const { mutate: register, isPending, error, isError } = useCreate();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (values: RegisterFormValues) => {
    const { fullName, email, phoneNumber, password, role } = values;

    // ارسال درخواست ثبت‌نام به سرور
    // در حالت واقعی باید اطلاعات کاربر به سرور ارسال شود
    register({
      name: fullName,
      username: email,
      email: email,
      // سایر اطلاعات مورد نیاز...
    });

    // نمایش پیام موفقیت (در حالت نمایشی)
    setShowSuccessMessage(true);

    // انتقال به صفحه لاگین بعد از چند ثانیه
    setTimeout(() => {
      router.push('/auth/login');
    }, 3000);
  };

  return (
    <div className="register-form-container">
      <Title level={3} className="mb-6 text-center">
        ثبت‌نام در سامانه
      </Title>

      {isError && (
        <Alert
          message="خطا در ثبت‌نام"
          description={
            error instanceof Error
              ? error.message
              : 'خطایی در ثبت‌نام رخ داده است. لطفا دوباره تلاش کنید.'
          }
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {showSuccessMessage && (
        <Alert
          message="ثبت‌نام با موفقیت انجام شد"
          description="اکنون می‌توانید با اطلاعات حساب کاربری خود وارد شوید."
          type="success"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="register"
        layout="vertical"
        initialValues={{ role: 'client' }}
        onFinish={handleSubmit}
        requiredMark={false}
      >
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
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="نام و نام خانوادگی خود را وارد کنید"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="ایمیل"
          rules={[
            { required: true, message: 'لطفا ایمیل خود را وارد کنید' },
            { type: 'email', message: 'لطفا یک ایمیل معتبر وارد کنید' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="ایمیل خود را وارد کنید"
            size="large"
          />
        </Form.Item>

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
          <Input
            prefix={<PhoneOutlined className="text-gray-400" />}
            placeholder="مثال: 09123456789"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="رمز عبور"
          rules={[
            { required: true, message: 'لطفا رمز عبور خود را وارد کنید' },
            { min: 8, message: 'رمز عبور باید حداقل 8 کاراکتر باشد' },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="رمز عبور خود را وارد کنید"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="تکرار رمز عبور"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'لطفا رمز عبور خود را تکرار کنید' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('رمز عبور و تکرار آن مطابقت ندارند'),
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="رمز عبور خود را مجدد وارد کنید"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="نوع کاربری"
          rules={[
            { required: true, message: 'لطفا نوع کاربری خود را انتخاب کنید' },
          ]}
        >
          <Select size="large" placeholder="انتخاب نوع کاربری">
            <Option value="client">مراجع</Option>
            <Option value="consultant">مشاور</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="agreeTerms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error('پذیرش قوانین و مقررات الزامی است'),
                    ),
            },
          ]}
        >
          <Checkbox>
            <Text>
              <span>با </span>
              <Link href="/terms" className="text-primary-500">
                قوانین و مقررات
              </Link>
              <span> سایت موافقم</span>
            </Text>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isPending}
          >
            ثبت‌نام
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text>
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link href="/auth/login" className="text-primary-500">
              <Text className="hover:text-primary-600">وارد شوید</Text>
            </Link>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
