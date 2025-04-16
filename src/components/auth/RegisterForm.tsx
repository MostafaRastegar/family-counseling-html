'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Radio, message } from 'antd';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = (values) => {
    setLoading(true);

    // شبیه‌سازی ارسال درخواست به سرور
    setTimeout(() => {
      setLoading(false);
      console.log('Register values:', values);
      message.success('ثبت نام با موفقیت انجام شد!');

      // در حالت استاتیک، هدایت به صفحه ورود
      router.push('/auth/login');
    }, 1500);
  };

  return (
    <Form name="register" onFinish={onFinish} layout="vertical">
      <Form.Item
        name="fullName"
        rules={[
          { required: true, message: 'لطفاً نام کامل خود را وارد کنید!' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="نام و نام خانوادگی"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'لطفاً ایمیل خود را وارد کنید!' },
          { type: 'email', message: 'ایمیل وارد شده معتبر نیست!' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="ایمیل" size="large" />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        rules={[
          { required: true, message: 'لطفاً شماره تماس خود را وارد کنید!' },
        ]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="شماره تماس"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'لطفاً رمز عبور خود را وارد کنید!' },
          { min: 6, message: 'رمز عبور باید حداقل 6 کاراکتر باشد!' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="رمز عبور"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'لطفاً تأیید رمز عبور را وارد کنید!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('رمز عبور و تأیید آن مطابقت ندارند!'),
              );
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="تأیید رمز عبور"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="role"
        rules={[
          { required: true, message: 'لطفاً نوع کاربری خود را انتخاب کنید!' },
        ]}
        initialValue="client"
      >
        <Radio.Group buttonStyle="solid" size="large" className="w-full">
          <Radio.Button value="client" className="w-1/2 text-center">
            مراجع
          </Radio.Button>
          <Radio.Button value="consultant" className="w-1/2 text-center">
            مشاور
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          ثبت نام
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
