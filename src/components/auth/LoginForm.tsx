'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = (values) => {
    setLoading(true);

    // شبیه‌سازی ارسال درخواست به سرور
    setTimeout(() => {
      setLoading(false);
      console.log('Login values:', values);
      message.success('ورود با موفقیت انجام شد!');

      // در حالت استاتیک، هدایت به داشبورد
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'لطفاً ایمیل خود را وارد کنید!' },
          { type: 'email', message: 'ایمیل وارد شده معتبر نیست!' },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="ایمیل"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'لطفاً رمز عبور خود را وارد کنید!' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="رمز عبور"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>مرا به خاطر بسپار</Checkbox>
          </Form.Item>

          <a
            className="text-blue-600 hover:text-blue-500"
            href="/auth/forgot-password"
          >
            فراموشی رمز عبور
          </a>
        </div>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          ورود
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
